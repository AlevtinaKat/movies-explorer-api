const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./users.js');
const moviesRouter = require('./movies.js');
const { createUser, login } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const EQUEST_NOT_FOUND = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

router.use('/*', (req, res, next) => next(new NotFoundError(EQUEST_NOT_FOUND)));

module.exports = router;
