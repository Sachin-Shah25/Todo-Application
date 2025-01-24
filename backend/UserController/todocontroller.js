const { default: mongoose } = require("mongoose");
const todomodel = require("../UserModels/todomodel");
const usermodel = require("../UserModels/usermodel");

const addTodoFun = async (req, res) => {
    try {
        const { title, dis, userId } = req.body;

        const isTodoAdded = await todomodel.create({ title, dis, usId: userId });
        if (!isTodoAdded) {
            return res.status(503).json({ success: false, message: "Can't Added Todo" });
        }
        const addTodoIntoUser = await usermodel.findOne({ _id: userId });
        addTodoIntoUser.todocreateby.push(isTodoAdded._id);
        await addTodoIntoUser.save();

        const getTodoOfUser = await addTodoIntoUser.populate({
            path: "todocreateby"
        })

        return res.status(200).json({ success: true, message: "Add Successfully ", data: isTodoAdded, userTask: getTodoOfUser });
    } catch (error) {
        console.error("Can't Add : ", error.message);
        return res.status(503).json({ success: false, message: "Can't Add" });
    }

}

const updateTodoFun = async (req, res) => {
    try {
        const todoId = req.params.id;
        const { title, dis} = req.body;
        const getToken=req.headers.authorization.split(" ")[1];

        const findTodo = await todomodel.findOneAndUpdate({ _id: todoId }, { $set: { title, dis } });
        if (!findTodo) {
            return res.status(503).json({ success: false, message: "Can't Updated" });
        }
        const getTodoOfUser = await usermodel.findOne({ _id: getToken }).populate({
            path: "todocreateby"
        })
        return res.status(200).json({ success: true, message: "Todo Updated ", data: findTodo, userTask: getTodoOfUser });

    } catch (error) {
        console.error("Can't Updated : ", error.message);
        return res.status(503).json({ success: false, message: "Can't Updated " });
    }
}

const deleteTodoFun = async (req, res) => {
    try {
        const todoId = req.params.id;
        const userId = req.headers.authorization.split(" ")[1];

        const isPostDelete = await todomodel.findOneAndDelete({ _id: todoId });
        if (!isPostDelete) {
            return res.status(503).json({ success: false, message: "Post Not Deleted " });
        }
        const postDeleteFromUser = await usermodel.findOne({ _id: userId });
        postDeleteFromUser.todocreateby.pull(todoId);


        await postDeleteFromUser.save();

        const getTodoByUser = await postDeleteFromUser.populate({
            path: "todocreateby"
        })


        return res.status(200).json({ success: true, message: "Todo Deleted Successfully ", data: isPostDelete, userTask: getTodoByUser });


    } catch (error) {
        console.error("Can't Delete : ", error.message);
        return res.status(503).json({ success: false, message: error.message });
    }
}

module.exports = { addTodoFun, updateTodoFun, deleteTodoFun };