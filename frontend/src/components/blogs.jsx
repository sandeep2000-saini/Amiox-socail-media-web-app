import React from 'react'
import BlogDesign from './blogDesign.jsx'

const Blogs = () => {
  return (
    <div>
        {
            [1,2,3,4,5].map((item, index) =>( <BlogDesign key={index}/>))
        }
    </div>
  )
}

export default Blogs