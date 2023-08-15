const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const {
  getAllCards,
  addNewCard,
  deleteCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/cards', getAllCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/^https?:\/\/(www\.)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+\.{1}[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+#?$/i).required(),
  }),
}), addNewCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).pattern(/[a-z0-9]+/),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).pattern(/[a-z0-9]+/),
  }),
}), addLike);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).pattern(/[a-z0-9]+/),
  }),
}), removeLike);

module.exports = router;
