const Card = require('../models/card');

const VALIDATION_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const ANOTHER_ERROR_CODE = 500;

const errorMessages = {
  addNewCard400: 'Переданы некорректные данные при создании карточки.',
  deleteCard404: 'Карточка с указанным _id не найдена.',
  addLike400: 'Переданы некорректные данные для постановки лайка.',
  addLike404: 'Передан несуществующий _id карточки / пользователя.',
  removeLike400: 'Переданы некорректные данные для снятия лайка.',
  removeLike404: 'Передан несуществующий _id карточки / пользователя.',
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

const checkCard = (card, res, funcName) => {
  if (!card) {
    return (res.status(NOT_FOUND_ERROR_CODE).send({
      message: `${errorMessages[funcName + NOT_FOUND_ERROR_CODE]}`,
    }));
  }
  return res.send({ card });
};

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => checkError(err, res, 'getAllCards'));
};

module.exports.addNewCard = (req, res) => {
  const { name, link } = req.body;
  const { user } = req;
  Card.create({ name, link, owner: user })
    .then((card) => res.send({ card }))
    .catch((err) => checkError(err, res, 'addNewCard'));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ card }))
    .catch((err) => checkError(err, res, 'deleteCard'));
};
//
module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => checkCard(card, res, 'addLike'))
    .catch((err) => checkError(err, res, 'addLike'));
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => checkCard(card, res, 'removeLike'))
    .catch((err) => checkError(err, res, 'removeLike'));
};
