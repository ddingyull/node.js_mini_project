//@ts-check;

const express = require('express');

const router = express.Router();

const mongoClient = require('./mongodb.js');

const { MongoClient } = require('mongodb');
const { resourceLimits } = require('worker_threads');
const uri =
  'mongodb+srv://ddingyull:1234@cluster0.hl5bvvr.mongodb.net/?retryWrites=true&w=majority';

// 글 전체 목록 보여주기 (콜백함수로 작성된 코드)
// 보여주기 ://localhost:4000/board/ 주소라고 생각해야함 (파일이 한개 더 들어왔기 때문)
router.get('/', async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('node1').collection('board');
  const BOARD = await cursor.find({}).toArray();
  const boardLen = BOARD.length;

  res.render('board', { BOARD, boardCounters: boardLen });
});

// 글쓰기 모드로 이동
router.get('/write', (req, res) => {
  res.render('write.ejs');
});

// 글 추가 기능 수행
router.post('/write', async (req, res) => {
  console.log(req.body);
  if (req.body.title && req.body.user) {
    const newBoard = {
      title: req.body.title,
      user: req.body.user,
    };
    const client = await mongoClient.connect();
    const cursor = client.db('node1').collection('board');
    await cursor.insertOne(newBoard);
    res.redirect('/board');
  }
});

// 글 수정 모드로 이동
router.get('/modify/title/:title', async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('node1').collection('board');
  const selectedBoard = await cursor.findOne({ title: req.params.title });
  console.log(selectedBoard);
  res.render('board_modify', { selectedBoard });
});

// 글 수정
router.post('/modify/title/:title', async (req, res) => {
  if (req.body.title && req.body.user && req.body.day) {
    const client = await mongoClient.connect();
    const cursor = client.db('node1').collection('board');
    await cursor.updateOne(
      { title: req.params.title },
      {
        $set: { title: req.body.title, user: req.body.user, day: req.body.day },
      }
    );
    res.redirect('/board');
  }
});

// 글 삭제
router.delete('/title/:title', async (req, res) => {
  const client = await mongoClient.connect();
  const cursor = client.db('node1').collection('board');
  await cursor.deleteOne({ title: req.params.title });

  if (result.acknowledged) {
    res.send('삭제 완료');
  } else {
    const err = new Error('삭제 실패');
    err.statusCode = 404;
    throw err;
  }
});

// function deleteBoard(title) {
//   fetch(`board/delete/title/${title}`, {
//     method: 'delete',
//     headers: {
//       'Content-type': 'application/json',
//     },
//   }).then((res) => {
//     location.href = '/board';
//   });
// }

module.exports = router;
