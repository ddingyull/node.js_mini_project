// @ts-check;

const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 4000;

const userRouter = require('./routes/users');
const userPosts = require('./routes/posts');
// const postsRouter = express.Router();

app.use('/users', userRouter); //user라는 주소로 들어오면 userRouter로 받아서 라우팅해준다
app.use('/posts', userPosts);

// ejs사용하기위한 세팅
app.set('view engine', 'ejs');
app.set('views', 'views');

// 외부에서 접근할 수 있는 기본폴더를 views로 지정(미들웨어임) : 보통은 public,static에 설정
app.use(express.static('public'));

// err넣으려면 제일 앞에 넣어야함
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode);
  res.end(err.message);
});

app.listen(PORT, () => {
  console.log(`the express server is running ar ${PORT}`);
});

// userRouter.post('/:title', (req, res) => {
//   res.send(`${req.params.title}`);
// });

// app.get('/', (req, res) => {
//   res.send('get method');
// });

// app.post('/', (req, res) => {
//   res.send('post method');
// });

// app.put('/', (req, res) => {
//   res.send('put method');
// });

// app.delete('/', (req, res) => {
//   res.send('delete method');
// });

// // 미들웨어 사용할 때는 app.use()
// app.use('/', async (req, res, next) => {
//   console.log('1번');
//   req.reqTime = new Date();
//   req.fileContent = await fs.promises.readFile('package.json', 'utf-8');
//   next();
// });

// app.get('/', (req, res) => {
//   const p = req.query;
//   if (p.email && p.password && p.name && p.gender) {
//     res.send(
//       `email은 ${req.params.email} password는 ${req.params.password} gender는 ${req.params.gender}`
//     );
//   } else {
//     res.send('Unexpected query');
//   }
// });

// app.get('/', (req, res) => {
//   if (req.params.email === undefined) {
//     res.send('Unexpected query');
//   }
//   res.send(req.query);
// });
