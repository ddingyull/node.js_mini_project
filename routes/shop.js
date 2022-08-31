// npm으로 설치했던 express를 쓰겠습니다
let router = require('express').Router();

function 로그인했니(req, res, next) {
  if(req.user) {
    next()
  } else {
    res.send('로그인 안하셨어요')
  }
}

// 모든 router에 적용할 수 있는 미들웨어를 만들 수 있음, 아래 모든 코드는 '로그인했니'에 대한 검사 후 실행됨
router.use(로그인했니);
// '/shirt'이 페이지만 로그인했니 미들웨어가 적용되도록 작성할 수도 있음 
router.use('/shirt', 로그인했니);

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