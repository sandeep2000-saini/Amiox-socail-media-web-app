import React, { useRef, useState } from "react";
import VideoDesign from "./videoDesign";
import { useSelector } from "react-redux";

const Videos = ({ setSelectedVideo }) => {
  const { videoPosts } = useSelector((store) => store.videoPost);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const activeVideoRef = useRef(null); // 🔥 Global reference for playing video

  const handleSelect = (id, videoRef) => {
    // Pause the currently active video
    if (activeVideoRef.current && activeVideoRef.current !== videoRef) {
      activeVideoRef.current.pause();
    }

    // Update selected video ID and reference
    setSelectedVideoId(id);
    setSelectedVideo(videoPosts.find((post) => post._id === id));
    activeVideoRef.current = videoRef;

    // Play the new video
    if (videoRef) {
      videoRef.play();
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 max-w-4xl ">
      {videoPosts.map((post) => (
        <VideoDesign
          key={post._id}
          post={post}
          isSelected={selectedVideoId === post._id}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};

export default Videos;
