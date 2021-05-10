const SERVER_ERROR = require('../utils/constants');

// eslint-disable-next-line no-unused-vars
module.exports.error = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? SERVER_ERROR
        : message,
    });
};
