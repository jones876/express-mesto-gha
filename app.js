const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');

const { PORT = 3000 } = process.env;
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
app.use(express.json());
app.use(cookieParser());
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),

  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string()
        .regex(
          /^(http:\/\/|https:\/\/)(www\.)?\w+([.-]?\w+)*(\.\w{2,3})+(\/\S*)?#?$/,
        ),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.use(auth);
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страница не найдена' });
});

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Приложение слушает порт: ${PORT}`);
});
