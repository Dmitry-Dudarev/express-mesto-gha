const cors = require('cors');

const allowedCors = [
  'https://front746.nomoreparties.co',
  'http://front746.nomoreparties.co',
  'localhost:3000',
];

const corsSettings = {
  origin: allowedCors,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: '*',
};

module.exports = (cors(corsSettings));
