import axios from "axios";
import { useDispatch } from "react-redux";
import { setVideoPosts } from "../redux/videoSlice";
import { useEffect } from "react";

const useGetAllVideoPost = () => {

    const dispatch = useDispatch();
    useEffect(() =>{
        
        const fetchAllVideoPost = async () =>{
            try {
                const res = await axios.get('http://localhost:5000/api/v1/postVideo/getAllVideoPost',
                {
                    withCredentials:true
                })
                if(res.data.success){
                    dispatch(setVideoPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllVideoPost();
    },[dispatch]);
}

export default useGetAllVideoPost;