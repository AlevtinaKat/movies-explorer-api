const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./users.js');
const moviesRouter = require('./movies.js');
const { createUser, login } = require('../controllers/users');
const { auth } = require('../middlewares/auth');

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

router.use('/*', (req, res, next) => {
  const err = new Error();
  err.message = 'Запрос не найден.';
  err.statusCode = 404;

  next(err);
});

module.exports = router;
