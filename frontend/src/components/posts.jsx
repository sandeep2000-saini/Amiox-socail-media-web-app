import React from "react";
import PostDes from "./postDesign.jsx";
import { useSelector } from "react-redux";


const Posts = () => {

    const {posts} = useSelector(store=>store.post);

    return (
        <div className="columns-2 md:columns-3 mt-[30px] gap-4 p-4">
  {posts.map((post) => <div key={post._id} className="break-inside-avoid mb-4 "><PostDes post={post} /></div>)}
</div>
    )
}

export default Posts;