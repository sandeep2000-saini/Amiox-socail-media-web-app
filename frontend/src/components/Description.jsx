import { useState } from "react";

const formatDescription = (dis) => {
  return dis.split("\n").map((line, index) => (
    <span key={index} className="block">
      {line}
    </span>
  ));
};

const Description = ({ text, maxLength = 50 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex flex-col">
      <p className="text-gray-300 text-[12px]">
        {isExpanded ? (
          formatDescription(text)
        ) : (
          <>
            {formatDescription(text.slice(0, maxLength))}
            {text.length > maxLength && (
              <>
                {"... "}
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 text-[10px]">
                  See More
                </button>
              </>
            )}
          </>
        )}
      </p>
      {isExpanded && text.length > maxLength && (
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 text-[10px] mt-2">
          See Less
        </button>
      )}
    </div>
  );
};

export default Description;
