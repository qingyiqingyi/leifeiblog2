var express = require('express');
//路由的实例
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  //res.render('index',{ title: 'Express'});
//  res.redirect("article/list")
//});
markdown = require('markdown').markdown;

//router.get('/', function(req, res, next) {
//  Model('Article').find({}).populate('user').exec(function(err,articles){
//    articles.forEach(function (article) {
//      article.content = markdown.toHTML(article.content);
//    });
//    res.render('index', {title: '主页',articles:articles});
//  });
//});
router.get('/', function(req, res, next) {
  res.redirect('/article/list');
});
module.exports = router;
//request(method:get/post)