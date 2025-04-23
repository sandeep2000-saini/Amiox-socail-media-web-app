import { createSlice } from "@reduxjs/toolkit";

const postVideoSlice =createSlice({
    name:'videoPost',
    initialState:{
        videoPosts:[],
    },
    reducers:{
        //action
        setVideoPosts:(state,action) => {
            state.videoPosts = action.payload;
        },
        
    }

});

export const {setVideoPosts} = postVideoSlice.actions;
export default postVideoSlice.reducer;