const MONGO_ADDRES = 'mongodb://localhost:27017/bitfilmsdb';
const PORT_NUMBER = 3000;
const WHITE_LIST = [
  'http://localhost:3000',
  'https://films.nomoredomains.club',
  'http://films.nomoredomains.club',
];

const MOVIE_ID_NOT_FOUND = 'Фильм с указанным _id не найден';
const WRONG_MOVIE_OWNER = 'Карточка фильма не принадлежит пользователю';
const INCCORRECT_DATA_MOVIE = 'Переданы некорректные данные при добавлении фильма.';
const INCORRECT_ID = 'Передан некорректный id';
const USER_MAIL_EXISTS = 'Пользователь с таким email уже существует.';
const INCORRECT_DATA_CREAT_USER = 'Переданы некорректные данные при создании пользователя.';
const INCORRECT_DATA_UPDATE_PROFILE = 'Переданы некорректные данные при обновлении профиля.';
const WRONG_JWT_TOKEN = 'Неправильный JWT токен.';
const SERVER_ERROR = 'На сервере произошла ошибка';
const WRONG_URL = 'Неправильный формат URL';
const WRONG_MAIL = 'Неправильный формат почты';
const INCORRECT_PASSWORD = 'Передан неверный пароль';
const REQUEST_NOT_FOUND = 'Запрос не найден.';

module.exports = {
  MONGO_ADDRES,
  PORT_NUMBER,
  WHITE_LIST,
  MOVIE_ID_NOT_FOUND,
  INCCORRECT_DATA_MOVIE,
  INCORRECT_ID,
  USER_MAIL_EXISTS,
  INCORRECT_DATA_CREAT_USER,
  INCORRECT_DATA_UPDATE_PROFILE,
  WRONG_JWT_TOKEN,
  SERVER_ERROR,
  WRONG_URL,
  WRONG_MAIL,
  INCORRECT_PASSWORD,
  REQUEST_NOT_FOUND,
  WRONG_MOVIE_OWNER,
};
