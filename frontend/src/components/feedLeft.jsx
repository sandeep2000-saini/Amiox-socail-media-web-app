import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FeedLeft = () => {
    const {user} = useSelector(store => store.auth);
    return (<>
        <div  className="mt-[10px]" >
            <span className="px-5  font-bold text-[20px]"style={{letterSpacing:"5px"}}>AMIOX</span>
        </div>
        <div className="flex flex-col ml-8  mt-8">
            <span className="text-xs text-gray-600">HI, Welcome back</span>
            <Link to={`/profile/${user?.id}`}>
            <span className="text-2xl font-bold uppercase ">{user.fullname}</span>
            </Link>
        </div>

        </>
    )
}

export default FeedLeft;