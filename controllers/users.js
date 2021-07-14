const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedErrors');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getMyInfo = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .orFail(() => new NotFoundError('Пользователь с таким id не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  const newName = req.body.name;
  const newEmail = req.body.email;
  User.findByIdAndUpdate(
    { _id: id },
    { name: newName, email: newEmail },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка запроса обновления информации пользователя'));
      }
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email адресом уже существует'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) throw new ConflictError('Пользователь с таким email уже существует');
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name, email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка запроса создания пользователя'));
      } else next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(() => {
      throw new UnauthorizedError('Передан неверный логин или пароль');
    })
    .catch(next);
};

module.exports = {
  getMyInfo,
  updateUser,
  createUser,
  login,
};
