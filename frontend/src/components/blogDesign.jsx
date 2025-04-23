import React from 'react'
import { Bookmark, Share2 } from "lucide-react";

const BlogDesign = ({ onClick }) => {
  return (
    <div onClick={onClick} className="border rounded-md w-[450px] h-[500px] bg-white shadow-md mb-[30px] cursor-pointer">
      {/* Image Section */}
      <div className='' >
        <img
          src="https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
          alt="Top 50 underrated plants for house decoration"
          className="w-full h-50 object-cover"
          style={{borderRadius:"6px 6px 0 0 "}}
        />
      </div>
      <div className='p-4'>
      {/* Badge
      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">Decorations</span> */}
      
      {/* Title */}
      <h2 className=" text-lg mt-2">Top 50 underrated plants for house decoration</h2>
      
      {/* Author Section */}
      <div className="flex items-center gap-3 mt-4">
        <img
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
          alt="Author Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-medium">Elsa Gardenowl</p>
          <p className="text-xs text-gray-500">Posted 34 minutes ago</p>
        </div>
      </div>  
      
      {/* Footer Section */}
      <div className="flex justify-between items-center border-t mt-4 pt-3">
        <p className="text-xs text-gray-500">733 people liked this</p>
        <div className="flex gap-3">
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Bookmark className="w-5 h-5 text-yellow-500" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Share2 className="w-5 h-5 text-blue-500" />
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default BlogDesign