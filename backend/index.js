const server = require('express');
const app = server();
const userrouter = require('./UserRouter/userrouter');
const cors = require('cors');
const todorouter = require('./UserRouter/todorouter');
const { default: mongoose } = require('mongoose');
const todomodel = require('./UserModels/todomodel');
const usermodel = require('./UserModels/usermodel');





app.use(cors());
app.use(server.static("public"));
app.use(server.json());

app.get("/", async(req, res) => {

    try {
        const getToken=req.headers.authorization;
        const getUserId = getToken.split(" ")[1];
        if (!getUserId) {
            return res.status(401).json({ success: false, message: "Please Login Again " });
        }
        const findAllTodo = await usermodel.findOne({_id:getUserId}).populate({
            path:"todocreateby"
        });
        if(!findAllTodo || findAllTodo.length===0){
            return res.status(404).json({success:true,message:"No Task Pending "});
        }
        return res.status(200).json({success:true,message:"Tasks retrieved successfully",userTask:findAllTodo});

    } catch (error) {
        console.error("Error : ",error.message);
        return res.status(500).json({ success: false, message: "An error Found.", error: error.message });
    }
});
app.use("/user", (req, res, next) => {

    next();
}, userrouter);
app.use("/todo", todorouter);

app.get("/", (req, res) => {
    return res.send("Server STarred");
});


mongoose.connect("mongodb://localhost:27017/todoapp").then(() => console.log("Database ")).catch(e => console.log(e.message));
app.listen(5000, () => {
    console.log("Server Started");
})
