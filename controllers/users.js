const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { INCORRECT_ID, USER_MAIL_EXISTS, INCORRECT_DATA_CREAT_USER, INCORRECT_DATA_UPDATE_PROFILE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  if (!req.params.userId) {
    req.params.userId = req.user._id;
  }

  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError(INCORRECT_ID));
      }

      return next(new NotFoundError(INCORRECT_ID));
    });
};

module.exports.createUser = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    // eslint-disable-next-line object-curly-newline
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      user.set('password', undefined);
      res.send(user);
    })
    .catch((error) => {
      if (error.name === 'MongoError') {
        return next(new ConflictError(USER_MAIL_EXISTS));
      }
      return next(new BadRequestError(INCORRECT_DATA_CREAT_USER));
    });
};

// eslint-disable-next-line consistent-return
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return next(new BadRequestError(INCORRECT_DATA_UPDATE_PROFILE));
  }

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      runValidators: true,
      new: true,
    },
  )
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch(() => next(new BadRequestError(INCORRECT_DATA_UPDATE_PROFILE)));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true });
      res.send({ token });
    })
    .catch((error) => next(new UnauthorizedError(error.message)));
};
