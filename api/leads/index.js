const LeadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'leads',
  version: '1.0.0',
  register: async (server, { service }) => {
    const handler = new LeadsHandler(service);
    server.route(routes(handler));
  },
};