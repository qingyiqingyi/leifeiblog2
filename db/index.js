/**
 * Created by lifei on 2016/7/10.
 */
var mongoose=require('mongoose')
var Schema=mongoose.Schema;//定义内部的结构
var settings=require('../settings');//这个地方是链接的我们的mongod的路径要启动mong
var models=require('./models');//
mongoose.connect(settings.url);
//建立数据库的模块即是集合的名字是User-----users   内部的结构是文件models里面的user的结构
mongoose.model('User',new Schema(models.User))
mongoose.model('Article',new Schema(models.Article))//数据库的集合的名字是Article   去的模板是内部的Article


    //在全局下暴露一个Model的接口传入模块的名字就会回来找对队列应的模块及user  Article
    global.Model= function (type) {
        return mongoose.model(type)
    }