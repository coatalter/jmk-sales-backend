const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor() {
    this._pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,

      ssl: {
        rejectUnauthorized: false, 
      },
    });

    this._secretKey = process.env.ACCESS_TOKEN_KEY || 'kunci_rahasia_sementara';
  }

  // 1. LOGIN (Verifikasi + Generate Token)
  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT user_id, name, email, password_hash, role FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      console.log(`❌ LOGIN GAGAL: Email ${email} tidak ditemukan`);
      throw new Error('Email tidak ditemukan');
    }

    const user = result.rows[0];

    // --- CCTV LOG ---
    console.log("🔍 DEBUG LOGIN:");
    console.log("Email:", email);
    // console.log("Hash DB:", user.password_hash); // Nyalakan kalau mau cek hash
    
    const match = await bcrypt.compare(password, user.password_hash);
    
    if (!match) {
      console.log("❌ LOGIN GAGAL: Password Salah");
      throw new Error('Password salah');
    }

    console.log("✅ LOGIN SUKSES!");

    const accessToken = jwt.sign(
      { id: user.user_id, role: user.role }, 
      this._secretKey, 
      { expiresIn: '1d' } 
    );

    return {
      user: { id: user.user_id, name: user.name, email: user.email, role: user.role },
      token: accessToken
    };
  }

  // 2. REGISTER 
  async registerUser({ name, email, password, role }) {
    const checkUser = await this._pool.query('SELECT email FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      throw new Error('Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role',
      values: [name, email, hashedPassword, role || 'sales'],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  // 3. GET ALL USERS (Fix Query agar support 'id' atau 'user_id')
  async getAllUsers() {
    // Kita gunakan alias "user_id" supaya aman apapun nama kolom aslinya
    const result = await this._pool.query("SELECT user_id, name, email, role FROM users WHERE role = 'sales'");
    return result.rows;
  }
  
  // 4. DELETE USER
  async deleteUser(id) {
    const query = {
      text: 'DELETE FROM users WHERE user_id = $1 RETURNING user_id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('User tidak ditemukan');
    }
  }
}

module.exports = AuthService;
