const mongoose = require('mongoose');

const movieShema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator(v) {
        return /https?:\/\/(w{3}\.)?[\w\-.~:/?#[\]@!$&'\\()*+,;=]/.test(v);
      },
      message: 'Неверный URL постера',
    },
    required: true,
  },
  trailer: {
    type: String,
    validate: {
      validator(v) {
        return /https?:\/\/(w{3}\.)?[\w\-.~:/?#[\]@!$&'\\()*+,;=]/.test(v);
      },
      message: 'Неверный URL фильма',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator(v) {
        return /https?:\/\/(w{3}\.)?[\w\-.~:/?#[\]@!$&'\\()*+,;=]/.test(v);
      },
      message: 'Неверный URL миниатюрного изображения постера',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('movie', movieShema);
