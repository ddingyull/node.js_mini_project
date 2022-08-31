const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const res = require('express/lib/response');
app.use(bodyParser.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override')  // method-override
app.use(methodOverride('_method'))
const dotenv = require('dotenv').config()  // env를 위한 dotenv
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));  // css파일 추가
const ObjectId = require('mongodb')

// db 링크로 불러와서 8080port로 열기
let db;
MongoClient.connect(
  process.env.DB_URL,
  function(err,client) {
  if(err) return console.log(err);
  db = client.db('todoapp');

  app.listen(8080, function(){
    console.log('listening on 8080');
  });
});

// ejs 파일 연결하기

app.get('/', function(req,res) {
  // res.sendFile(__dirname + '/index.html');
  res.render('index.ejs');
})

app.get('/write', function(req,res) {
  // res.sendFile(__dirname + './write.html');
  res.render('write.ejs');
})

app.get('/list', function(req,res) {
  db.collection('post').find().toArray(function(err, result){
    console.log(result);
    res.render('list.ejs', { posts : result});
  }); // 모든 데이터 가져오기
});

// req에는 모든 정보가 담겨져있고 그 중에 query를 꺼내서 사용
  // console.log(req.query.value);
  // .find
  // ({
  //   // 할일 : req.query.value
  //   // 할일 : /하기/
  //   // db indexes해놓은 애들 데려오기 단, 띄어쓰기기준으로 인식함
  //   /**1. text index쓰지말고 검색할 문서의 양을 제한하기
  //    * 2. text index만들때 다르게 만들기(귀찮아서 잘 안함)
  //    * 3. search index만들 수 있음
  //    */
  //   $text : {
  //     $search : req.query.value
  //   }
  // })
app.get('/search', (req, res) => {
  let searchCondition = [
    {
      $search : {
        index : 'title_Search',
        text : {
          query : req.query.value, //검색어 
          path: '할일' //어떤항목에서 검사? / 할일 날짜 둘 다 찾고 싶으면 ['할일', '날짜']
        }
      }
    },
    {$sort : {_id : 1}}, //검색한내용들을 id기준으로 정렬하는 코드
    {$limit : 10} //검색을 10개로 제한하는 것 
    // {$project : 
    //   {
    //     할일 : 1,
    //     _id : 0,
    //     score : {$meta: "searchScore"} //없는 score도 저장해서 나온다 
    //   }} //빔프로젝터처럼 원하는 내용만 표현되도도록 
  ]
  db.collection('post')
  .aggregate(searchCondition)
  .toArray((err, result) => {
    console.log(result);
    res.render('search.ejs', {posts : result})
  })
})

// 검색했을 때 중복되는 단어는 search될 수 있도록 만드는 코드 
//1.정규식도 가능하지만 데이터가 많으면 적합핳지않음
//2. indexing -> Binary Search 반씩 쪼개어 원하는db를 찾는 방법(단, 숫자순 정렬되어있어야함)

// :id 숫자들을 넣을 수 있음, 함수 파라미터와 비슷한 기능
app.get('/detail/:id', (req, res) => {
  db.collection('post').findOne(
    {_id : parseInt(req.params.id)},
    (err, result) => {
    console.log(result);
    res.render('detail.ejs', { data : result});
    if(err) return console.log(err);
  })
})

app.get('/edit/:id', (req, res) => {
  db.collection('post').findOne(
    {_id : parseInt(req.params.id)},
    (err, result) => {
      console.log(result);
      res.render('edit.ejs', { post : result})
      if(err) return console.log(err);
  })
  })

  app.put('/edit', (req, res) => {
    db.collection('post')
    // 업데이트함수는 3개를 적어줄 것 
    .updateOne(
      // 수정할 id값 edit.ejs에서 가져오기
      {_id : parseInt(req.body.id)},
      // set operater는 업데이트해주세요라는 의미, 없으면 추가
      {$set : { 할일 : req.body.title, 날짜 : req.body.date}},
      (err, result) => {
        console.log('수정완료');
        res.redirect('/list')
      }
      )
  });

  // session방식 : 라이브러리 3개 설치한 것 사용할 수 있는 세팅
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;
  const session = require('express-session');
