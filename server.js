require('dotenv').config();
const Hapi = require('@hapi/hapi');

const LeadsService = require('./services/leadsService');
const AuthService = require('./api/auth/authService'); 
const leadsPlugin = require('./api/leads');
const authPlugin = require('./api/auth');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5001,
    host: process.env.HOST || 'localhost',
    
    routes: {
      cors: {
        origin: ['*'], 
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['cache-control', 'x-requested-with'],
        exposedHeaders: ['Accept'],
        additionalExposedHeaders: ['Accept'],
        maxAge: 60,
        credentials: true
      },
      payload: {
        parse: true,
        allow: ['application/json', 'multipart/form-data'] 
      }
    },
    // --------------------------------------
  });


  // 1. Inisialisasi Service
  const leadsService = new LeadsService();
  const authService = new AuthService();

  // 2. Register Plugin (Leads & Auth)
  await server.register([
    {
      plugin: leadsPlugin,
      options: {
        service: leadsService,
      },
    },
    {
      plugin: authPlugin,
      options: {
        service: authService,
      },
    },
  ]);

  await server.start();
  console.log(`✅ Hapi server running at: ${server.info.uri}`);
};

init();