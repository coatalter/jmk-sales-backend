const jwt = require('jsonwebtoken'); // Pastikan sudah npm install jsonwebtoken

class LeadsHandler {
  constructor(service) {
    this._service = service;

    this.getLeadsHandler = this.getLeadsHandler.bind(this);
    this.getLeadByIdHandler = this.getLeadByIdHandler.bind(this);
    this.getLeadsStatsHandler = this.getLeadsStatsHandler.bind(this);
    this.editLeadStatusHandler = this.editLeadStatusHandler.bind(this);
    this.getLogsHandler = this.getLogsHandler.bind(this);
    this.getLeaderboardHandler = this.getLeaderboardHandler.bind(this);
  }

  async getLeadsHandler(request, h) {
    try {
      const { minProbability, job } = request.query;
      const leads = await this._service.getLeads({
        minProbability: minProbability !== undefined ? Number(minProbability) : undefined,
        job,
      });
      return { status: 'success', data: leads };
    } catch (error) {
      console.error("🔥 ERROR GET LEADS:", error);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  }

  async getLeadByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const lead = await this._service.getLeadById(id);
      if (!lead) return h.response({ status: 'fail', message: 'Not Found' }).code(404);
      return { status: 'success', data: lead };
    } catch (error) {
      console.error("🔥 ERROR GET ID:", error);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  }

  async getLeadsStatsHandler(request, h) {
    try {
      const stats = await this._service.getStats();
      return { status: 'success', data: stats };
    } catch (error) {
      console.error("🔥 ERROR STATS:", error);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  }

  async editLeadStatusHandler(request, h) {
    try {
      const { id } = request.params;
      const { status, notes } = request.payload;

      // 1. Ambil Header Authorization
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        return h.response({ status: 'fail', message: 'Unauthorized: Token missing' }).code(401);
      }

      // 2. Decode Token
      const token = authHeader.split(' ')[1];
      // Pastikan secret key 
      const secretKey = process.env.ACCESS_TOKEN_KEY || 'kunci_rahasia_sementara'; 
      
      let salesId = null;
      try {
        const decoded = jwt.verify(token, secretKey);
        salesId = decoded.id; 
      } catch (err) {
        return h.response({ status: 'fail', message: 'Unauthorized: Invalid token' }).code(401);
      }

      // 3. Kirim ke Service (+ salesId)
      const result = await this._service.editLeadStatus(id, { status, notes, salesId });

      return { status: 'success', message: 'Update berhasil', data: result };
    } catch (error) {
      console.error("🔥 ERROR UPDATE:", error);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  }

  async getLogsHandler(request, h) {
    try {
      const logs = await this._service.getLogs();
      return { status: 'success', data: logs };
    } catch (error) {
      console.error("🔥 ERROR LOGS:", error);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  }

  async getLeaderboardHandler(request, h) {
    try {
      const leaderboard = await this._service.getLeaderboard();
      return { status: 'success', data: leaderboard };
    } catch (error) {
      console.error("🔥 ERROR LEADERBOARD:", error);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  }
}

module.exports = LeadsHandler;