// 요청과 응답 사이에 app.use의 함수가 실행됨
  app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/login', (req, res) => {
    res.render('login.ejs')
  });

  app.post('/login', passport
  .authenticate(
    'local',  //local방식으로 회원인지 인증해주세요 성공하면 마지막 함수 실행
    { failureRedirect : '/fail'}),   // 로그인 실패한다면 fail경로로 이동
    (req, res) => {
    res.redirect('/')  // 로그인 성공하면 /경로로 이동
  });

  app.get('/mypage', 로그인했니, (req, res) => {
    req.user  //사용자의 정보가 다 담겨있음
    console.log(req.user);
    res.render('mypage.ejs', {사용자 : req.user})
  })

  function 로그인했니(req, res, next) {
    if(req.user) {
      next()
    } else {
      res.send('로그인 안하셨어요')
    }
  }

  // 📍 인증방식을 자세히 적어줘야한다 
  passport.use(new LocalStrategy({
  // 로그인 후 세션에 저장할 것인지 세팅값 넣어주기 (아래4줄)
    usernameField: 'id',  // form에 name을 어떻게 썼는지 정의내리기!
    passwordField: 'pw',  // form에 name을 어떻게 썼는지 정의내리기!
    session: true,
    passReqToCallback: false,  //id,pw외 비교할 요소들

    // 사용자의 id, pw 비교하는 코드
  }, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (err, result) {
      if (err) return done(err)
  
      //if 일치하는 아이디(결과)가 없다면 
      // done()이란? : 3개 파라미터를 가질 수 있음 (서버에러, 성공시사용자DB데이터, 에러메세지)
      if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
      //if 일치하는 아이디(결과)가 있다면
      if (입력한비번 == result.pw) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));

  //user.id라는 이름으로 세션에 저장 => 저장되면 쿠키에 저장될 예정 
  passport.serializeUser((user, done) => {
    done(null, user.id)
  });

  //이 사람의 세션을 찾을 때 실행 
  passport.deserializeUser((아이디, done) => {
    // {디비에서 위에있는 user.id로 유저를 찾은 뒤에 유저 정보를 찾는 역할}
    db.collection('login')
    .findOne(
      {id : 아이디},  //user.id값이 들어갈 예정
      (err, result) => {
        done(null, result) //result -> {id:test, pw:test}라고 나옴
      }
    )
  })
// passport 코드가 위에 있어야함, 가입하기
  app.post('/register', (req, res) => {
    // 저장전에 id가 이미 있는지 찾아보기, 알파벳숫자만 들어갔는지, 비번 암호화했는지
    db.collection('login')
    .insertOne(
      { id : req.body.id, pw:req.body.pw},
      (err, result) => {res.redirect('/')}
    )
  })

  app.post('/add', function(req,res){
    res.send('전송완료');
    db.collection('counter').findOne({name : '게시물개수'}, 
    function(err, result) {  
      // console.log(result.totalPost);
      let total = result.totalPost;
      let save = {  //collection에서 찾을 수는 있겠지만 가능하면 따로 다 저장해두는것을 권장 ,CPU낭비 방지!
        _id : total + 1,
        할일 : req.body.title,
        날짜 : req.body.date,
        작성자 : req.user._id
      }
  
      db.collection('post')
      .insertOne(
        save,
        (err, result) => {
        console.log('저장완료');
        db.collection('counter')
          .updateOne(
            { name : '게시물개수' },
            { $inc : {totalPost:1} },
            (err,result) => {
              if(err) return console.log(err);
              res.send('전송 완료');
            }
          )
      });
    }); 
  }); 

  app.delete('/delete', (req, res) => {
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
  
    // 작성자의 id와 글에 있는 id가 일치한지 확인 후 삭제되도록 
    let deleteData = {_id : req.body._id, 작성자 : req.user._id}
  
    // req.body에 담겨운 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
    db.collection('post')
    .deleteOne(
      deleteData,
      (err, result) => {
      console.log('delete done');
      // res(응답)했다면 응답코드 200이라고 해주세요 (200은 성공했다는 의미, 400 고객문제로 다시 해달라는 의미, 500 서버문제입니다)
      if(result) console.log(result);
      res.status(200).send({ message : '성공했습니다' });
    })
  })
  
  // shop.js에서 배출한 파일을 가져오겠다 (./ 현재경로부터 쓰는게 국룰!! ㅋㅋ )
  // : 고객이 /경로로 요청했을 때 이런 미들웨어(우리가 만든라우터) 적용해주세요라는 의미
  //app.use : 요청과 응답 사이에 ~~를 실행하고 싶을 때 사용하는 미들웨어 (전역변수이되 범위를 한정하는 것도 가능)
  app.use('/shop', require('./routes/shop.js'));

  // app.get('/shop/shirts', function(요청, 응답){
  //   응답.send('셔츠 파는 페이지입니다.');
  // });

  // app.get('/shop/pants', function(요청, 응답){
  //   응답.send('바지 파는 페이지입니다.');
  // });

  // 1) multer 설치하고 불러오기
  app.use('/board/sub', require('./routes/board.js'));
  // let storage = multer.memoryStorage({}); : lam에 저장해주세요(휘발성 O)

  //2) multer에게 파일 저장시키고, 파일명 설정해주기
  let multer = require('multer');
  let storage = multer.diskStorage({
    destination : (req, file, cd) => {   //저장한 이미지의 파일 저장하는 부분
      cd(null, './public/image')
    },
    filename : (req, file, cd) => {  //저장한 이미지의 파일명 설정하는 부분
      cd(null, file.originalname)
    }
  });

  //3)위에 만들어놓은 것을 변수로 정의해주기 
  let upload = multer({storage : storage});
  
  // upload 페이지  (이미지는 그 페이지 하드에 저장하는편)
  app.get('/upload', (req,res) => {
    res.render('upload.ejs')
  })
// 4)미들웨어처럼 불러오기만 하면 끝  
//이미지 1개: 변수명.single('name이름')
//이미지 2개 이상 : 변수명.array('name이름', 개수) + html 여러개받을 수 있는 input으로 수정
//파일명 바꿔서 업로드 : 
  app.post('/upload', upload.single('profile'), (req, res) => {
    res.send('업로드 완료')
  });

  app.get('/image/:imageName', (req, res) => {
    res.sendFile( __dirname + '/public/image/' + req.params.imageName) //server.js + 경로 + 이름
  })

  // <img src="/image/yurim.png">
  // insert실행됐을 떄 콜백함수를 실행해달라는 말이지만 아래처럼 쓸 수도 있음

  
  app.post('/chatroom', 로그인했니, function(req, res){

    let chatData = {
      title : '채팅방',
      member : [ObjectId(req.body.youId), req.user._id],
      date : new Date()
    }
    db.collection('chatroom').insertOne(chatData).then((result) => {
      res.send('성공')
    })
  })

  app.get('/chat', 로그인했니, (req,res) => {
    db.collection('chatroom').find({ member : req.user._id }).toArray().then(()=>{
      res.render('chat.ejs', {data : result})
    })
  })