const Movie = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const getMovies = (req, res, next) => {
  Movie.find({})
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
  const id = req.user._id;
  Movie.findById(req.params.id)
    .then((movie) => {
      if (movie) {
        if (movie.owner.toString() === id) {
          Movie.findByIdAndRemove(req.params.id)
            .then((deletedMovie) => res.send(deletedMovie))
            .catch(next);
        } else {
          throw new ForbiddenError('Нет прав на удаление чужой карточки фильма');
        }
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  postMovie,
  deleteMovie,
};
