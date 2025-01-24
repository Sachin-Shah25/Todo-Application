const express=require('express');
const { addTodoFun,updateTodoFun,deleteTodoFun } = require('../UserController/todocontroller');
const todorouter=express.Router();



todorouter.post("/addtodo",addTodoFun);
todorouter.put("/updatetodo/:id",updateTodoFun);
todorouter.delete("/deletetodo/:id",deleteTodoFun);

module.exports=todorouter;