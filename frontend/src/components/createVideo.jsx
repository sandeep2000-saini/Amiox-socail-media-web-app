import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import ShortVideoUpload from "./shortVideoUpload";
import LongVideoUpload from "./longVideoUpload";
import { FaArrowLeft } from "react-icons/fa6";

function CreateVideo({ open, setOpen }) {
  const [videoType, setVideoType] = useState(null); // Add state for video type

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal") {
      setOpen(false);
    }
  };

  const handleBack = () => {
    setVideoType(null); // Reset video type to go back to selection
  };

  if (!open) return null;

  return (
    <div className="modal" onClick={handleOutsideClick} style={modalStyle}>
      <div
        className="modal-content"
        style={modalContentStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <form className="flex">
          <div className="h-full font-bold text-lg mr-5 ">
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
          <div className="flex flex-col w-full">
            <div className="flex flex-col items-center ">
              <div className="flex justify-between items-center w-full mb-4">
                {videoType && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-[#7E047A] font-bold flex items-center gap-1"
                  >
                    <FaArrowLeft /> Back
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-[#7E047A]">
                  <IoClose size={24} />
                </button>
              </div>
              <span className="font-bold text-[25px] mb-4">
                {videoType ? "Upload Video" : "Select Video type"}
              </span>
            </div>
            {!videoType && (
              <div className="flex justify-center items-center h-full w-full gap-5">
                <button
                  type="button"
                  className="text-[#7E047A] bg-[#FCC7FA] w-[115px] h-[40px] rounded-[5px] font-bold shadow-md hover:bg-[#e0b3e0] transition duration-300"
                  onClick={() => setVideoType("long")}
                >
                  Long Video
                </button>
                <button
                  type="button"
                  className="text-[#7E047A] bg-[#FCC7FA] w-[115px] h-[40px] rounded-[5px] font-bold shadow-md hover:bg-[#e0b3e0] transition duration-300"
                  onClick={() => setVideoType("short")}
                >
                  Short Video
                </button>
              </div>
            )}
            {videoType === "long" && <LongVideoUpload setOpen={setOpen} />} {/* Conditionally render LongVideoUpload */}
            {videoType === "short" && <ShortVideoUpload  setOpen={setOpen} />} {/* Conditionally render ShortVideoUpload */}
          </div>
        </form>
      </div>
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  width: "auto",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

export default CreateVideo;
