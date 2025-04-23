import React, { useState } from "react";
import UserFlipCard from "../components/userFlipCard";
import { FiSettings } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import BlurText from "../uiDesign/BlurText.jsx";

const ProfilePage = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile, user } = useSelector((state) => state.auth);

  const isLoggedInUserProfile = user?.id === userProfile?._id;
  const isCollecting = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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

  const formatBio = (bio) => {
    return bio.split("\n").map((line, index) => (
      <span key={index} className="block">
        {line}
      </span>
    ));
  };

  const displayTab =
    activeTab === "posts"
      ? userProfile?.postsImageID
      : activeTab === "collection"
      ? userProfile?.cardCollection
      : userProfile?.postsVideoID;

  return (
    <div>
      <div
        className="relative "
        style={{
          height: "550px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div className="absolute text-black w-full flex justify-between px-8 mt-5">
          <span
            className="font-bold"
            style={{ letterSpacing: "5px", fontSize: "20px" }}
          >
            AMIOX
          </span>
          <span className="text-white">{userProfile?.userID}</span>
        </div>
        <img
          src={userProfile?.backgroundImage}
          alt="Faded Image"
          layout="fill"
          className="w-full h-full object-cover "
          style={{ display: "block" }}
        />

        <div
          className="backdrop-blur-xs"
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "75%",
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgb(251, 243, 253) 100%)",
            pointerEvents: "none",
          }}
        >
          {/* <span
            className="flex justify-center items-center font-bold uppercase "
            style={{ fontSize: "100px", letterSpacing: "9px" }}
          >
            {userProfile?.fullname}
          </span> */}
          <BlurText
            text={userProfile?.fullname}
            delay={150}
            animateBy="letters"
            direction="bottom"
            className="flex justify-center items-center  font-bold uppercase text-[black]  text-[100px] text-opacity-50  "
          />
        </div>
        <div className="absolute justify-center bottom-0 left-0 gap-[200px] right-0 flex items-center  px-8">
          <div className="flex items-center ">
            <UserFlipCard />
            {/* this is a  user personal card design  */}
          </div>
          <div className="flex w-[200px] gap-[50px] mr-[-400px] mb-[80px] ">
            <div>
              <p className="font-medium text-[13px]">Fires</p>
              <span className="text-[20px] font-bold leading-[18px]">
                1.5 B
              </span>
            </div>

            <div>
              <p className="font-medium text-[13px]">Card Keeper</p>
              <span className="text-[20px] font-bold leading-[18px]">150</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center ">
        {isLoggedInUserProfile ? (
          <>
            <span>First, verify your Account</span>
          </>
        ) : isCollecting ? (
          <>
            <button
              style={{
                backgroundColor: "black",
                color: "white",
                width: "100px",
                height: "50px",
                borderRadius: "8px",
                marginRight: "6px",
              }}
            >
              UnCollect
            </button>
            <button
              style={{
                backgroundColor: "black",
                color: "white",
                width: "100px",
                height: "50px",
                borderRadius: "8px",
              }}
            >
              Message
            </button>
          </>
        ) : (
          <button
            style={{
              backgroundColor: "black",
              color: "white",
              width: "100px",
              height: "50px",
              borderRadius: "8px",
              marginRight: "6px",
            }}
          >
            Collect
          </button>
        )}
      </div>

      <div className="flex justify-center items-center my-8">
        <div style={{ width: "550px" }} className="flex justify-center items-center">
          <span  className="whitespace-pre-line">
            {userProfile?.bio ? formatBio(userProfile.bio) : "Bio here..."}
          </span>
        </div>
      </div>

      <div className=" flex mx-[120px]">
        <div className=" ">
          <div className="  flex-col gap-2 flex items-center justify-center">
            <span
              className={`${activeTab === "collection" ? "font-bold" : ""}`}
              style={{
                transform: "rotate(180deg)",
                writingMode: "vertical-lr",
                marginBottom: "15px",
                fontSize: "15px",
                cursor: "pointer",
              }}
              onClick={() => handleTabChange("collection")}
            >
              Collection
              <span
                className="text-[15px] mt-1 font-bold "
                style={{
                  padding: "10px 2px",
                  border: "1px solid #F0F0F0",
                  borderRadius: "5px",
                }}
              >
                {userProfile?.cardCollection.length}
              </span>
            </span>

            <span
              className={`${activeTab === "posts" ? "font-bold" : ""}`}
              style={{
                transform: "rotate(180deg)",
                writingMode: "vertical-lr",
                marginBottom: "15px",
                fontSize: "15px",
                cursor: "pointer",
              }}
              onClick={() => handleTabChange("posts")}
            >
              Post
              <span
                className="text-[15px] mt-1 font-bold "
                style={{
                  padding: "10px 2px",
                  border: "1px solid #F0F0F0",
                  borderRadius: "5px",
                }}
              >
                {userProfile?.postsImageID.length}
              </span>
            </span>

            <span
              className={`${activeTab === "videos" ? "font-bold" : ""}`}
              style={{
                transform: "rotate(180deg)",
                writingMode: "vertical-lr",
                marginBottom: "15px",
                fontSize: "15px",
                cursor: "pointer",
              }}
              onClick={() => handleTabChange("videos")}
            >
              Video
              <span
                className="text-[15px] mt-1 font-bold "
                style={{
                  padding: "10px 2px",
                  border: "1px solid #F0F0F0",
                  borderRadius: "5px",
                }}
              >
                {userProfile?.postsVideoID.length}
              </span>
            </span>
          </div>
          <div className=" mt-[180px]">
            <Link to="/settings">
              <FiSettings />
            </Link>
          </div>
        </div>

        {/* // this is a collection of videos/ post/ collection /mind */}

        <div className="ml-12 px-5 columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {activeTab === "videos"
            ? displayTab.map((postVideo, index) => (
                <div
                  key={postVideo?._id}
                  className="bg-gray-300  rounded-lg overflow-hidden"
                >
                  <div className="w-[300px]">
                    <video
                      src={postVideo?.videoUrl}
                      className="w-full h-full object-cover rounded-lg"
                      controls
                    />
                    </div>
                    <div className="mt-2">
                      <span className="font-bold">NASA Spots Massive Explosion on Moon | Reality Behind It</span>
                      <div className="text-gray-500 text-[12px] mt-[2px]">
                        <span>240K views • {formatDate(postVideo.createdAt)}</span>
                      </div>
                    </div>
                  
                </div>
              ))
            : activeTab === "posts"
            ? displayTab.map((post) => (
                <div
                  key={post?._id}
                  className="bg-gray-300 rounded-lg overflow-hidden break-inside-avoid"
                  
                >
                  <img
                    src={post?.image}
                    alt="Post"
                    className="object-cover w-full h-full transition-transform duration-300 ease-in-out transform hover:scale-105"
                  />
                </div>
              ))
            : [1, 2, 3].map((post, index) => (
                <div
                  key={post}
                  className="bg-gray-300 rounded-lg overflow-hidden"
                  style={{
                    gridRowEnd: `span ${
                      index % 3 === 0 ? 3 : index % 2 === 0 ? 2 : 1
                    }`, // Mosaic layout
                  }}
                >
                  <div className="h-[200px] w-[400px] bg-gray-300 rounded-lg overflow-hidden">
                    <span> card collection</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
