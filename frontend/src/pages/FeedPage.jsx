import React, { useState, useEffect } from "react";
import FeedCenter from "../components/feedCenter";
import FeedLeft from "../components/feedLeft";
import useGetAllPost from "../hooks/useGetAllPost";
import FeedRight from "../components/feedRight";
import useGetSuggestedUsers from "../hooks/useGetSuggestedUsers";
import useGetAllVideoPost from "../hooks/useGetAllVideoPost";
import VideoDetailFeedRightSide from "../components/videoDetailFeedRightSide";
import Videos from "../components/videos";
import BlogDetailScreen from "../components/blogDetailScreen";
import {IoMdArrowRoundBack} from "react-icons/io";

const FeedPage = () => {
  const [activeComponent, setActiveComponent] = useState(
    localStorage.getItem("activeComponent") || "post"
  ); // Default "post"

  const [selectedVideo, setSelectedVideo] = useState(null); // Selected Video State
  const [showBlogDetail, setShowBlogDetail] = useState(false); // Blog Detail State

  // Save activeComponent to localStorage
  useEffect(() => {
    localStorage.setItem("activeComponent", activeComponent);
  }, [activeComponent]);

  useGetAllPost();
  useGetAllVideoPost();
  useGetSuggestedUsers();

  const handleBlogClick = () => {
    setShowBlogDetail(true);
  };

  const handleBackClick = () => {
    setShowBlogDetail(false);
  };

  return (
    <>
      <div style={{ display: "flex", padding: "10px" }}>
        {!showBlogDetail && (
          <>
            <div
              style={{
                width: "auto",
                position: "fixed",
                height: "100vh",
                overflow: "auto",
              }}
            >
              <FeedLeft />
            </div>

            <div className="flex-grow" style={{ position: "relative" }}>
              {activeComponent === "video" ? (
                <Videos setSelectedVideo={setSelectedVideo} />
              ) : (
                <FeedCenter activeComponent={activeComponent} onBlogClick={handleBlogClick} />
              )}
            </div>

            <div className="fixed flex gap-2" style={{ left: "13%", top: "5%" }}>
              <button
                onClick={() => setActiveComponent("post")}
                className={` ${
                  activeComponent === "post"
                    ? "text-[19px] text-[#7E047A] border-black "
                    : "text-[#FCC7FA] text-[15px] "
                }`}
              >
                Post
              </button>
              <button
                onClick={() => setActiveComponent("video")}
                className={` ${
                  activeComponent === "video"
                    ? "text-[19px]  text-[#7E047A] "
                    : "text-[#FCC7FA] text-[15px]"
                }`}
              >
                Video
              </button>
              <button
                onClick={() => setActiveComponent("verticalVideo")}
                className={` ${
                  activeComponent === "verticalVideo"
                    ? "text-[19px]  text-[#7E047A] "
                    : "text-[#FCC7FA] text-[15px]"
                }`}
              >
                Reel
              </button>
              <button
                onClick={() => setActiveComponent("blog")}
                className={` ${
                  activeComponent === "blog"
                    ? "text-[19px]  text-[#7E047A] "
                    : "text-[#FCC7FA] text-[15px]"
                }`}
              >
                Blog
              </button>
            </div>

            <div
              style={{
                width: "auto",
                position: "fixed",
                right: 0,
                height: "100vh",
                overflow: "auto",
                marginRight: "20px",
              }}
            >
              {activeComponent === "video" && selectedVideo ? (
                <VideoDetailFeedRightSide video={selectedVideo} />
              ) : (
                <FeedRight />
              )}
            </div>
          </>
        )}
        {showBlogDetail && (
          <div style={{ width: "100%" }}>
            <button onClick={handleBackClick} className="flex items-center justify-center  p-[25px]"><IoMdArrowRoundBack className="text-[20px]"/> Back</button>
            <BlogDetailScreen />
          </div>
        )}
      </div>
    </>
  );
};

export default FeedPage;
