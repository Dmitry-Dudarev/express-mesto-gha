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
    _id: '64c79f841414b83e07695e51',
  };
  next();
});
app.use('/', cardRouters);
app.use('/', userRouters);
app.use((req, res, next) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не найдена' });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
