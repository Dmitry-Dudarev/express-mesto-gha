const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: '../request.log', level: 'debug' }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: '../error.log', level: 'warn' }),
  ],
  format: winston.format.json(),
});

module.exports = { requestLogger, errorLogger };
