import React from "react";
import Posts from "../components/posts";
import Videos from "./videos";
import VerticalVideos from "./verticalVideos";

import BlogDesign from "./blogDesign";
import { motion } from "framer-motion";

const FeedCenter = ({ activeComponent, onBlogClick }) => {
  return (
    <div className="flex-1 my-10 flex flex-col items-center ">
      {activeComponent === "post" ? <Posts /> : activeComponent === "video" ? <Videos /> : null}
      {activeComponent === "verticalVideo" && <VerticalVideos />}
      {activeComponent === "blog" && <BlogDesign onClick={onBlogClick} />}
    </div>
  );
};

export default FeedCenter;
