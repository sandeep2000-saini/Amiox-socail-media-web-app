import React from 'react'
import FeedLeftNavBar from '../components/Navbar/FeedLeftNavBar'
import { Outlet } from 'react-router-dom'

const FeedLayout = () => {
  return (
    <div className="flex">
      <FeedLeftNavBar />
        <div className="flex  w-full ml-[100px]">
        <Outlet/>
        </div>
      </div>
  )
}

export default FeedLayout