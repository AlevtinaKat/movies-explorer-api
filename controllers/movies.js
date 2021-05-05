const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;

  Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner: req.user._id })
  .then((movie) => res.send(movie))
    .catch(() => {
      const err = new Error(
        'Переданы некорректные данные при добавлении фильма.',
      );
      err.statusCode = 400;

      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findMovieById(req.params.movieId, req.user._id)
    .then(() => {
      Movie.findOneAndRemove({ _id: req.params.movieId, owner: req.user._id })
        .then((movie) => res.send(movie));
    })
    .catch((error) => {
      const err = new Error();
      err.message = 'Фильм с указанным _id не найден';
      err.statusCode = 404;

      if (error.message === 'WrongUser') {
        err.statusCode = 403;
      }

      if (error.name === 'CastError') {
        err.statusCode = 400;
      }

      next(err);
    });
};
