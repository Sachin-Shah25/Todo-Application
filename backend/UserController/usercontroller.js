const bcryptPass=require('bcryptjs');
const usermodel = require('../UserModels/usermodel');
const createUserFun=async (req,res) => {
    try {
        const {username,useremail,userpassword}=req.body;
        const createSecurePassword=bcryptPass.hashSync(userpassword);

        const finduser=await usermodel.findOne({useremail});
        if(finduser){
            return res.status(200).json({success:false,message:"The Email already Exisits"});
        }
        const isAccCreated=await usermodel.create({
            username,useremail,userpassword:createSecurePassword
        });

        if(!isAccCreated){
            return res.status(503).json({success:false,message:"Can't Created Account",data:isAccCreated});
        }
        return res.status(200).json({success:true,message:"Account Created ",data:isAccCreated});

    } catch (error) {
        console.error("Can't Create account : ",error.message);
        return res.status(500).json({success:false,message:"Can't Create Account"});
    }
}

const loginUserFun=async(req,res)=>{
    try {
        const {useremail,userpassword}=req.body;
        const ifUserAvailable=await usermodel.findOne({useremail});
        if(!ifUserAvailable){
            return res.status(503).json({success:false,message:"This email is not regisrted:"});
        }
        const checkPassword=bcryptPass.compareSync(userpassword,ifUserAvailable.userpassword);
        if(!checkPassword){
            return res.status(200).json({success:false,message:"Password doesn't match"});
        }
        return res.status(200).json({success:true,message:"Login Successfully ",data:ifUserAvailable});
    } catch (error) {
        console.error("Can't Login : ",error.message);
        return res.status(503).json({success:false,message:e.message});
    }
}

module.exports={createUserFun,loginUserFun}