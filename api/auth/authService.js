const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  constructor() {
    this._pool = new Pool();
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
      throw new Error('Email tidak ditemukan');
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      throw new Error('Password salah');
    }

    // Buat JWT Token
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

  // 3. GET ALL USERS 
  async getAllUsers() {
    const result = await this._pool.query("SELECT user_id, name, email, role FROM users WHERE role = 'sales'");
    return result.rows;
  }
  
  // 4. DELETE USER
  async deleteUser(id) {
    await this._pool.query('DELETE FROM users WHERE user_id = $1', [id]);
  }
}

module.exports = AuthService;
