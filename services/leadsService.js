const { Pool } = require('pg');

class LeadsService {
  constructor() {
    this._pool = new Pool(); 
  }

  async getLeads({ minProbability, job } = {}) {
    const params = [];
    const where = [];

    if (minProbability !== undefined) {
      params.push(minProbability);
      where.push(`h.predicted_score >= $${params.length}`);
    }

    if (job && job !== 'All') {
      params.push(job);
      where.push(`n.job = $${params.length}`);
    }

    let query = `
      SELECT
        n.nasabah_id, n.age, n.job, n.marital, n.education, n.phone, n.housing, n.loan, 
        n.status, n.notes, n.updated_at,     
        h.predicted_score AS probability, h.model_version, h.calculation_date
      FROM nasabah n
      JOIN hasil_perhitungan_probabilitas h ON h.nasabah_id = n.nasabah_id
    `;

    if (where.length > 0) {
      query += ` WHERE ${where.join(' AND ')}`;
    }
    query += ` ORDER BY h.predicted_score DESC`;

    const result = await this._pool.query(query, params);
    return result.rows;
  }

  async getLeadById(id) {
    const query = {
      text: `SELECT n.*, h.predicted_score AS probability, h.model_version, h.calculation_date
             FROM nasabah n
             JOIN hasil_perhitungan_probabilitas h ON h.nasabah_id = n.nasabah_id
             WHERE n.nasabah_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) return null;
    return result.rows[0];
  }

  async getStats() {
    const total = await this._pool.query('SELECT COUNT(*) AS c FROM nasabah');
    const hot = await this._pool.query(
      `SELECT COUNT(*) AS c FROM nasabah n
       JOIN hasil_perhitungan_probabilitas h ON h.nasabah_id = n.nasabah_id
       WHERE h.predicted_score >= 0.7`
    );
    return {
      total: Number(total.rows[0].c),
      hot: Number(hot.rows[0].c),
      convRate: total.rows[0].c > 0 ? Math.round((hot.rows[0].c / total.rows[0].c) * 100) : 0,
    };
  }
  async editLeadStatus(id, { status, notes, salesId }) {
    const updatedAt = new Date().toISOString();
    
    const query = {
      text: `
        UPDATE nasabah 
        SET status = $1, notes = $2, updated_at = $3, sales_id = $4 
        WHERE nasabah_id = $5 
        RETURNING name
      `,
      values: [status, notes, updatedAt, salesId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Gagal update. ID tidak ditemukan.');
    }

    const nasabahName = result.rows[0].name;

    const salesQuery = await this._pool.query('SELECT name FROM users WHERE user_id = $1', [salesId]);
    const salesName = salesQuery.rows.length ? salesQuery.rows[0].name : `Sales #${salesId}`;

    const actionText = status === 'closing' ? 'Berhasil Closing' : 'Update Status';
    
    await this._pool.query(
      `INSERT INTO activity_logs (user_name, action, target) VALUES ($1, $2, $3)`,
      [salesName, actionText, nasabahName]
    );
    
    return result.rows[0];
  }

  async getLogs() {
    const result = await this._pool.query('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 20');
    return result.rows.map(row => ({
      user: row.user_name,
      action: row.action,
      target: row.target,
      time: row.created_at
    }));
  }

  async getLeaderboard() {
    const query = `
      SELECT u.name, COUNT(n.nasabah_id) as deals
      FROM nasabah n
      JOIN users u ON n.sales_id = u.user_id
      WHERE n.status = 'closing' 
      GROUP BY u.name 
      ORDER BY deals DESC 
      LIMIT 5
    `;
    const result = await this._pool.query(query);
    return result.rows.map((row, index) => ({
      id: index + 1,
      name: row.name,
      deals: Number(row.deals),
      score: Number(row.deals) * 10,
      avatar: (row.name || 'U').charAt(0).toUpperCase()
    }));
  }
}

module.exports = LeadsService;