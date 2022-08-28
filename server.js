const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const res = require('express/lib/response');
app.use(bodyParser.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

// css파일 추가
app.use('/public', express.static('public'));

app.get('/', function(req,res) {
  // res.sendFile(__dirname + '/index.html');
  res.render('index.ejs');
})

app.get('/write', function(req,res) {
  // res.sendFile(__dirname + './write.html');
  res.render('write.ejs');
})

// app.get('/write', function(req,res) {
//   // db.collection('post').find().toArray(function(err, result){
//   //   console.log(result);
//     res.render('/write.ejs');
//   }); // 모든 데이터 가져오기
// // });

let db;
MongoClient.connect(
  'mongodb+srv://ddingyull:1234@cluster0.hl5bvvr.mongodb.net/?retryWrites=true&w=majority',
  function(err,client) {
  if(err) return console.log(err);
  db = client.db('todoapp');

  app.listen(8080, function(){
    console.log('listening on 8080');
  });
});


app.post('/add', function(req,res){
  res.send('전송완료');
  db.collection('counter').findOne({name : '게시물개수'}, 
  function(err, result) {  
    // console.log(result.totalPost);
    let total = result.totalPost;

    db.collection('post').insertOne(
      {
        _id : total + 1,
        할일 : req.body.title,
        날짜 : req.body.date
      },
        function(err, result) {
      console.log('저장완료');
      db.collection('counter').updateOne(
        { name : '게시물개수' },
        { $inc : {totalPost:1} },
        function(err,result){
        if(err) return console.log(err);
        res.send('전송 완료');
      })
    });
  }); 
}); 

app.get('/list', function(req,res) {
  
  db.collection('post').find().toArray(function(err, result){
    console.log(result);
    res.render('list.ejs', { posts : result});
  }); // 모든 데이터 가져오기
});

app.delete('/delete', (req, res) => {
  // console.log(req.body);
  req.body._id = parseInt(req.body._id);
  // req.body에 담겨운 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
  db.collection('post').deleteOne(req.body, (err, result) => {
    console.log('delete done');
    // res(응답)했다면 응답코드 200이라고 해주세요 (200은 성공했다는 의미, 400 고객문제로 다시 해달라는 의미, 500 서버문제입니다)
    res.status(200).send({ message : '성공했습니다' });
  })
})

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
      res.render('edit.ejs', {post : result})
  })
})