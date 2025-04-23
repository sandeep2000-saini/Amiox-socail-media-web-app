import React, { useRef, useState } from "react";
import "./UserFlipCard.css";

const UserFlipCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="flex justify-center items-center mt-[-250px]"
      onClick={handleClick}
    >
      <div
        className={`flip-card w-[200px] h-[300px] rounded-lg shadow-lg ${
          isFlipped ? "flipped" : ""
        }`}
      >
        <div className="flip-card-front w-full h-full rounded-lg ">
          <div className="relative rounded-lg">
            <img
              src="https://i.pinimg.com/236x/f7/3d/ae/f73dae28f83f861b37972ca4be640118.jpg"
              className="rounded-lg object-cover w-full h-full"
            />
            <div
              className="blur-xs rounded-lg"
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                height: "30%",
                background:
                  "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.49) 100%)",
                pointerEvents: "none",
              }}
            >
              <div className="flex flex-col  font-[600px] pl-[15px]">
                <span
                  style={{
                    fontSize: "18px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Sandeep Saini
                </span>
                <span style={{ fontSize: "9px", color: "white" }}>
                  Mern Stack Developer
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flip-card-back w-full h-full rounded-lg flex flex-col  absolute  transform rotateY-180">
          <div>
            <span
              className="text-white"
              style={{
                textTransform: "uppercase",
                writingMode: "vertical-lr",
                letterSpacing: "10px",
                fontSize: "55px",
                marginTop: "10px",
                marginLeft: "-15px",
                fontWeight: "bold",
              }}
            >
              AMIOX
            </span>
          </div>
          <div className="flex justify-center align-end mt-auto mb-1">
            <span style={{ color: "white", fontSize:"9px"}}>sandeep_saini_000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFlipCard;
