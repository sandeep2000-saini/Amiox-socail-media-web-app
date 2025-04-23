import React from "react";
import { HiPlus } from "react-icons/hi";

const UsersStory = () => {
  return (
    <>
      <div className="relative ">
        <img
          src="https://i.pinimg.com/236x/57/fd/02/57fd02f833f0c5b906f5032b0f2314dc.jpg"
          alt="user"
          className="w-full h-[130px]  object-cover"
          style={{ borderRadius: "5px 5px 0 0" }}
        />
        <div className="absolute top-0 bottom-0 left-0 right-0 text-white " style={{cursor:"pointer"}}>
          <div className="flex justify-between  w-full h-full">
            <div className="absolute flex items-center justify-between top-0 right-0 b bg-white text-black p-1 mr-4 h-8" style={{ borderRadius: "0 0 4px 4px",cursor:"pointer" }}>
              <HiPlus  />
            </div>
            <div
              className="flex w-[180px] ml-3 mb-2  justify-between items-center  bottom-0"
              style={{ position: "absolute", bottom: "0" }}
            >
              <img
                src="https://i.pinimg.com/474x/1a/e0/f5/1ae0f5af4a0aeab9a5f6793fa856f9f3.jpg"
                alt="userProfile"
                className="h-8 w-8 rounded-full border-2 object-cover"
                style={{cursor:"pointer"}}
              />
              <span className="mb-[-10px]" style={{ fontSize: "10px",cursor:"pointer" }}>
                sandeep_saini_000
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right font-extrabold text-sm">
        <p>STORY</p>
      </div>
    </>
  );
};

export default UsersStory;
