const routes = (handler) => [
  {
    method: 'GET',
    path: '/leads',
    handler: handler.getLeadsHandler,
  },
  {
    method: 'GET',
    path: '/leads/{id}',
    handler: handler.getLeadByIdHandler,
  },
  {
    method: 'GET',
    path: '/leads-stats',
    handler: handler.getLeadsStatsHandler,
  },
  {
    method: 'PUT', // Route Update
    path: '/leads/{id}',
    handler: handler.editLeadStatusHandler,
    options: {
      payload: {
        allow: 'application/json',
        parse: true
      }
    }
  },
  {
    method: 'GET', // Route Logs
    path: '/logs',
    handler: handler.getLogsHandler,
  },
  {
    method: 'GET', // Route Leaderboard
    path: '/leaderboard',
    handler: handler.getLeaderboardHandler,
  },
];

module.exports = routes;