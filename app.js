var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

var sequelize = require('./models/index');
const { authenticate, authorize } = require('./middleware/auth');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var customersRouter = require('./routes/customers');
var employeeRouter = require('./routes/employee');
var shipperRouter = require('./routes/shipper');
var supplierRouter = require('./routes/supplier');
var productsRouter = require('./routes/products');
var orderRouter = require('./routes/order');
var orderDetailRouter = require('./routes/orderDetail');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/customers', customersRouter);
app.use('/employee', employeeRouter);
app.use('/shipper', shipperRouter);
app.use('/supplier', authenticate, authorize(['admin']), supplierRouter);
app.use('/products', productsRouter);
app.use('/order', authenticate, orderRouter);
app.use('/orderDetail', orderDetailRouter);

sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
