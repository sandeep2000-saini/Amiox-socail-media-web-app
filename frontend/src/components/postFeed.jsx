import React from "react";
import useGetAllPost from "../hooks/useGetAllPost";
import Posts from "../components/posts";
import { useSelector } from "react-redux";
import { IoNotifications } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";

const PostFeed = () => {
  useGetAllPost();

  const { user } = useSelector((store) => store.auth);

  return (
    <>
      <div>
        <div className=" flex flex-col mt-20 ml-20 ">
          <span className="text-[20px] ">Hi,Buddy</span>
          <span
            className="text-[65px] text-gray-500 font-bold uppercase tracking-[3px] leading-[2px] opacity-20"
            style={{ marginLeft: "-40px" }}
          >
            {user?.fullname}
          </span>
        </div>

        <div className="flex-1 w-auto my-10 flex flex-col">
          <Posts />
        </div>
      </div>

      <div className="w-[400px] ">
        <div className="flex mt-[50px] gap-2">
          <div
            className="w-[45px] h-[45px] bg-[#3c3c3c] text-white p-2 rounded items-center"
            style={{ cursor: "pointer" }}
          >
            <IoNotifications className="text-[25px]" />
          </div>
          <div
            className="w-[45px] h-[45px] bg-[#3c3c3c] text-white p-2 rounded"
            style={{ cursor: "pointer" }}
          >
            <AiFillMessage className="text-[25px]" />
          </div>
        </div>
      </div>

      <div className="fixed right-0 top-0 bottom-0  border-l px-4 py-4 border-gray-300 flex flex-col items-center ">
        <span
          className="text-[20px]  font-bold uppercase tracking-[1px] opacity-40"
          style={{ transform: "rotate(180deg)", writingMode: "vertical-lr" }}
        >
          Story
        </span>
        <div className="flex flex-col items-center h-screen justify-center gap-3 ">
          <div className="w-[50px] h-[50px] rounded-[60px] bg-gray-600 relative cursor-pointer"></div>
          <div className="w-[50px] h-[50px] rounded-[60px] bg-gray-600 relative cursor-pointer"></div>
          <div className="w-[50px] h-[50px] rounded-[60px] bg-gray-600 relative cursor-pointer"></div>
          <div className="w-[50px] h-[50px] rounded-[60px] bg-gray-600 relative cursor-pointer"></div>
        </div>
      </div>
    </>
  );
};

export default PostFeed;
