# Belajar Membuat Aplikasi Backend Menggunakan Node JS dan Express

## Author

Nama:

`Wibie Mahardhika Adi`

NIM:

`2100016081`

## Cara Instalasi

### 1. Clone Repository
Clone repository project dari GitHub menggunakan command berikut:
```bash
git clone https://github.com/Wibiemahardhika22/DPSI-BACKEND-24.git
```

### 2. Direktori Project
Masuk ke direktori project yang telah di-clone:
```bash
cd DPSI-BACKEND-24
```

### 3. Install Dependencies
Instal semua dependencies yang diperlukan menggunakan npm:
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Buat file `.env` dari template `.env.example` menggunakan perintah:
```bash
cp .env.example .env
```

Kemudian sesuaikan isi dari file .env. Contoh:
```bash
PORT=3000
DB_DIALECT=mysql
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=db_saya
JWT_SECRET=iniadalahkuncirahasia
```

### 5. Menjalankan Server
Jalankan server dengan perintah berikut:
```bash
npm start
```

Anda juga bisa menggunakan nodemon untuk menjalankan server dengan perintah:
```bash
nodemon .\app.js 
```

### 6. Verifikasi
Buka browser/postman dan akses http://localhost:3000 untuk memastikan server berjalan dengan baik.