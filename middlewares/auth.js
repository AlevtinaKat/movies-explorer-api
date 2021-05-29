const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { WRONG_JWT_TOKEN } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  let payload;
  try {
    payload = jwt.verify(
      req.cookies.jwt,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return next(new UnauthorizedError(WRONG_JWT_TOKEN));
  }

  req.user = {
    _id: payload._id,
  };

  return next();
};
