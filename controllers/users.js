const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  if (!req.params.userId) {
    req.params.userId = req.user._id;
  }

  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((error) => {
      const err = new Error('INCORRECT_ID');
      err.statusCode = 404;

      if (error.name === 'CastError') {
        err.statusCode = 400;
      }

      next(err);
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
      const err = new Error();
      if (error.name === 'MongoError') {
        err.message = 'SER_MAIL_EXISTS';
        err.statusCode = 409;
      } else {
        err.message = 'INCORRECT_DATA_CREAT_USER';
        err.statusCode = 400;
      }

      next(err);
    });
};

// eslint-disable-next-line consistent-return
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    const err = new Error(
      'INCORRECT_DATA_UPDATE_PROFILE',
    );
    err.statusCode = 400;
    return next(err);
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
    .catch(() => {
      const err = new Error(
        'INCORRECT_DATA_UPDATE_PROFILE',
      );
      err.statusCode = 400;

      next(err);
    });
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
    .catch((error) => {
      const err = new Error(error.message);
      err.statusCode = 401;

      next(err);
    });
};
