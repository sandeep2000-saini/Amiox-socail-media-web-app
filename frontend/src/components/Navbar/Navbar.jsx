import React, { useEffect, useState } from "react";
import "./navbar.css";
import axios from "axios";
import {ToastContainer, toast } from "react-toastify";
import {useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    userID: "",
    email:"",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const signUpHandeler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/register",
        input,
        {
          Headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate("/feed");
        alert("User Registered Successfully");
        toast.success(res.data.message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
          });
        setInput({
          fullname: "",
          userID: "",
          password: "",
          email: "",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
  };

  const handleCloseModal = () => {
    setShowSignupModal(false);
  };

  useEffect(()=>{
    if(user){
        navigate("/feed");
    }
},[])

  return (
    <div>
      <nav className="navbarr">
        <div className="navbar-logo">AMIOX</div>
        <ul className="navbar-menu">
          <li>Home</li>
          <li>Blog</li>
          <li>Contact Us</li>
        </ul>
        <div className="navbar-right">
          <button className="btn btn-login">Login</button>
          <button className="btn btn-signup" onClick={handleSignupClick}>
            Signup
          </button>
        </div>
      </nav>

      {showSignupModal && (
        <div className="modal-overlay backdrop-blur-sm">
          <div className="modal-content">
            <h1>Register Now</h1>
            <h2>Sign up</h2>
            <p>Sign up to get started</p>
            <form onSubmit={signUpHandeler}>
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  required
                  value={input.fullname}
                  onChange={changeEventHandler}
                />
              </div>
              <div className="form-group">
                <label htmlFor="userid">User ID</label>
                <input
                  type="text"
                  name="userID"
                  required
                  value={input.userID}
                  onChange={changeEventHandler}
                />
              </div>
              <div className="form-group">
                <label htmlFor="emailID">Email ID</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={input.email}
                  onChange={changeEventHandler}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={input.password}
                  onChange={changeEventHandler}
                />
              </div>
              <div>
              {
                  loading ? <p style={{color:"black",fontSize:"25px"}}>Loading...</p> : (
                    <button type="submit" className="submit-button">
                Let's Go
              </button>
                  )
                }
              </div>
              
              <label className="checkbox-container" htmlFor="terms">
                <input type="checkbox" id="terms" name="terms" required />
                <p className="terms">I agree to the terms and conditions</p>
              </label>
            </form>
            <button className="close-button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default Navbar;
