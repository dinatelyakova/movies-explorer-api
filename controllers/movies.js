const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

const postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка запроса создания фильма'));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const owner = req.user._id;
  Movie.findById(movieId)
    .orFail(() => { throw new NotFoundError('Запрашиваемый ресурс не найден'); })
    .then((movie) => {
      if (movie.owner.toString() !== owner) {
        throw new ForbiddenError('Вы не можете удалить чужой фильм');
      }
      return Movie.findByIdAndRemove(movieId);
    })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
