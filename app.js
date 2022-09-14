// @ts-check;

/**
 * <server를 열기 위해 필요한 3가지>
 * 1) const express = require('express');
 * 2) const app = express();
 * 3) app.listen(PORT, () => {
      console.log(`the express server is running ar ${PORT}`);
    });
*/

const express = require('express');
// const bodyParser = require('body-parser'); 직접 설치했으니 이 코드 없어도 사용 가능함(아래 2줄도 express로 해도 가능)
const fs = require('fs');
const app = express();
const PORT = 4000;

const bodyParser = require('body-parser');

const res = require('express/lib/response');
app.use(bodyParser.urlencoded({ extended: true }));
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://ddingyull:1234@cluster0.hl5bvvr.mongodb.net/?retryWrites=true&w=majority';

const router = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const boardRouter = require('./routes/board_db');
const writeRouter = require('./routes/write');
// const postsRouter = express.Router();

// ejs사용하기위한 세팅
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);
app.use('/users', usersRouter); //user라는 주소로 들어오면 userRouter로 받아서 라우팅해준다
app.use('/posts', postsRouter);
app.use('/board', boardRouter);
app.use('/write', writeRouter);

// 외부에서 접근할 수 있는 기본폴더를 views로 지정(미들웨어임) : 보통은 public,static에 설정
app.use(express.static('public'));

// err넣으려면 제일 앞에 넣어야함
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode || 500);
  res.end(err.message);
});

// // db 링크로 불러와서 4000port로 열기
// let db;
// MongoClient.connect(
//   'mongodb+srv://ddingyull:1234@cluster0.hl5bvvr.mongodb.net/?retryWrites=true&w=majority',
//   (err, client) => {
//     if (err) return console.log(err);
//     db = client.db('node1');

//     app.listen(PORT, () => {
//       console.log(`the express server is running ar ${PORT}`);
//     });
//   }
// );
app.listen(PORT, () => {
  console.log(`the express server is running ar ${PORT}`);
});

// 보여주기
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/write', (req, res) => {
  res.render('write.ejs');
});

app.get('/board', (req, res) => {
  db.collection('node1')
    .find()
    .toArray((err, result) => {
      console.log(result);
    });
  res.render('board.ejs', { boards: result });
});

app.get('/users', (req, res) => {
  res.render('users.ejs');
});
