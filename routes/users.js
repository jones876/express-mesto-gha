const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUserById,

  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getAllUsers);

router.get('/users/me', getCurrentUser);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .regex(
          /^(http:\/\/|https:\/\/)(www\.)?\w+([.-]?\w+)*(\.\w{2,3})+(\/\S*)?#?$/,
        ),
    }),
  }),
  updateAvatar,
);
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24),
    }),
  }),
  getUserById,
);

module.exports = router;
