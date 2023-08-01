const User = require('../models/user');

const VALIDATION_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const ANOTHER_ERROR_CODE = 500;

const errorMessages = {
  getUserById404: 'Пользователь по указанному _id не найден.',
  createUser400: 'Переданы некорректные данные при создании пользователя.',
  updateUser400: 'Переданы некорректные данные при обновлении профиля.',
  updateUser404: 'Пользователь с указанным _id не найден.',
  updateAvatar400: 'Переданы некорректные данные при обновлении аватара.',
  updateAvatar404: 'Пользователь с указанным _id не найден.',
};

const checkError = (err, res, funcName) => {
  if (err.name === 'CastError') {
    return (res.status(NOT_FOUND_ERROR_CODE).send({
      message: `${errorMessages[funcName + NOT_FOUND_ERROR_CODE]}`,
    }));
  } if (err.name === 'ValidationError') {
    return (res.status(VALIDATION_ERROR_CODE).send({
      message: `${errorMessages[funcName + VALIDATION_ERROR_CODE]}`,
    }));
  }
  return (res.status(ANOTHER_ERROR_CODE).send({
    message: 'На сервере произошла ошибка',
  }));
};

const checkUser = (user, res, funcName) => {
  if (!user) {
    return (res.status(NOT_FOUND_ERROR_CODE).send({
      message: `${errorMessages[funcName + NOT_FOUND_ERROR_CODE]}`,
    }));
  }
  return res.send({ user });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => checkError(err, res, 'getAllUsers'));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => checkUser(user, res, 'getUserById'))
    .catch((err) => checkError(err, res, 'getUserById'));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => checkError(err, res, 'createUser'));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ user }))
    .catch((err) => checkError(err, res, 'updateUser'));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ user }))
    .catch((err) => checkError(err, res, 'updateAvatar'));
};
