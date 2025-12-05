class AuthHandler {
  constructor(service) {
    this._service = service;

    this.postLoginHandler = this.postLoginHandler.bind(this);
    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUsersHandler = this.getUsersHandler.bind(this);
    this.deleteUserHandler = this.deleteUserHandler.bind(this);
  }

  // LOGIN
  async postLoginHandler(request, h) {
    try {
      const { email, password } = request.payload;
      const { user, token } = await this._service.verifyUserCredential(email, password);

      return {
        status: 'success',
        data: { user, token },
      };
    } catch (error) {
      console.error("Login Error:", error.message);
      return h.response({ status: 'fail', message: error.message }).code(401);
    }
  }

  // REGISTER
  async postUserHandler(request, h) {
    try {
      const { name, email, password, role } = request.payload;
      const newUser = await this._service.registerUser({ name, email, password, role });

      return h.response({
        status: 'success',
        data: newUser,
      }).code(201);
    } catch (error) {
      console.error("Register Error:", error.message);
      return h.response({ status: 'fail', message: error.message }).code(400);
    }
  }

  // GET USERS
  async getUsersHandler() {
    const users = await this._service.getAllUsers();
    return { status: 'success', data: users };
  }

  // DELETE USER (YANG KITA PERBAIKI)
  async deleteUserHandler(request, h) {
    try {
      const { id } = request.params;
      
      // Panggil service
      await this._service.deleteUser(id);
      
      return { status: 'success', message: 'User berhasil dihapus' };
    } catch (error) {
      console.error("🔥 ERROR DELETE USER:", error.message); // <--- CCTV NYALA
      
      // Cek apakah error karena Constraint Database (Kode Postgres 23503)
      if (error.code === '23503') {
         return h.response({ 
           status: 'fail', 
           message: 'Gagal hapus: User ini masih terhubung dengan data Nasabah.' 
         }).code(400);
      }

      return h.response({ status: 'error', message: error.message }).code(500);
    }
  }
}

module.exports = AuthHandler;