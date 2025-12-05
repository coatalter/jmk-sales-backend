# 🗄️ JMK Sales Backend API

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

> **Layanan RESTful API yang mendukung JMK Sales Dashboard.**

Backend ini berfungsi sebagai pusat logika bisnis, manajemen data pelanggan, autentikasi pengguna, dan penyedia algoritma prediksi (scoring system) untuk frontend.

---

## 🛠️ Arsitektur & Teknologi

Backend ini dibangun dengan fokus pada keamanan, kecepatan, dan skalabilitas data.

### Core Stack
* **Runtime:** Node.js
* **Framework:** Express.js (untuk routing dan middleware)
* **Database:** PostgreSQL (Relational Database)
* **ORM:** Prisma / Sequelize *(Sesuaikan dengan yang digunakan)*
* **Authentication:** JSON Web Token (JWT) & Bcrypt

### ✨ Fitur Backend
* **Secure Auth:** Login & Register dengan hashing password dan validasi token JWT.
* **Lead Scoring Logic:** Algoritma di sisi server untuk menghitung probabilitas konversi pelanggan (Cold/Warm/Hot).
* **Data Management:** CRUD penuh untuk data Pelanggan (Leads) dan User Sales.
* **Activity Logging:** Mencatat setiap *request* perubahan data untuk fitur Audit Trail di frontend.
* **CORS Config:** Dikonfigurasi untuk mengizinkan request dari klien frontend dalam satu domain/local.

---

## 📂 Struktur Direktori (Monorepo Context)

Karena ini adalah bagian dari monorepo, pastikan Anda berada di direktori backend sebelum menjalankan perintah terminal.

```text
root-repo/
├── client/         # Frontend React
├── server/         # Backend Express (Lokasi README ini) 👈
│   ├── config/     # Konfigurasi DB & Env
│   ├── controllers/# Logika request/response
│   ├── models/     # Skema Database
│   ├── routes/     # Definisi Endpoint API
│   └── app.js      # Entry point
└── README.md       # Dokumentasi Utama
