const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64ac270e656ed93b61bc54d3',
  };

  next();
});
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(usersRoutes);
app.use(cardsRoutes);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страница не найдена' });
});
app.listen(PORT, () => {
  console.log(`Приложение слушает порт: ${PORT}`);
});
