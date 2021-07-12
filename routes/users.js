const router = require('express').Router();
const {
  validateUserId,
  validateUserUpdate,
} = require('../middlewares/requestsValidation');
const {
  getMyInfo,
  updateUser,
} = require('../controllers/users');

router.get('/users/me', validateUserId, getMyInfo);
router.patch('/users/me', validateUserUpdate, updateUser);

module.exports = router;
