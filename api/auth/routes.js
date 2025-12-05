const routes = (handler) => [
  // 1. Login
  {
    method: 'POST',
    path: '/login',
    handler: handler.postLoginHandler,
  },
  
  // 2. Register User Baru
  {
    method: 'POST',
    path: '/users', 
    handler: handler.postUserHandler,
  },
  
  // 3. Lihat Daftar User
  {
    method: 'GET',
    path: '/users', 
    handler: handler.getUsersHandler,
  },
  
  // 4. Hapus User 
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: handler.deleteUserHandler,
  },
];

module.exports = routes;