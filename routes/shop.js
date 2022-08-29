// npm으로 설치했던 express를 쓰겠습니다
let router = require('express').Router();

router.get('/shirts', function(요청, 응답){
  응답.send('셔츠 파는 페이지입니다.');
});

router.get('/pants', function(요청, 응답){
  응답.send('바지 파는 페이지입니다.');
});

/** module.exports : jsd에서 다른 곳에 있는 파일을 가져다쓸 때 사용하는 문법
 * module.exports = 내보낼 변수명
 * 
 * require : 다른 파일, 라이브러리를 가져다가 사용할 때 사용하는 문법 */ 
module.exports = router;