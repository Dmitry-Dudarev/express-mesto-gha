const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const OwnershipError = require('../errors/ownership-error');
const ValidationError = require('../errors/validation-error');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate({
      path: 'owner',
      select: 'name about avatar _id',
    })
    .populate({
      path: 'likes',
      select: 'name about avatar _id',
    })
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.addNewCard = (req, res, next) => {
  const { name, link } = req.body;
  const { user } = req;
  Card.create({ name, link, owner: user })
    .then((card) => Card.findById(card._id).populate('owner', 'name about avatar _id'))
    .then((extendedCard) => res.send(extendedCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные при создании карточки.');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
      if (String(req.user._id) !== String(card.owner)) {
        throw new OwnershipError('Вы не можете удалять карточки, созданные другими пользователями');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.status(200).send({ message: 'Пост удален' }))
        .catch(next);
    })
    .catch(next);
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner', 'name about avatar _id')
    .populate('likes', 'name about avatar _id')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner', 'name about avatar _id')
    .populate('likes', 'name about avatar _id')
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.send(card);
    })
    .catch(next);
};
