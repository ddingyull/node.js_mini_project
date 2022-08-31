const sports = require('express').Router();

sports.get('/sports', (req, res) => {
  res.send('스포츠 게시판');
});

sports.get('/game', (req, res) => {
  res.send('게임 게시판');
});

module.exports = sports;