const router = require('express').Router();

const { validateGetUserById, validateUpdateProfile, validateUpdateAvatar } = require('../middlewares/validate');
const {
  getAllUsers,
  getUserById,

  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', validateGetUserById, getUserById);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
