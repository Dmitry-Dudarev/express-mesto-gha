const router = require('express').Router();

// const { celebrate, Joi } = require('celebrate');

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

router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.get('/users/me', getCurrentUserData);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
