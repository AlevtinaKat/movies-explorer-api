const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const {
  INCCORRECT_DATA_MOVIE,
  MOVIE_ID_NOT_FOUND,
  WRONG_MOVIE_OWNER,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
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
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch(() => {
      const err = new BadRequestError(INCCORRECT_DATA_MOVIE);

      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findMovieById(req.params.movieId, req.user._id)
    .then(() => {
      Movie.findOneAndRemove({
        _id: req.params.movieId,
        owner: req.user._id,
      }).then((movie) => res.send(movie));
    })
    .catch((error) => {
      if (error.message === 'WrongUser') {
        return next(new ForbiddenError(WRONG_MOVIE_OWNER));
      }

      if (error.name === 'CastError') {
        return next(new BadRequestError(MOVIE_ID_NOT_FOUND));
      }

      return next(new NotFoundError(MOVIE_ID_NOT_FOUND));
    });
};
