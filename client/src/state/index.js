import { createSlice } from "@reduxjs/toolkit";
// reduce action and intial state is being combined by createSlice
// part of redux toolkit to make the syntax easier
//redux -> action and action reducer

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};
// redux has the idea that you cant change this state directly, you always want to 
// replace the object as opposed to directly modifying the state
 // toolkit has this built in libraray called imer


// these essentially will be the state that we will be storing in the global state
// so basically the  se data will be accessible throughout entire application and we can grab it anywhere we want , so that we dont have to pass in state and properties down to different components 

export const authSlice = createSlice({
  name: "auth", // auth workflow 
  initialState,
  // reducers are functions that are involved in modifying the global state 
  reducers: {
    //(state) represents the previous conditions 
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post; // returns the relevant post 
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;


