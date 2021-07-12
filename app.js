require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const rateLimiter = require('./middlewares/rateLimit');

const {
  PORT = 4000,
  MONGOBD_URL = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

mongoose.connect(MONGOBD_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const allowedCors = [
  'https://api.explmovie.bystudent.nomoredomains.rocks',
  'https://exploremovie.bystudent.nomoredomains.rocks',
  'http://localhost:4000',
];

app.use(cors({
  origin: allowedCors,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(helmet());
app.use(rateLimiter);
app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
