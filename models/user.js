/* eslint-disable indent */
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const mongoose = require('mongoose');
const {
  WRONG_MAIL,
  USER_MAIL_NOT_EXIST,
  INCORRECT_PASSWORD,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: WRONG_MAIL,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Error(USER_MAIL_NOT_EXIST);
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new Error(INCORRECT_PASSWORD);
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
