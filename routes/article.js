/**
 * Created by lifei on 2016/7/9.
 */
//就不用写http....
var express = require('express');
var middleware = require('../middleware');
var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.mimetype.slice(file.mimetype.indexOf('/') + 1))
    }
})
var upload = multer({storage: storage})
//创建一个路由
var router = express.Router();
//中间件写法
router.get('/list', function (req, res) {
    //在URL中解析出来的
    var keyword = req.query.keyword;
    var pageNum = req.query.pageNum ? Number(req.query.pageNum) : 1;
    //默认是第一页,每页是2条
    var pageSize = req.query.pageSize ? Number(req.query.pageSize) : 2;
    var query = {};
    if (keyword) {
        //正则匹配文档
        query.title = new RegExp(keyword)
    }
    //populate可以传一个属性进去
    //负责把一个属性从对象ID类型转成一个文档对象
    //用来统计每页的条数
    Model('Article').find(query).count(function (err, count) {
        Model('Article').find(query).skip((pageNum - 1) * pageSize).limit(pageSize).populate('user').exec(function (err, doc) {
            res.render('article/list',
                {
                    title: '发表文章',
                    articles: doc,
                    pageNum: pageNum,
                    pageSize: pageSize,
                    keyword: keyword,
                    totalPage: Math.ceil(count / pageSize)
                })
        })
    })
})
var async = require('async');
router.get('/add', function (req, res) {
    res.render('article/add', {title: '发表文章', article: {}});
})
router.post('/add', upload.single('img'),function (req, res) {
    if(req.file){
        req.body.img = path.join('/uploads',req.file.filename);
    }
    var _id = req.body._id;

    if(_id){
        var set = {title:req.body.title,content:req.body.content};
        if(req.file)
            set.img = req.body.img;
        Model('Article').update({_id:_id},{$set:set},function(err,result){
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            req.flash('success', '更新文章成功!');
            res.redirect('/');//注册成功后返回主页
        });
    }else{
        req.body.user = req.session.user._id;
        delete req.body._id;
        new Model('Article')(req.body).save(function(err,article){
            if(err){
                req.flash('error',err);
                return res.redirect('/articles/add');
            }
            req.flash('success', '发表文章成功!');
            res.redirect('/');//注册成功后返回主页
        });
    }
});


router.get('/detail/:_id', function (req, res) {
    async.parallel([function(callback){
        Model('Article').findOne({_id:req.params._id}).populate('user').populate('comments.user').exec(function(err,article){
            //article.content = markdown.toHTML(article.content);
            callback(err,article);
        });
    },function(callback){
        Model('Article').update({_id:req.params._id},{$inc:{pv:1}},callback);
    }],function(err,result){
        if(err){
            req.flash('error',err);
            res.redirect('back');
        }
        res.render('article/detail',{title:'查看文章',article:result[0]});
    });
});

router.get('/delete/:_id', function (req, res) {
    var _id = req.params._id;
    Model('Article').remove({_id: _id}, function (err, result) {
        if (err) {
            req.flash('error', '失败')
            return res.redirect('back')
        } else {
            req.flash('success', '成功')
            return res.redirect('/')
        }

    })
})


router.get('/update/:_id', function (req, res) {
    var _id = req.params._id;
    Model('Article').findById(_id, function (err, doc) {
        console.log(doc);
        if (err) {
            req.flash('error', '失败')
            return res.redirect('back')
        } else {
            //req.flash('success','成功')

            //开始渲染
            res.render('article/add', {
                title: '更新文章',
                article: doc
            })
        }

    })

})
router.post('/comment/:_id', middleware.checkLogin, function (req, res) {
    var user = req.session.user;
    Model('Article').update({_id: req.body._id},
        {$push: {comments: {user: user._id, content: req.body.content}}},
        function (err, result) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '评论成功!');
            res.redirect('back');
        });
});


module.exports = router;