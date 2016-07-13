/**
 * Created by lifei on 2016/7/10.
 */
var mongoose=require('mongoose');
var ObjectId=mongoose.Schema.Types.ObjectId;
module.exports={
    User:{
        username:{type:String,required:true},
       password:{type:String,required:true},
        email:{type:String,required:true},
       avatar:{type:String,required:true}
    },
    Article:{
        comments:[{user:{type:ObjectId,ref:'User'},
     content:String,createAt:{type:Date,default:Date.now()}}],
        user:{type:ObjectId,ref:'User'},
       title:{type:String,required:true},
       img:{type:String},

     //   获取时间防止我们的时间的冲突
     createAt:{type:Date,default:Date.now()},
        pv:{type:Number,default:0}
    }
}


//为mongon设置Schema模板