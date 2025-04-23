import React, { useEffect, useState } from "react";
import { FaShareAlt, FaComment } from "react-icons/fa";
import { FiBookmark } from "react-icons/fi";
import Description from "./Description";
import fireIcon from "../assets/notoFire.svg";
import fireColorIcon from "../assets/notoFireColor.svg";
import { useDispatch, useSelector } from "react-redux";
import { setVideoPosts } from "../redux/videoSlice";
import axios from "axios";
import { toast } from "react-toastify";


const formatDate = (date) => {
  const diff = Math.floor((new Date() - new Date(date)) / 1000);
  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
    { name: "second", seconds: 1 },
  ];

  for (let unit of units) {
    const interval = Math.floor(diff / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.name}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

const VideoDetailFeedRightSide = ({ video }) => {

    const { user } = useSelector((store) => store.auth);
  const { videoPosts } = useSelector((store) => store.videoPost);
  const [liked, setLiked] = useState(video?.likes?.includes(user?.id) || false);
  const [postLike, setPostLike] = useState(video?.likes?.length);
  const dispatch = useDispatch();


  


  useEffect(() => {
    if (video) {
      setLiked(video.likes.includes(user?.id));
      setPostLike(video.likes.length);
    }
  }, [video]);

  const LikeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:5000/api/v1/postVideo/${video._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updateLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updateLikes);
        setLiked(!liked);

        const updatedPostData = videoPosts.map((p) =>
          p._id === video._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id) // Unlike case
                  : [...p.likes, user._id], // Like case
              }
            : p
        );
        dispatch(setVideoPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };




  if (!video)
    return (
      <div className="bg-gray-800 h-screen w-auto text-white flex items-center justify-center" style={{borderRadius: "20px 0  0 20px"}}>
        Select a video to view details
      </div>
    );

  return (
    <div className="bg-black h-screen w-auto text-white p-4 shadow-lg flex flex-col gap-3 rounded-lg overflow-y-auto " style={{borderRadius: "20px 0  0 20px"}}>
      {/* User Info */}
      <div className="flex items-center gap-3 border-b border-gray-700 pb-3">
        <img
          src={video.authorId.backgroundImage}
          alt="User DP"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="text-sm font-semibold">{video.authorId?.fullname || "Unknown User"}</h3>
          <p className="text-xs text-gray-400">@{video.authorId?.userID || "username"}</p>
        </div>
      </div>

      {/* Trending Info */}
      {/* <p className="text-sm text-gray-400">#{video.trendingRank || "N/A"} Trending</p> */}

      {/* Video Info */}
      <video src={video.videoUrl} className="w-full h-40 rounded-lg mt-2" />
        {/* {Video Title &} */}
      <h2 className="text-lg text-white font-[200]">{video.videoTitle}</h2>
      <span><Description text={video.videoDescription}/></span>

      {/* Stats */}
      <div className="text-sm text-gray-400 mt-2 flex gap-4">
        <span>{video?.views || 0} views</span>
        <span>{formatDate(video.createdAt) || "N/A"}</span>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-2 border-t border-gray-700 pt-3">
        <div className="flex gap-3 items-center">
          <button 
          className={`flex item-center gap-1 ${liked ? "text-red-500" : "text-gray-500"}`}
          onClick={LikeOrDislikeHandler}
          >
            <img 
            src={liked ? fireColorIcon : fireIcon}
            alt="Like Icon"
            className="w-5 h-5"
            />
            <span>{postLike}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-300 hover:text-blue-400">
            <FaComment className="text-lg" /> {video.comments.length || 0}
          </button>
          <button className="flex items-center gap-1 text-gray-300 hover:text-green-400">
            <FaShareAlt className="text-lg" /> Share
          </button>
        </div>
        <button className="text-gray-300 hover:text-yellow-400">
          <FiBookmark className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default VideoDetailFeedRightSide;
