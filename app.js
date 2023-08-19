require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const complexRouters = require('./routes/index');

const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors);

app.use(complexRouters);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
