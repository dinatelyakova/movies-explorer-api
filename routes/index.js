const router = require('express').Router();
const userRouters = require('./users');
const movieRouters = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUser, validateLogin } = require('../middlewares/requestsValidation');

router.post('/signup', validateUser, createUser);
router.post('/signin', validateLogin, login);

router.use(auth);
router.use(userRouters);
router.use(movieRouters);
router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
