import React, { useState } from "react";
import { GoTag } from "react-icons/go";
import { CiCalendar } from "react-icons/ci";
import { FaRegFaceSmile } from "react-icons/fa6";
import { RiText } from "react-icons/ri";
import { GoPeople } from "react-icons/go";
import { BsCamera } from "react-icons/bs";
import {toast} from "react-toastify";
import { readFileAsDataURL } from "../lib/utils";
import axios from "axios"; // Add axios import
import { useDispatch, useSelector } from "react-redux";


const CreatePost = ({ open, setOpen }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [schedule, setSchedule] = useState("");
  const [mood, setMood] = useState("");
  const [postType, setPostType] = useState("");
  const [visibility, setVisibility] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile]= useState("");
  const {posts} =useSelector(store=>store.post);

  const dispatch = useDispatch();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file)
      const dataUrl =  await readFileAsDataURL(file);
      setSelectedImage(dataUrl);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFile(file)
      const dataUrl = await readFileAsDataURL(file);
      setSelectedImage(dataUrl);
    }
  };

  if (!open) return null; // Don't render the component if not open

  const createPostHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", file); // Add image file
    formData.append("caption", caption);
    formData.append("tags", tags);
    formData.append("postSchedule", schedule);
    formData.append("mood", mood);
    formData.append("visibility", visibility);
    formData.append("postType", postType); // Add postType

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/v1/PostImage/addNewPost", formData,{
            headers:{
              'Content-Type':'multipart/form-data'
            },
          withCredentials: true
        } );
        if(res.data.success){
          toast.success(res.data.message);
          dispatch(setPosts([res.data.post, ...posts]));
          setOpen(false); // Close modal after creating post
          alert("Post Upload Successfully");
        }
     
    } catch (error) {
      console.error("Error creating post:", error.response.data.message);
      toast.error(error.response.data.message || "Error creating post");
    }finally {
      setLoading(false);
    }
  };

  const closeHandler = () => {
    setOpen(false); // Close modal on clicking outside or cancel
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={closeHandler}
    >
      <div
        style={{ width: "50%" }}
        className="bg-white mb-10  h-4/6 rounded-lg shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          className="  flex  items-center w-full h-full p-5 border border-gray-300"
          onSubmit={createPostHandler}
        >
          <div className="h-full w-ful font-bold text-lg mr-5 ">
            <h1
              style={{
                textTransform: "uppercase",
                writingMode: "vertical-lr",
                textOrientation: "upright",
                letterSpacing: "5px",
                fontSize: "15px",
              }}
            >
              Create post
            </h1>
          </div>
          <div
            style={{ width: "500px" }}
            className=" h-full  flex justify-center items-center relative mr-5"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
           
            {/*border-2 border-dashed border-gray-300 */}
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-full object-contain rounded-sm"
              />
            ) : (
              <p className="text-gray-500">Drag & Drop or Click to Upload</p>
            )}
            <input
              type="file"
              required
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <div className="h-full p-2 space-y-5">
            <div className="relative">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                maxLength={500}
              />
              <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white px-2 rounded-full">
                {caption.split(" ").filter((word) => word.length > 0).length}/50
                words
              </div>
            </div>

            <div className="relative">
              <GoTag
                className="absolute top-3 left-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags (comma separated)"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              />
            </div>

            {/* Post Schedule */}
            <div className="relative">
              <CiCalendar
                className="absolute top-3 left-3 text-gray-400"
                size={20}
              />
              <input
                type="datetime-local"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mood */}
              <div className="relative">
                <FaRegFaceSmile
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out appearance-none"
                >
                  <option value="">mood</option>
                  <option value="happy">Happy</option>
                  <option value="sad">Sad</option>
                  <option value="excited">Excited</option>
                  <option value="calm">Calm</option>
                </select>
              </div>

              <div className="relative">
                <RiText
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out appearance-none"
                >
                  <option value="">post type</option>
                  <option value="Both">For All</option>
                  {/* is type ka content sab ko dekha ga */}
                  <option value="18+">Child Lock</option>
                  {/* is type ka content sirf 18+ people ko hi dekha ga */}
                </select>
              </div>

              {/* Visibility */}
              <div className="relative">
                <GoPeople
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out appearance-none"
                >
                  <option value="">visibility</option>
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
            {/* Submit Button */}
            {
            loading ? (
              <p style={{ color: "black", fontSize: "25px" }}>Please wait...</p>
            ):(
              <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out flex items-center justify-center"
            >
              <BsCamera className="mr-2" size={20} />
              Create Post
            </button>)
}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
