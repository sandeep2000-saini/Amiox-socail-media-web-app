import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setVideoPosts } from "../redux/videoSlice";

const LongVideoUpload = ({ setOpen }) => {
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [postFor, setPostFor] = useState("Everyone");
  const [schedule, setSchedule] = useState("");
  const [mood, setMood] = useState("Neutral");
  const [visibility, setVisibility] = useState("Public");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useDispatch();
  const videoPosts = useSelector((store) => store.videoPost.videoPosts);

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        if (file.size > 500 * 1024 * 1024) { // 500MB limit
          alert("File size exceeds the 500MB limit.");
          e.target.value = ""; // Reset file input
          return;
        }
        setVideo(file);
        setVideoURL(URL.createObjectURL(file));
      } else {
        alert("Please select a valid video file.");
        e.target.value = ""; // Reset file input
      }
    }
  };

  const handleCancel = (e) => {
    setVideo(null);
    setVideoURL("");
    if (e) e.target.value = ""; // Reset file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) {
      alert("Please select a video before uploading.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("video", video);
    formData.append("videoTitle", title);
    formData.append("videoDescription", description);
    formData.append("tags", tags);
    formData.append("postFor", postFor);
    formData.append("postSchedule", schedule);
    formData.append("mood", mood);
    formData.append("visibility", visibility);

    // Log form data to console
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/postVideo/addVideoNewPost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setVideoPosts([res.data.post, ...videoPosts]));
        alert("Video uploaded successfully!");
        setIsUploading(false);
        setUploadProgress(0);
        setOpen(false); // Close modal after upload
        handleCancel();
      }
    } catch (error) {
      console.error("Upload failed:", error.response?.data?.message || error.message);
alert(`Failed to upload video. ${error.response?.data?.message || error.message}`);

      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg flex gap-6">
      <div className="w-1/2">
        <label className="block mb-4">
          <span className="text-gray-700">Select Video</span>
          <input
            type="file"
            accept="video/*"
            className="mt-2 block w-full"
            onChange={handleVideoChange}
          />
        </label>
        {videoURL && (
          <>
            <video controls className="w-full">
              <source src={videoURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button
              onClick={handleCancel}
              className="mt-2 bg-red-600 text-white p-2 rounded"
            >
              Cancel Selection
            </button>
          </>
        )}
      </div>
      <div className="w-1/2">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Video Title"
            className="w-full p-2 border mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Video Description"
            className="w-full p-2 border mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="w-full p-2 border mb-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <select
            className="w-full p-2 border mb-2"
            value={postFor}
            onChange={(e) => setPostFor(e.target.value)}
          >
            <option>Everyone</option>
            <option>Friends</option>
            <option>Only Me</option>
          </select>
          <input
            type="datetime-local"
            className="w-full p-2 border mb-2"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
          <select
            className="w-full p-2 border mb-2"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option>Neutral</option>
            <option>Happy</option>
            <option>Excited</option>
            <option>Sad</option>
          </select>
          <select
            className="w-full p-2 border mb-4"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option>Public</option>
            <option>Private</option>
            <option>Unlisted</option>
          </select>
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
            disabled={isUploading}
            onClick={handleSubmit}
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LongVideoUpload;
