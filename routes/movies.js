const router = require('express').Router();
const {
  getMovies,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  validateMovie, validateUserId,
} = require('../middlewares/requestsValidation');

router.get('/movies', getMovies);
router.post('/movies', validateMovie, postMovie);
router.delete('/movies/:movieId', validateUserId, deleteMovie);

module.exports = router;
