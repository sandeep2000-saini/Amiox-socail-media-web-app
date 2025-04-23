import React from "react";
import VerticalVideoDesign from "./verticalVideoDesign";


const VerticalVideos = () => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((item, index) => (
        
        <VerticalVideoDesign key={index} />
      ))}
    </div>
  );
};

export default VerticalVideos;
