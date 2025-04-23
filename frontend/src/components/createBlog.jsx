import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { readFileAsDataURL } from "../lib/utils";

const CreateBlog = ({ open, setOpen }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setSelectedImage(dataUrl);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setSelectedImage(dataUrl);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log({ title, content, tags, file });
    setOpen(false); // Close modal after submission
  };

  if (!open) return null; // Don't render the component if not open

  const closeHandler = () => {
    setOpen(false); // Close modal on clicking outside or cancel
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 backdrop-blur-sm">
      <div
        className="w-full flex items-end justify-end"
        onClick={closeHandler}
      >
        <IoClose className="text-white text-[24px] mr-[25px] my-[6px]" />
      </div>

      <div
        className="bg-white w-full h-screen shadow-lg flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          className="flex items-center w-full h-full p-5 border border-gray-300"
          onSubmit={handleSubmit}
        >
          <div className="h-full w-ful font-bold text-lg mr-5">
            <h1
              style={{
                textTransform: "uppercase",
                writingMode: "vertical-lr",
                textOrientation: "upright",
                letterSpacing: "5px",
                fontSize: "15px",
              }}
            >
              Create Blog
            </h1>
          </div>

          <div
            style={{ width: "500px" }}
            className="h-full flex justify-center items-center relative mr-5"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/*border-2 border-dashed border-gray-300 */}
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-full object-contain rounded-sm"
              />
            ) : (
              <p className="text-gray-500">Drag & Drop or Click to Upload</p>
            )}
            <input
              type="file"
              required
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex flex-col h-full w-full space-y-4">
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-xl text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              placeholder="Blog Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-60 p-3 mt-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="5"
              required
              style={{ whiteSpace: "pre-wrap" }}
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full  p-3 mt-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-500  p-3 mt-4 text-white border rounded-xl"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
