const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const User = require('../models/user');
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');
const path = require('path');

// Endpoint untuk mengunggah gambar profil
router.post('/uploadProfilePic', authenticate, upload.single('profilePic'), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    user.profilePic = req.file.path; // Simpan path gambar ke database
    await user.save();
    res.json({
      message: 'Profile picture uploaded successfully',
      filePath: req.file.path
    });
  } catch (err) {
    next(err);
  }
});

// Endpoint untuk mengambil gambar profil
router.get('/profilePic/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.profilePic) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }
    // Konstruksi path lengkap ke gambar
    const imagePath = path.join(__dirname, '..', user.profilePic);
    res.sendFile(imagePath);
  } catch (err) {
    next(err);
  }
});

// Endpoint untuk mendapatkan data user
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = page * limit;

    const whereClause = {
      [Op.or]: [{
        username: {
          [Op.like]: '%' + search + '%'
        }
      }]
    };

    const totalRows = await User.count({ where: whereClause });
    const totalPages = Math.ceil(totalRows / limit);

    if (totalRows === 0) {
      return res.json({
        message: 'Tidak ada data',
      });
    }

    const result = await User.findAll({
      where: whereClause,
      offset: offset,
      limit: limit,
      order: [['id', 'DESC']]
    });

    res.json({
      page,
      limit,
      totalRows,
      totalPages,
      result,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;