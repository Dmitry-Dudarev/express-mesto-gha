const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { login, createUser } = require('./controllers/users');
const userRouters = require('./routes/users');
const cardRouters = require('./routes/cards');
const auth = require('./middlewares/auth');

const NOT_FOUND_ERROR_CODE = 404;

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+\.{1}[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+#?$/i).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64dac139f1bd230482156f50'
//   };

//   next();
// });
app.use(auth);
app.use('/', cardRouters);
app.use('/', userRouters);
app.use((req, res, next) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не найдена' });
  next();
});
app.use(errors());
// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
