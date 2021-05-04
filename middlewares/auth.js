const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  let payload;
  try {
    payload = jwt.verify(req.cookies.jwt, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    const error = new Error();
    error.message = 'Неправильный JWT токен.';
    error.statusCode = 401;

    next(error);
  }

  req.user = {
    _id: payload._id,
  };

  return next();
};
