import React, { useEffect, useRef, useState } from "react";
import './FloatNavBar.css';
import CreatePost from "../createPost.jsx";
import CreateVideo from "../createVideo.jsx";
import CreateBlog from "../createBlog.jsx";
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";
import { HiOutlineUpload } from "react-icons/hi";


const FloatNavBar = () => {
  

    const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isUploadMenuOpen, setUploadMenuOpen] = useState(false);
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [isCreateVideoOpen, setCreateVideoOpen] = useState(false);
  const [isCreateBlogOpen, setCreateBlogOpen] = useState(false);

  const {user} = useSelector((store) => store.auth);

  const menuRef = useRef(null);


  const handlePostButtonClick = () => {
    setCreatePostOpen(true); // Open CreatePost component
    closeUploadMenu(); // Close the upload menu when opening the post modal
  };

  const handleVideoButtonClick = () => {
    setCreateVideoOpen(true); // Open CreateVideo component
    closeUploadMenu(); // Close the upload menu when opening the video modal
  };

  const handleBlogButtonClick = () => {
    setCreateBlogOpen(true); // Open CreateBlog component
    closeUploadMenu(); // Close the upload menu when opening the blog modal
  };

  const toggleUploadMenu = () => {
    setUploadMenuOpen(!isUploadMenuOpen);
  };

  const closeUploadMenu = () => {
    setUploadMenuOpen(false);
  };
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeUploadMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsVisible(false); // Hide navbar when scrolling down
    } else {
      setIsVisible(true); // Show navbar when scrolling up
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);


    return (

      <>
        <div className="flex justify-center items-center">
        <nav className={`navbar ${isVisible ? "visible" : "hidden"}`}>
      <ul>
        
        <Link to={"/feed"} className="flex">
        <li className="gap-2"><HiHome/>Home</li>
        </Link>
        
        <Link to={"/search"} className="flex">
        <li className="gap-2"><IoSearch/>Search</li>
        </Link>
        
        
        <li ref={menuRef} onClick={toggleUploadMenu}><HiOutlineUpload className="mr-2"/>Upload
        {isUploadMenuOpen && (
          <div className="upload-menu">
            <button className="upload-button photo" onClick={handlePostButtonClick}>Photo</button>
            <button className="upload-button video" onClick={handleVideoButtonClick}>Video</button>
            <button className="upload-button thought" onClick={handleBlogButtonClick}>Blog</button>
          </div>
        )}
        </li>

        <Link to={`/profile/${user?.id}`}>
        <li className="gap-2"> <div>
          <img src={user?.backgroundImage} alt="profile" className="w-[35px] h-[35px] rounded-[60px] border-2"/>
          </div>  Profile</li>
        </Link>

      </ul>
    </nav> 
    </div>

    {/* Conditional rendering for CreatePost */}
      {isCreatePostOpen && <CreatePost open={isCreatePostOpen} setOpen={setCreatePostOpen} />}
      {/* Conditional rendering for CreateVideo */}
      {isCreateVideoOpen && <CreateVideo open={isCreateVideoOpen} setOpen={setCreateVideoOpen} />}
      {/* Conditional rendering for CreateBlog */}
      {isCreateBlogOpen && <CreateBlog open={isCreateBlogOpen} setOpen={setCreateBlogOpen} />}
    </> 
    );
};
export default FloatNavBar;