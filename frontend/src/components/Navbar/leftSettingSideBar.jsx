import React from "react";
import { TbLogout2 } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { setAuthUser, setSuggestedUser } from "../../redux/authSlice";
import axios from "axios";
import { setPosts } from "../../redux/postSlice";

const sidebarItem = [
  { text: "Edit Profile" },
  { text: "Privacy" },
  { text: "Notification" },
  { text: "Customization" },
  { text: "Content Preferences" },
  { text: "Data and Storage" },
  { text: "Help & Support" },
  { text: "About" },
  { icon: <TbLogout2 />, text: "Logout" },
];

const LeftSettingSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPosts([]));
        dispatch(setSuggestedUser([]));
        navigate("/login");
        alert("logout Successfully");

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
      }
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message).
      toast.error(error.response.data.message, {
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
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") logoutHandler();
    if(textType === "Edit Profile") navigate("/settings");
  };

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1
          className="my-8 pl-3 font-bold text-xl"
          style={{ textTransform: "uppercase", letterSpacing: "8px" }}
        >
          Amiox
        </h1>
        {sidebarItem.map((item, index) => {
          return (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-2 my-2"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default LeftSettingSideBar;
