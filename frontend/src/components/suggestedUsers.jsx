import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector(store => store.auth);
  return (
    <div >
      <div>
        <h3 className="font-bold text-black-600 mb-2">Suggestion</h3>
        {
        suggestedUsers.map((user) => {
          return (
            <div key={user._id} className="flex justify-between gap- items-center">
              <div className="flex my-1  gap-5">
                <Link to={`/profile/${user?._id}`}>
                <div className="flex items-center gap-1">
                  <img
                    src={user?.backgroundImage}
                    alt={user?.userID}
                    className="w-12 h-12 rounded-full bg-gray-500"
                  />
                  <div className="flex flex-col ml-2 ">
                  <span className="font-semibold text-sm">{user?.userID}</span>
                  <span className="text-gray-600 text-sm text-left ">{user?.fullname}</span>
                  </div>
                  </div>
                </Link>
              </div>
              <button class="text-white bg-[#24292F] hover:bg-[#24292F]/90  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  dark:hover:bg-[#050708]/30 me-2 mb-2 ml-12">Collect</button>
            </div>
          );
        })
        }
        <span className="font-normal text-xs text-gray-500 cursor-pointer">
          See All
        </span>
      </div>
    </div>
  );
};

export default SuggestedUsers;
