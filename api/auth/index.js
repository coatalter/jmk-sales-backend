const AuthHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'auth',
  version: '1.0.0',
  register: async (server, { service }) => {
    const handler = new AuthHandler(service);
    server.route(routes(handler));
  },
};