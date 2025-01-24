const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    useremail:{
        type:String,
        require:true
    },
    userpassword:{
        type:String,
        require:true
    },
    todocreateby:[{
       type:mongoose.Schema.Types.ObjectId,
        ref:"todos"
    }]
},{timestamps:true});

const usermodel= mongoose.model("users",userSchema);

module.exports=usermodel;