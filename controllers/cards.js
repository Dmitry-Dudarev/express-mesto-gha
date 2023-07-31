const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.addNewCard = (req, res) => {
  const { name, link } = req.body;
  const { user } = req;
  Card.create({ name, link, owner: user })
    .then((card) => res.send({ card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};
