"use client";

import React, { useState } from "react";
import { FaRegComment } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setVideoPosts } from "../redux/videoSlice";

// Utility function to format time
const getTimeElapsed = (createdAt) => {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diff = Math.floor((now - createdDate) / 1000); // Difference in seconds

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

export default function CommentVideoScreen({ post }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const { videoPosts } = useSelector((store) => store.videoPost);

  const openScreen = () => setIsOpen(true);
  const closeScreen = () => setIsOpen(false);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/v1/postVideo/${post._id}/comment`,
        { text: newComment },
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPosts = videoPosts.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...p.comments, res.data.comment] }
            : p
        );
        dispatch(setVideoPosts(updatedPosts));
        setNewComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Button to open comment screen */}
      <button
        onClick={openScreen}
        className="flex items-center text-gray-600 hover:text-gray-800"
      >
        <FaRegComment className="w-5 h-5 mr-1" />
        <span className="text-sm">{post.comments.length}</span>
      </button>

      {/* Comment Screen */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={closeScreen}
        >
          <div className="bg-white w-[750px]  rounded-xl mr-5">
            <video
              className="object-center object-cover w-full h-auto"
              style={{ borderRadius: "10px 10px 0 0" }}
              controls
              loop
              muted
            >
              <source src={post.videoUrl} type="video/mp4" />
            </video>
          </div>

          <div
            className="bg-white w-full max-w-md h-5/6 rounded-lg shadow-lg flex flex-col"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center">
                <h2 className="text-lg">Comments</h2>
                <span className="ml-2" style={{ fontSize: "12px" }}>
                  {post.comments.length}
                </span>
              </div>
              <button
                onClick={closeScreen}
                className="text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {post.comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-3">
                  <img
                    src={comment.avatar}
                    alt={comment.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{comment.username}</span>
                      <span className="text-xs text-gray-500">
                        {getTimeElapsed(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm text-left">
                      {comment.content}
                    </p>
                    <button className="text-blue-500 text-xs mt-1">
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Input and Post Button */}
            <div className="p-4 border-t flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handlePostComment}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
