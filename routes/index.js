const { celebrate, Joi, errors } = require('celebrate');
const router = require('express').Router();
const userRouters = require('./users');
const cardRouters = require('./cards');
const auth = require('../middlewares/auth');
const { requestLogger, errorLogger } = require('../middlewares/logger');

const { createUser, login } = require('../controllers/users');

const NotFoundError = require('../errors/not-found-error');

router.use(requestLogger);

// краш-тест
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+\.{1}[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);

router.use('/', cardRouters);
router.use('/', userRouters);

router.use((req, res, next) => {
  const error = new NotFoundError('Страница не найдена');
  next(error);
});

router.use(errorLogger);

router.use(errors());

router.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

module.exports = router;
