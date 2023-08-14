const express = require('express');
const mongoose = require('mongoose');
const userRouters = require('./routes/users');
const cardRouters = require('./routes/cards');

const NOT_FOUND_ERROR_CODE = 404;

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64d93cd33bfe5ad8fade9301',
  };
  next();
});
app.use('/', cardRouters);
app.use('/', userRouters);
app.use((req, res, next) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не найдена' });
  next();
});

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере проиdзошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
