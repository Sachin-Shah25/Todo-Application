import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";


export const AppComp = createContext();
export const ContextProvider = (props) => {
    const [getAllTask, setAllTask] = useState([]);
    const [showUpdateBox, hideUpdateBox] = useState({
        isTask: false,
        updateValue: "",
        taskId: null
    });
    const [getUser,setUser]=useState({});


    const addTaskFun = async (newTask) => {

        try {
            const { data } = await axios.post(`${BASE_URL}/todo/addtodo`, newTask);

            if (!data || !data.message) {
                toast.error(data.message || "Not Added ");
                return;
            }
            toast.success("New Task Added ");
            setAllTask(data.userTask.todocreateby || []);

        } catch (error) {
            toast.error("Todo Not Added ");
            console.error("Not Added : ", error.message);

        }

    }

    const removeTask = async (id) => {

        try {
            const getToken = localStorage.getItem("token");
            if (!getToken) {
                toast.error("!Please Login Again ");
                return;

            }
            const { data } = await axios.delete(`${BASE_URL}/todo/deletetodo/${id}`, {
                headers: {
                    Authorization:`Bearer ${getToken}` 
                }
            });

            if (!data || !data.success) {
                toast.error("Todo Can't Deleted " || data.message);
                return;
            }
            toast.success("Deleted");
            setAllTask(data.userTask.todocreateby || []);

        } catch (error) {
            console.error("Can't Delete : ", error.message);
            toast.error("Can't Delete ");
        }
    }

    const updateTaskFun = async (title, dis) => {

        try {

            const getToken = localStorage.getItem("token");
            if (!getToken) {
                toast.error("!Please Login Again ");
                return;
            }
            const getTodoId = showUpdateBox.taskId;

            const { data } = await axios.put(`${BASE_URL}/todo/updatetodo/${getTodoId}`, { title, dis},{
                headers:{
                    Authorization:getToken
                }
            });

            if (!data || !data.success) {
                toast.error(data.message || "Can't Update ");
                return;
            }
            toast.success("A Todo Updated ");
            setAllTask(data.userTask.todocreateby);
            hideUpdateBox((e) => {
                return { ...e, isTask: !e.isTask }
            });

        } catch (error) {
            toast.error("Can't Upaded ");
            console.error("Error : ", error.message);
        }

    }

    const findAllTask = async () => {
        try {
            const getToken = localStorage.getItem("token");
            if (!getToken) {
                toast.error("!Please Login Again ");
                return;
            }
            const { data } = await axios.get(`${BASE_URL}/`,{
                headers:{
                    Authorization:`Bearer ${getToken}`
                }
            });
            if (!data || !data.success) {
                toast.error(data.message || "Not Found");
                return;
            }
            setUser(data.userTask);
            setAllTask(data.userTask.todocreateby || []);


        } catch (error) {
            console.error("Not Found : ", error.message);
            toast.error("An Error Found when we fetching tasks.");
        }
    }
    useEffect(() => {

        findAllTask();

    }, []);

    return <AppComp.Provider value={{ setAllTask, getAllTask, addTaskFun, removeTask, updateTaskFun, showUpdateBox, hideUpdateBox,findAllTask,setUser,getUser }} >
        {props.children}
    </AppComp.Provider>
}


