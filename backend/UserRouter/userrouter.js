const express=require('express');
const { createUserFun,loginUserFun } = require('../UserController/usercontroller');
const userrouter=express.Router();





userrouter.post("/createuser",createUserFun);
userrouter.post("/loginuser",loginUserFun);

module.exports=userrouter;