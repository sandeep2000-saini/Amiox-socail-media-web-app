import React, { useState } from "react";

const BlogDetailScreen = () => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleComment = () => {
    if (comment) {
      setComments([...comments, { username: "User", content: comment }]);
      setComment("");
    }
  };

  return (
    <div className="px-[200px]">
      <div className="flex flex-col items-center mt-[60px]">
        <div className="w-[850px] h-[450px] relative ml-[300px]">
          <img
            src="https://images.pexels.com/photos/30648463/pexels-photo-30648463/free-photo-of-stunning-scottish-highlands-mountain-and-valley-view.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-40">
            <div className="w-[500px] ml-[-1000px] flex flex-col justify-center items-center">
              {/* <div className="w-full">
                <span className=" text-[18px] font-bold mt-2">
                  March 18, 2025
                </span>
              </div> */}
              <span className=" text-[50px] font-bold mt-2">
                Pure Earth's Pollution Blog puts the spotlight on one of the
                biggest.
              </span>
              <div className="w-full">
                <span className=" text-[14px] text-gray-400 font-semibold ">
                  March 18, 2025
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-[100px]">
        <div className=" w-[300px]">
          <div className="flex flex-col">
            <div className="w-[85px] h-[85px] rounded-[50px] mb-[20px]">
              <img
                src="https://i.pinimg.com/474x/3f/dd/e4/3fdde421b22a34874e9be56a4277e04c.jpg"
                alt="profile pic"
                className="rounded-[50px]"
              />
            </div>
            <span className="text-[25px] font-bold uppercase">
              Sandeep saini
            </span>
            <span className="text-[15px] font-medium text-gray-500">
              sandeep_saini_00
            </span>
            <div className=" flex items-center gap-2 border-t-2 border-gray-500 w-[250px] mt-[20px] py-[5px]">
              <p>Like</p>
              <p>Comment</p>
              <p>share</p>
            </div>
          </div>
        </div>
        <div className="w-[600px]">
          <p style={{ fontSize: "17px" }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda
            illo natus sit ducimus corrupti dolorem soluta officia! Quidem,
            aperiam odit ut facere numquam illum ullam! Amet harum iusto in
            error!
          </p>
          <br />
          <p style={{ fontSize: "17px" }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda
            illo natus sit ducimus corrupti dolorem soluta officia! Quidem,
            aperiam odit ut facere numquam illum ullam! Amet harum iusto in
            error!
          </p>
          <br />
          <p style={{ fontSize: "17px" }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda
            illo natus sit ducimus corrupti dolorem soluta officia! Quidem,
            aperiam odit ut facere numquam illum ullam! Amet harum iusto in
            error!
          </p>
          <br />
          <p style={{ fontSize: "17px" }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda
            illo natus sit ducimus corrupti dolorem soluta officia! Quidem,
            aperiam odit ut facere numquam illum ullam! Amet harum iusto in
            error!
          </p>
          <br />
          <p style={{ fontSize: "17px" }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda
            illo natus sit ducimus corrupti dolorem soluta officia! Quidem,
            aperiam odit ut facere numquam illum ullam! Amet harum iusto in
            error!
          </p>
          <br />
          <p style={{ fontSize: "17px" }}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda
            illo natus sit ducimus corrupti dolorem soluta officia! Quidem,
            aperiam odit ut facere numquam illum ullam! Amet harum iusto in
            error!
          </p>
        </div>
      </div>

      <div className="flex flex-col mt-[100px] ">
          <span className="text-[45px] font-bold mb-[-18px]">200</span>
          <span>Comments</span>
        </div>

      <div className="border-t-2 border-gray-300 mt-[20px]">
        <div className="flex gap-2 w-full mt-[20px]">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className=" w-[800px] bg-transparent p-[10px] rounded-md focus:outline-none"
          />
          {comment && (
            <button
              onClick={handleComment}
              className=" bg-blue-500 text-white p-[10px] rounded-md"
            >
              Comment
            </button>
          )}
        </div>
        <div className="mt-[20px] h-[400px] overflow-y-scroll  border-gray-300 pt-[10px]">
          {comments.map((c, index) => (
            <div key={index} className="mb-[10px] flex items-start gap-2">
              <img
                src="https://i.pinimg.com/474x/3f/dd/e4/3fdde421b22a34874e9be56a4277e04c.jpg"
                alt="profile pic"
                className="w-[30px] h-[30px] rounded-full"
              />
              <div>
                <span className="text-[14px] font-bold">{c.username}</span>
                <p className="text-[14px] text-gray-700">{c.content}</p>
                <div className="flex gap-2 text-[12px] text-gray-500">
                  <span>Like</span>
                  <span>Reply</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailScreen;
