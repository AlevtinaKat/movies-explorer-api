/* eslint-disable indent */
const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration : {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image : {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v, {
          protocols: ['http', 'https'],
          require_tld: true,
          require_protocol: true,
        }),
      message: 'WRONG_URL',
    },
  },
  trailer : {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v, {
          protocols: ['http', 'https'],
          require_tld: true,
          require_protocol: true,
        }),
      message: 'WRONG_URL',
    },
  },
  thumbnail : {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v, {
          protocols: ['http', 'https'],
          require_tld: true,
          require_protocol: true,
        }),
      message: 'WRONG_URL',
    },
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

movieSchema.statics.findMovieById = function findMovieById(movieId, userId) {
  return this.findOne({ _id: movieId })
    .then((movie) => {
      if (String(movie.owner) !== userId) {
        throw new Error('WrongUser');
      }

      return movie;
    });
};

module.exports = mongoose.model('movie', movieSchema);
