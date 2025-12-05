 JMK Sales Backend API

Layanan RESTful API yang mendukung JMK Sales Dashboard.

Backend ini berfungsi sebagai pusat logika bisnis, manajemen data pelanggan, autentikasi pengguna, dan penyedia algoritma prediksi (scoring system) untuk frontend.

🛠️ Arsitektur & Teknologi

Backend ini dibangun dengan fokus pada keamanan, kecepatan, dan skalabilitas data.

Core Stack

Runtime: Node.js

Framework: Express.js (untuk routing dan middleware)

Database: PostgreSQL (Relational Database)

ORM: Prisma / Sequelize (Sesuaikan dengan yang digunakan)

Authentication: JSON Web Token (JWT) & Bcrypt

✨ Fitur Backend

Secure Auth: Login & Register dengan hashing password dan validasi token JWT.

Lead Scoring Logic: Algoritma di sisi server untuk menghitung probabilitas konversi pelanggan (Cold/Warm/Hot).

Data Management: CRUD penuh untuk data Pelanggan (Leads) dan User Sales.

Activity Logging: Mencatat setiap request perubahan data untuk fitur Audit Trail di frontend.

CORS Config: Dikonfigurasi untuk mengizinkan request dari klien frontend dalam satu domain/local.

📂 Struktur Direktori (Monorepo Context)

Karena ini adalah bagian dari monorepo, pastikan Anda berada di direktori backend sebelum menjalankan perintah terminal.

root-repo/
├── client/         # Frontend React
├── server/         # Backend Express (Lokasi README ini) 👈
│   ├── config/     # Konfigurasi DB & Env
│   ├── controllers/# Logika request/response
│   ├── models/     # Skema Database
│   ├── routes/     # Definisi Endpoint API
│   └── app.js      # Entry point
└── README.md       # Dokumentasi Utama


🚀 Cara Menjalankan (Development)

Pastikan Anda telah menginstall Node.js dan PostgreSQL di komputer Anda.

1. Masuk ke Direktori Backend

Dari root folder repository:

cd server


2. Install Dependencies

npm install


3. Konfigurasi Environment (.env)

Buat file .env di dalam folder server/ dan sesuaikan variabel berikut:

PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/jmk_sales_db"
JWT_SECRET="kunci_rahasia_anda_disini"
NODE_ENV="development"


4. Database Setup (Migrasi)

Jika menggunakan Prisma/Sequelize, jalankan migrasi untuk membuat tabel:

# Contoh jika menggunakan Prisma
npx prisma migrate dev --name init


5. Jalankan Server

npm run dev
# Server akan berjalan di http://localhost:5000


🔌 Dokumentasi API Endpoint

Berikut adalah ringkasan endpoint utama yang tersedia.

🔐 Authentication

Method

Endpoint

Deskripsi

POST

/api/auth/login

Login user sales & menerima JWT Token

POST

/api/auth/register

Mendaftarkan akun sales baru

GET

/api/auth/me

Cek user yang sedang login

👥 Customers / Leads

Method

Endpoint

Deskripsi

GET

/api/customers

Mengambil semua data prospek (mendukung filter & sort)

GET

/api/customers/:id

Detail lengkap satu pelanggan

POST

/api/customers

Menambah data prospek baru

PUT

/api/customers/:id

Update status/data pelanggan

DELETE

/api/customers/:id

Menghapus data pelanggan

📊 Dashboard & Analytics

Method

Endpoint

Deskripsi

GET

/api/stats/summary

Mengambil data ringkasan KPI (Total Leads, Hot Leads)

GET

/api/stats/performance

Data untuk grafik performa bulanan

🤝 Kontribusi & Workflow

Pastikan branch frontend dan backend tetap sinkron jika ada perubahan struktur data JSON.

Gunakan Postman atau Insomnia untuk menguji endpoint sebelum integrasi dengan React.

Catatan: Backend ini berjalan di port 5000 secara default. Pastikan proxy di vite.config.js pada frontend diarahkan ke port ini atau gunakan CORS yang sesuai.
