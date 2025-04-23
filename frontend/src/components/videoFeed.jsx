import React, { useState } from "react";
import useGetAllVideoPost from "../hooks/useGetAllVideoPost";
import Videos from "../components/videos";
import VideoDetailFeedRightSide from "./videoDetailFeedRightSide";

const VideoFeed = () => {
  useGetAllVideoPost();

  const [selectedVideo, setSelectedVideo] = useState(null); // Selected Video State

  return (
    <div className="flex flex-col lg:flex-row my-10 w-full">
      <div className="flex-1">
        <Videos setSelectedVideo={setSelectedVideo} />
      </div>
      <div className="fixed right-0 top-0 bottom-0 w-1/3 hidden lg:block" >
        <VideoDetailFeedRightSide video={selectedVideo} />
      </div>
    </div>
  );
};

export default VideoFeed;
