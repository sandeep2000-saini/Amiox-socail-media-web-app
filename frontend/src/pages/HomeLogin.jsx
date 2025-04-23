import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar.jsx";
import "./HomeLogin.css";
import banner from "../assets/Bannerr.png";
import Lottie from "lottie-react";
import animationData from "../Down.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice.js";


const HomeLogin = () => {
  const [input, setInput] = useState({
    userID: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/login",
        input,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        
        dispatch(setAuthUser(res.data.user)); 
        navigate("/");
        alert("login Successfully");
        console.log(res.data.message);
        toast.success(res.data.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        setInput({
          userID: "",
          password: "",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(user){
        navigate("/");
    }
},[])

  return (
    <>
      <div style={{ backgroundColor: "black", height: "100%", color: "white" }}>
        <Navbar />
        <div className="containerBanner">
          <img src={banner} alt="Banner" className="banner" />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "-10px",
          }}
        >
          <Lottie
            animationData={animationData}
            loop={true}
            style={{ width: 100, height: 100 }}
          />
        </div>
        <div className="container">
          <div className="usrCard">
            <p>User Card Show</p>
          </div>
          <div className="login">
            <form onSubmit={handleLogin}>
              <h1 className="Title">Hello!</h1>
              <h2 className="Subtitle">Welcome Back</h2>
              <input
                className="Input"
                type="text"
                placeholder="User ID"
                value={input.userID}
                name="userID"
                onChange={changeEventHandler}
                required
              />
              <input
                className="Input"
                type="password"
                placeholder="Password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                required
              />
              <a className="ForgotPassword" href="#">
                Forgot Password?
              </a>
              <div>
                {loading ? (
                  <p style={{ color: "white", fontSize: "25px" }}>Loading...</p>
                ) : (
                  <button className="Button" type="submit">
                    Login
                  </button>
                )}
              </div>
              <p className="CreateAccount">
                Don’t have an account? <a href="#">Create Account</a>
              </p>
            </form>
          </div>
        </div>

        <ToastContainer/>
      </div>
    </>
  );
};

export default HomeLogin;
