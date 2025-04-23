import React from 'react';
import { useNavigate } from 'react-router-dom';

const navItems = [
    { text: "Post" },
    { text: "Video" },
    { text: "Reel" },
    { text: "Blog" },
];

const FeedLeftNavBar = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = React.useState("Post");

    const sidebarHandler = (textType) => {
        setActiveItem(textType);
        if (textType === "Post") {
            navigate("/feed/post");
        } else if (textType === "Video") {
            navigate("/feed/video");
        } else if (textType === "Reel") {
            navigate("/feed/vertical");
        } else if (textType === "Blog") {
            navigate("/feed/blog");
        }
    }
  return (
    <div className="fixed flex flex-col items-center justify-center  top-0 z-10 left-0 px-4 border-r border-gray-300 w-[5%] h-screen">
        {navItems.map((item, index) => {
          return (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center justify-center gap-3 relative cursor-pointer rounded-lg p-2 my-2"
            >
              <span style={{
                transform: "rotate(180deg)",
                writingMode: "vertical-lr",
                color: activeItem === item.text ? 'black' : 'gray',
                fontWeight: activeItem === item.text ? 'bold' : 'normal'
              }}>{item.text}</span>
            </div>
          );
        })}
      
    </div>
  );
};

export default FeedLeftNavBar;