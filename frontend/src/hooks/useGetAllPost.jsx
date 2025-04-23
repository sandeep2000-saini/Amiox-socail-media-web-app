import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setPosts } from "../redux/postSlice"

const useGetAllPost = () => {

    const dispatch = useDispatch();
    useEffect(() =>{
        
        const fetchAllPost = async () =>{
            try {
                const res = await axios.get('http://localhost:5000/api/v1/PostImage/getAllPost',
                {
                    withCredentials:true
                })
                if(res.data.success){
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPost();
    },[]);
}

export default useGetAllPost;