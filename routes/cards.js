const router = require('express').Router();
const bodyParser = require('body-parser');
const { getAllCards, addNewCard, deleteCard } = require('../controllers/cards');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/cards', getAllCards);

router.post('/cards', addNewCard);

router.delete('/cards/:cardId', deleteCard);

module.exports = router;
