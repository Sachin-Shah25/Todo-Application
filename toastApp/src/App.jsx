import React, { useContext, useState } from 'react'
import './App.css'
import TastComponent from './Component/TastComponent'
import { AppComp } from './AppComponent/AppComp';
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from 'react-toastify';
import { BASE_URL } from '../config';
import axios from 'axios';

function App() {
  const { getAllTask, addTaskFun, showUpdateBox, updateTaskFun, removeTask, findAllTask,
    getUser, setUser
  } = useContext(AppComp);
  const [showField, hideField] = useState(false);
  const [getTitle, setTitle] = useState("");
  const [getDis, setDis] = useState("");
  const [getUpdateTitle, setUpdateTitle] = useState("");
  const [getUpdateDis, setUpdateDis] = useState("");
  const [showform, hideform] = useState(false);
  const [showloginForm, hideloginForm] = useState(false);
  const [getUserName, setUserName] = useState("");
  const [getUserEmail, setUserEmail] = useState("");
  const [getUserPassword, setUserPassword] = useState("");

  const add_Task_Fun = () => {

    const getToken = localStorage.getItem("token");
    if (!getToken) {
      toast.warning("Please Login Again ");
      return;
    }

    const taskObj = {
      title: getTitle.trim(),
      dis: getDis.trim(),
      userId: getToken
    }
    addTaskFun(taskObj);
    hideField(false);
    setTitle("");
    setDis("");
  }
  const formSubmitFun = (e) => {
    e.preventDefault();
    const userdata = {
      username: getUserName,
      useremail: getUserEmail,
      userpassword: getUserPassword
    }



    try {
      if (!getUserPassword || !getUserEmail) {
        toast.error("All Filed Required ");
        return;
      }
      if (getUserPassword.length < 6) {
        toast.error("Password is too short ");
        return;
      }
      const pendingState = toast.loading("Checking Details....");
      if (!showloginForm) {
        setTimeout(async () => {
          try {
            const { data } = await axios.post(`${BASE_URL}/user/createuser`, userdata);
            toast.dismiss(pendingState);
            if (!data || !data.success) {
              toast.error(data.message || "Could not create user ");
              return;
            }

            const token = data.data._id;
            
            if (token) localStorage.setItem("token", token);

            toast.success(data.message || "User created successfully!");
            hideform(false);
            setUser(data.data);
            findAllTask();
          } catch (innerErr) {
            toast.dismiss(pendingState);
            toast.error("An error occurred during user creation.");
            console.error("Error during account creation: ", innerErr.message);
          }

        }, 1000);
      }
      else {
        setTimeout(async () => {
          try {
            const { data } = await axios.post(`${BASE_URL}/user/loginuser`, userdata);
            toast.dismiss(pendingState);
            if (!data || !data.success) {
              toast.error(data.message || "Could not Login ");
              return;
            }

            const token = data.data._id;
            if (token)  localStorage.setItem("token", token);
            toast.success(data.message || "Login successfully!");
            setUser(data.data);
            hideform(false);
          } catch (innerErr) {
            toast.dismiss(pendingState);
            toast.error("An error occurred during user Login.");
            console.error("Error when user login: ", innerErr.message);
          }

        }, 1000);
      }


    } catch (error) {
      toast.dismiss(pendingState);
      toast.error("Unexcepted Error ");
      console.error("Unexcepted Error : ", error.message);
      hideform(false);
    }
  }

  return (
    <div id='main_container'>
      <div className="container">
        <div className="container_left_side" style={{
          width: showField ? "75%" : "100%"
        }} >
          <nav>
            <div className="user_image" onClick={() => { hideField(e => !e) }} >
              <img src="/img/user1.png" alt="" />

            </div>
            <div className="first_task">
              <div className="first_task_name">
                <h1>Your Next Work</h1>
              </div>
              <div className="first_task_dis">
                <p style={{ marginLeft: '10px', marginTop: '3px',fontSize:'15px' }} >{getAllTask[0]?.dis}</p>
              </div>
            </div>
            <div className="first_task_completed" onClick={() => removeTask(getAllTask[0]?._id)} >
              <button>Pending</button>
            </div>
          </nav>

          <div className={`user_task ${getAllTask.length >= 6 ? "response_user_task" : ""}`}>
            {
              getAllTask.filter((_, id) => id != 0).map((task, id) => {


                return <TastComponent task={task} taskId={id} ></TastComponent>
              })
            }
          </div>
        </div>
        <div className="container_right_side" style={{
          width: showField ? "25%" : "0",
          opacity: showField ? "1" : "0"
        }}>
          <div className="add_task_container">
            <h1 id='heading'>Add One More ? </h1>
            <div className="task_title">
              <input type="text" placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="tast_disc" onChange={(e) => setDis(e.target.value)} >
              <textarea name="" id="" rows={10} ></textarea>
            </div>
            <div className="tast_add_btn" >
              <button onClick={() => add_Task_Fun()} >Add Task</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom_container" style={{
        bottom: showUpdateBox.isTask ? "0px" : "-300px",
      }}>
        <div className="update_task">
          <div className="update_title">
            <span>Update Title</span>
            <input type="text" value={getUpdateTitle} onChange={(e) => setUpdateTitle(e.target.value)} />
          </div>
          <div className="update_dis">
            <span>Update Discription</span>
            <textarea name="" id="" rows={5} value={getUpdateDis} onChange={(e) => setUpdateDis(e.target.value)} ></textarea>

          </div>
        </div>
        <div className="update_btn">
          <button onClick={() => updateTaskFun(getUpdateTitle, getUpdateDis)} >Update Task</button>
          <button onClick={() => removeTask(showUpdateBox.taskId)} >Remove Task</button>
        </div>
      </div>


      <id id="floating_btn" onClick={() => hideform(e => !e)} style={{ transform: showform ? "rotate(360deg)" : "rotate(0deg)" }} >
        <img src="/img/user4.png" alt="" />
        <p style={{ width: "100%", textAlign: 'center', fontSize: '12px', color: 'white' }} >{getUser?.username}</p>

      </id>


      <div className="user_auth_form" style={{ transform: showform ? "scale(1)" : "scale(0)" }} >
        <form action="#" onSubmit={(e) => formSubmitFun(e)} >
          <h1 style={{ color: 'white' }} >{showloginForm ? "Welcome Back !" : "Create New Account "}  </h1>
          {
            showloginForm
              ? ""
              : <div className="username" style={{ marginTop: '20px' }}>
                <input type="text" placeholder='Enter Your name' onChange={(e) => setUserName(e.target.value)} />
              </div>
          }

          <div className="useremail">
            <input type="email" name="" placeholder='Enter Your Email' id="" onChange={(e) => setUserEmail(e.target.value)} />
          </div>
          <div className="userpassword" >
            <input type="text" placeholder='Enter Your Password' onChange={(e) => setUserPassword(e.target.value)} />
          </div>
          <div className="already_acc" style={{ color: 'white', fontSize: '12px' }}>
            {showloginForm ? "Create new account ?  " : "Already User ?  "}
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => hideloginForm(e => !e)} >{showloginForm ? "SignUp" : "SignIn"} </span>
          </div>
          <div className="user_btn">
            <button > {showloginForm ? "SignIn" : "SignUp"} </button>
          </div>
        </form>
      </div>

      <ToastContainer position='top-right' />
    </div>
  )
}

export default App
