/* eslint-disable consistent-return */
const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ card }))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )

    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send({ card });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )

    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.status(200).send({ card });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
