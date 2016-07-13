var express = require('express');
var router = express.Router();

/* GET users listing. */

//注册   返回一个空白
router.get('/reg', function(req, res, next) {
  //以view为根目录
  res.render('user/reg',{title:'注册'})

});
router.get('/login', function(req, res, next) {
  //以view为根目录
  res.render('user/login',{title:'登陆'})

});
router.get('/logout', function(req, res, next) {
  //以view为根目录
  res.send('退出')

});
router.post('/reg', function(req, res) {
  //以view为根目录
  //点击后吧内容发给我们
  var user=req.body;

  if(user.password !=user.repassword){

    req.flash('error','密码和重复密码不一致')
    return res.redirect('back')
  }
 delete user.repassword;

 user.password=md5(user.password) ;
//  翻墙才能用
user.avatar= 'https://secure.gravatar.com/avatar/'
      +md5(user.email)+'?s=48';
  console.log(user);
Model('User').create(user, function (err,doc) {
  if(err){

    //一个是获取
    req.flash('error','sorry,失败')
  return res.redirect('back');

  }else{
    req.flash('success','成功')
    req.session.user=doc;
    res.redirect('/')
  }
})
});
function md5(str) {
  return require('crypto')
      .createHash('md5')
      .update(str)
      .digest('hex')
}
router.post('/logout', function(req, res, next) {
  //以view为根目录
  req.session.user=null;
  res.redirect('/user/login')


});
router.post('/login',function(req, res) {
 var user=req.body;
  user.password=md5(user.password)
  Model('User').findOne(user,function (error,doc) {
    if(error){
      req.flash('error','登录失败');
      res.redirect('back')
    }else{
      if(doc){
        req.flash('success','登录成功');
        req.session.user=doc;
        res.redirect('/')
      }else{
        req.flash('error','登录失败');
        res.redirect('back')
      }
    }
  })



});

module.exports = router;
