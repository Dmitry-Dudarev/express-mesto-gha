const router = require('express').Router();
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
router.post('/cards', addNewCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', addLike);
router.delete('/cards/:cardId/likes', removeLike);

module.exports = router;
