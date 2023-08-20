require('dotenv').config();
const jwt = require('jsonwebtoken');
const LoginError = require('../errors/login-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new LoginError('Нет заголовка в запросе');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    const { NODE_ENV, JWT_SECRET } = process.env;
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    const error = new LoginError('Пройдите авторизацию');
    next(error);
  }
  req.user = payload;
  next();
};
