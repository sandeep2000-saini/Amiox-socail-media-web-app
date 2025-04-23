import React from 'react'
import SuggestedUsers from './suggestedUsers';
import UsersStory from './usersStory';
import { IoNotifications } from "react-icons/io5";
import { AiFillMessage } from "react-icons/ai";

const FeedRight = () => {
  return (
    <div className='w-fit '>
      <div className='flex mt-[50px] justify-end mb-2 gap-2'>
        <div className='w-auto h-auto bg-[#3c3c3c] text-white p-2 rounded' style={{cursor:"pointer"}}><IoNotifications/></div>
        <div className='w-auto h-auto bg-[#3c3c3c] text-white p-2 rounded' style={{cursor:"pointer"}}><AiFillMessage/></div>
      </div>
      <UsersStory/>
      <SuggestedUsers/>
    </div>
  )
}

export default FeedRight;