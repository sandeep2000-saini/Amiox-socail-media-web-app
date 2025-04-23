import React, { useState } from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import CommentScreen from "./commentModal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice"; // Ensure this import exists
import { toast } from "react-toastify"; // Ensure this import exists
import  fireColorIcon from '../assets/notoFireColor.svg'
import fireIcon from '../assets/notoFire.svg'

const PostDes = ({ post}) => {
  const { posts } = useSelector(store => store.post);
  const { user } = useSelector(store => store.auth);
  const [liked, setLiked] = useState(post.likes.includes(user?.id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const dispatch = useDispatch();

  const LikeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:5000/api/v1/PostImage/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike -1 : postLike +1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // apne post ko update krunga
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md  overflow-hidden mb-5">
      {/*shadow-md*/}
      <div className="relative">
        <img
          className="w-full h-full object-cover rounded-xl"
          src={post.image}
          alt="Post image"
        />
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white "
          
        >
          <div className="flex justify-between items-end">
            <div>
              <span className="font-bold">{post.authorId?.userID}</span>
            </div>
            <div>
              <img
                className="w-10 h-10 border-[3px] rounded-3xl border-white"
                src={post.authorId?.backgroundImage}
                alt="avatar"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex">
            { liked ? (
              <img src={fireColorIcon}
              onClick={LikeOrDislikeHandler}
                className="cursor-pointer"
                style={{width:"20px"}}
              />
              
            ) : (
              < img src={fireIcon}
                onClick={LikeOrDislikeHandler}
                style={{width:"20px"}}
                className="cursor-pointer"
              />
            )}

            <span className=" ml-1 mt-1.5 text-sm text-gray-600 hover:text-gray-800">{postLike} Fires</span>
          </div>
          <div className="flex space-x-2">
              <CommentScreen post={post}/>
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <IoShareSocialOutline className="w-5 h-5 mr-1" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
        <p className="text-gray-700 text-base">{post.caption}</p>
      </div>
    </div>
  );
};

export default PostDes;
