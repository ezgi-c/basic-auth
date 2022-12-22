const express = require('express');
const { authRoutes } = require('./auth');

const server = express();

server.use(express.json());

server.use(authRoutes);

module.exports = {
  server,
};
