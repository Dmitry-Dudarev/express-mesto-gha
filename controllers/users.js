const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ValidationError = require('../errors/validation-error');
const NotFoundError = require('../errors/not-found-error');
// const LoginError = require('../errors/login-error');
const EmailDuplicationError = require('../errors/email-duplication-error');

// const VALIDATION_ERROR_CODE = 400;
// const NOT_FOUND_ERROR_CODE = 404;
// const ANOTHER_ERROR_CODE = 500;
// const INVALID_LOGIN_ERROR_CODE = 401;
// const INVALID_OWNERSHIP_ERROR_CODE = 403;
// const EMAIL_DUPLICATION_ERROR_CODE = 409;

// const errorMessages = {
//   getUserById400: 'Пользователь по указанному _id не найден.',
//   createUser400: 'Переданы некорректные данные при создании пользователя.',
//   updateUser400: 'Переданы некорректные данные при обновлении профиля.',
//   updateUser404: 'Пользователь с указанным _id не найден.',
//   updateAvatar400: 'Переданы некорректные данные при обновлении аватара.',
//   updateAvatar404: 'Пользователь с указанным _id не найден.',
// };

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ValidationError('Пользователь по указанному _id не найден.');
      }
      return res.send({ user });
    })
    .catch(next);
};

module.exports.getCurrentUserData = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Сбой при получении данных');
      }
      return res.send({ user });
    })
    .catch(next);
};

// module.exports.createUser = (req, res, next) => {
//   const {
//     name,
//     about,
//     avatar,
//     email,
//     password,
//   } = req.body;
//   bcrypt.hash(password, 10)
//     .then((hash) => User.create({
//       name,
//       about,
//       avatar,
//       email,
//       password: hash,
//     })
//       .then((user) => res.send({ user })))
//     .catch(next);
// };

// верни ебучие пробелы
module.exports.createUser = async (req, res, next) => {
  let user;
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
      user = await User.create({
        name, about, avatar, email, password: hash,
      });
    } catch (err) {
      if (err.code === 11000) {
        const error = new EmailDuplicationError('Пользователь с такой почтой существует');
        next(error);
      }
    }
  } catch (err) {
    next(err);
  }
  return res.send({ user });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.send({ user });
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      res.send({ user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
