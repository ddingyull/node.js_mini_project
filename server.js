const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

app.listen(8080, function(){
  console.log('listening on 8080');
});

app.get('/', function(req,res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/write', function(req,res) {
  res.sendFile(__dirname + '/write.html')
})

var db;
MongoClient.connect('mongodb+srv://ddingyull:1234@cluster0.hl5bvvr.mongodb.net/?retryWrites=true&w=majority', function(err,client) {
  if(err) return console.log(error)
  db = client.db('todoapp');
});


app.post('/add', function(req,res){
  res.send('전송완료');
  db.collection('counter').findOne({name : '게시물개수'}, function(err, result) {  //findOne : 하나만 찾을 때 사용
    console.log(result.totalPost);
    let total = result.totalPost;
    db.collection('post').insertOne({_id : total + 1, 할일 : req.body.title, 날짜 : req.body.date} , function(err, result) {
      console.log('저장완료');
      db.collection('counter').updateOne({name : '개시물개수'}, { $inc : {totalPost:1} }, function(err,result){
        if(err) {return console.log(err)}
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