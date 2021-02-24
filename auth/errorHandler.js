module.exports = (res, error) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    return res.status(422).json({ messageText: 'Пользователь уже существует' });
  }

  if (error.response && error.response.status === 401) {
    return res.status(401).json({ messageText: 'Неверный логин/пароль в HPSM' });
  }

  return res.status(422).send(error);
}