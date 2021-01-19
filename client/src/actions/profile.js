import axios from 'axios';
import { getCookie} from '../components/Auth/helpers';
import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR ,CLEAR_PROFILE,UPDATE_PROFILE,USERPOSTS,UPDATE_LIKES,UPDATE_COMMENTS,SINGLE_PROFILE,SINGLE_POSTS,FOLLOW,ALL_PROFILES,FILTER_CONTACTS,CLEAR_FILTER} from './types';

// get current user profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const token = getCookie('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get('/api/profile/me', config);
    dispatch({type:GET_PROFILE,payload:res.data})
  } catch (error) {
    dispatch({type:PROFILE_ERROR,payload:{msg:error.response.data.msg}})
  }
};

export const getSingleProfile = (id) => async (dispatch) => {

  try {
    const token = getCookie('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`/api/profile/user/${id}`, config);
    dispatch({type:SINGLE_PROFILE,payload:res.data})
  } catch (error) {
    dispatch({type:PROFILE_ERROR,payload:{msg:error.response.data.msg}})
  }

}

export const getSingleUserPosts = (id) =>async (dispatch) => {
  try {
    const token = getCookie('token');
    const res= await axios.get(`/api/post/u/${id}`,{ headers: {   
      Authorization: `Bearer ${token}`
    }})
    dispatch({type:SINGLE_POSTS,payload:res.data}) 
  } catch (error) {
    console.log(error);
    
  }
}

export const clearProf = () => async (dispatch) => {
 dispatch({type:CLEAR_PROFILE})
};

export const editProfile=(formData,history) => async (dispatch) => {
  try {
    const token = getCookie('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
    console.log(formData)
    await axios.post('/api/profile',formData, config);
    dispatch(setAlert('Profile updated','success'))
    history.push('/profile')
    
  } catch (error) {
    dispatch({type:PROFILE_ERROR,payload:{msg:error.response.data.msg}})
  }
}

export const allUserPosts =() => async(dispatch) =>{
  try {
    const token = getCookie('token');
    const res= await axios.get('/api/post',{ headers: {   
      Authorization: `Bearer ${token}`
    }})
    dispatch({type:USERPOSTS,payload:res.data}) 
  } catch (error) {
    console.log(error);
    
  }

}


export const deletePost = (params,history) => async(dispatch) =>{
  try {
    const token = getCookie('token');
    const res= await axios.delete(`/api/post/${params}`,{ headers: {   
      Authorization: `Bearer ${token}`
    }})
    history.push('/profile')
    dispatch({type:USERPOSTS,payload:res.data.pos})
    
    dispatch(setAlert('Post deleted','success'))

  } catch (error) {
    console.log(error)
    
  }
}

export const allPosts =() => async (dispatch) => {
  try {
    const token = getCookie('token');
    const res= await axios.get('/api/post/all',{ headers: {   
      Authorization: `Bearer ${token}`
    }})
    dispatch({type:UPDATE_PROFILE,payload:res.data}) 
  } catch (error) {
    console.log(error);
    
  }
}


export const likePost = (id) => async (dispatch) => {
  try {
    const token = getCookie('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
    const res = await axios.put(`/api/post/like/${id}`,token,config);  
    dispatch({type:UPDATE_LIKES,payload:{id,likes:res.data}})

  } catch (error) {
    console.log(error)
  }
}

export const unlikePost = (id) => async (dispatch) => {
  try {
    const token = getCookie('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
    const res = await axios.put(`/api/post/unlike/${id}`,token,config);  
    dispatch({type:UPDATE_LIKES,payload:{id,likes:res.data}})

  } catch (error) {
    console.log(error)
  }
}

export const commentPost=(id,comment) => async (dispatch)=>{
  try {
    const token = getCookie('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
    const res = await axios.post(`/api/post/comment/${id}`,comment,config);  
    dispatch({type:UPDATE_COMMENTS,payload:{id,comments:res.data}})

  } catch (error) {
    console.log(error)
  }
}


export const followUser = (id1) => async (dispatch) => {
  try {
    const token = getCookie('token');
    const id = {
      followId:id1
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
    const res = await axios.put(`/api/profile/follow`,id,config);  
    console.log(res)
    dispatch({type:FOLLOW,payload:{id1:id1,follower:res.data.follower,following:res.data.following}})
  

  } catch (error) {
    console.log(error)
  }
}


export const unfollowUser = (id1) => async (dispatch) => {
  console.log(id1)
  try {
    const token = getCookie('token');
    const id = {
      followId:id1
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
    const res = await axios.put(`/api/profile/unfollow`,id,config);  
    console.log(res)
    dispatch({type:FOLLOW,payload:{id1:id1,follower:res.data.follower,following:res.data.following}})
  

  } catch (error) {
    console.log(error)
  }
}


export const allProfiles = () =>async (dispatch) => {
  try {
    const token = getCookie('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`/api/profile/all`, config);
    dispatch({type:ALL_PROFILES,payload:res.data})
  } catch (error) {
    dispatch({type:PROFILE_ERROR,payload:{msg:error.response.data.msg}})
  }

}


export const filterContacts = (text) =>async (dispatch) => {
  dispatch({type:FILTER_CONTACTS,payload: text})
}

export const clearFilter = () =>async (dispatch) => {
  dispatch({type:CLEAR_FILTER})
}