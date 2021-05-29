const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');
const WRONG_URL = require('../utils/constants');

const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);

moviesRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteMovie,
);

moviesRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string()
        .required()
        .custom((value, helper) => {
          if (
            isURL(value, {
              protocols: ['http', 'https'],
              require_tld: true,
              require_protocol: true,
            })
          ) {
            return value;
          }
          return helper.message(WRONG_URL);
        }),
      trailer: Joi.string()
        .required()
        .custom((value, helper) => {
          if (
            isURL(value, {
              protocols: ['http', 'https'],
              require_tld: true,
              require_protocol: true,
            })
          ) {
            return value;
          }
          return helper.message(WRONG_URL);
        }),
      thumbnail: Joi.string()
        .required()
        .custom((value, helper) => {
          if (
            isURL(value, {
              protocols: ['http', 'https'],
              require_tld: true,
              require_protocol: true,
            })
          ) {
            return value;
          }
          return helper.message(WRONG_URL);
        }),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

module.exports = moviesRouter;
