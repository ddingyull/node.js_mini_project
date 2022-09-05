// @ts-check;

const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 4000;

const userRouter = express.Router();
const postsRouter = express.Router();

const USER = [
  {
    id: 'dding',
    name: '강유림',
  },
  {
    id: 'test',
    name: '테스트맨',
  },
];

// ejs사용하기위한 세팅
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/users', userRouter); //user라는 주소로 들어오면 userRouter로 받아서 라우팅해준다
app.use('/posts', postsRouter);

// 외부에서 접근할 수 있는 기본폴더를 views로 지정(미들웨어임) : 보통은 public,static에 설정
app.use(express.static('public'));

userRouter.get('/', (req, res) => {
  const userLen = USER.length;
  res.render('index', { USER, userCounts: userLen });
});

userRouter.get('/ejs', (req, res) => {
  res.write('<h1>hello</h1>');
  for (let i = 0; i < USER.length; i++) {
    res.write(`<h2>user ID는 ${USER[i].id} </h2>`);
    res.write(`<h2>user Name은 ${USER[i].name}</h2>`);
    res.write(`<h2>user Name은 ${USER[i].email}</h2>`);
  }
});

userRouter.get('/', (req, res) => {
  // res.send('회원목록');
  res.send(USER);
});

userRouter.get('/:id', (req, res) => {
  const userData = USER.find((user) => user.id === req.params.id);
  if (userData) {
    res.send(userData);
  } else {
    res.end('ID not found');
  }
});

userRouter.post('/', (req, res) => {
  if (req.query.id && req.query.name && req.query.email) {
    const newUser = {
      id: req.query.id,
      name: req.query.name,
      email: req.query.email,
    };
    USER.push(newUser);
    res.send('회원 등록 완료');
  } else {
    res.end('잘못된 query입니다 다시 등록해야합니다');
  }
});

userRouter.put('/:id', (req, res) => {
  if (req.query.id && req.query.name) {
    const modifyData = USER.find((user) => user.id === req.params.id);
    if (modifyData) {
      const arrIndex = USER.findIndex((user) => user.id === req.params.id);
      const modifyUser = {
        id: req.query.id,
        name: req.query.name,
      };
      USER[arrIndex] = modifyUser;
      res.send('회원 정보 수정 완료');
    } else {
      res.end('잘못된 query입니다 다시 수정해야합니다');
    }
  }
});

userRouter.delete('/:id', (req, res) => {
  const modifyData = USER.findIndex((user) => user.id === req.params.id);
  if (modifyData) {
    USER.pop(modifyData);
    res.send('삭제되었습니다.');
  } else {
    res.end('해당되지 않습니다 삭제되지 않았습니다');
  }
});

userRouter.post('/:title', (req, res) => {
  res.send(`${req.params.title}`);
});

// postsRouter.post('/:name', (req, res) => {
//   res.send(`${req.params.name}`);
// });

// postsRouter.get('/', (req, res) => {
//   res.send('블로그 글 목록');
// });

app.get('/', (req, res) => {
  res.send('get method');
});

app.post('/', (req, res) => {
  res.send('post method');
});

app.put('/', (req, res) => {
  res.send('put method');
});

app.delete('/', (req, res) => {
  res.send('delete method');
});

// 미들웨어 사용할 때는 app.use()
app.use('/', async (req, res, next) => {
  console.log('1번');
  req.reqTime = new Date();
  req.fileContent = await fs.promises.readFile('package.json', 'utf-8');
  next();
});

app.get('/', (req, res) => {
  const p = req.query;
  if (p.email && p.password && p.name && p.gender) {
    res.send(
      `email은 ${req.params.email} password는 ${req.params.password} gender는 ${req.params.gender}`
    );
  } else {
    res.send('Unexpected query');
  }
});

app.get('/', (req, res) => {
  if (req.params.email === undefined) {
    res.send('Unexpected query');
  }
  res.send(req.query);
});

app.listen(PORT, () => {
  console.log(`the express server is running ar ${PORT}`);
});
