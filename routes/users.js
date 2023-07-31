const router = require('express').Router();
const bodyParser = require('body-parser');
const { getAllUsers, getUserById, createUser } = require('../controllers/users');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/users', getAllUsers);

router.get('/users/:userId', getUserById);

router.post('/users', createUser);

module.exports = router;
