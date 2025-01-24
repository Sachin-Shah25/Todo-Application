const mongoose=require('mongoose');
const todoSchema= new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    dis:{
        type:String,
        require:true
    },
    usId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},{timestamps:true});

const todomodel= mongoose.model("todos",todoSchema);

module.exports=todomodel;