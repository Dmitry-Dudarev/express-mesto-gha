const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUserData,
} = require('../controllers/users');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/users/me', getCurrentUserData);
router.get('/users', getAllUsers);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+\.{1}[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]+#?$/i).required(),
  }),
}), updateAvatar);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).pattern(/[a-z0-9]+/),
  }),
}), getUserById);

module.exports = router;
