import { GET_PROFILE, PROFILE_ERROR,CLEAR_PROFILE,UPDATE_PROFILE,USERPOSTS,UPDATE_LIKES ,UPDATE_COMMENTS,SINGLE_PROFILE,SINGLE_POSTS,FOLLOW,ALL_PROFILES,FILTER_CONTACTS,CLEAR_FILTER} from "../actions/types";

const initialState ={
  profile:null,
  singlePosts:null,
  singleprof:null,
  posts:null,
  allP:null,
  profiles:[],
  loading:true,
  error:{},
  filtered:null
}

export default function(state=initialState,action){
  const {type,payload} = action;

  switch(type){


    case FILTER_CONTACTS:
            return { ...state
            ,filtered:state.profiles.filter((prof)=>{
                const regex = new RegExp(`${payload}`,'gi')
                return prof.user.name.match(regex) || prof.user.email.match(regex)
            }) }    
        case CLEAR_FILTER:
            return { ...state,
            filtered:null } 
    case ALL_PROFILES:
      return {
        ...state,
        profiles:payload,
        loading: false
      }
    case GET_PROFILE:
      return {
        ...state,
        profile:payload,
        loading:false
      }
      case SINGLE_PROFILE:
        return { ...state,
          singleprof:payload,
          loading:false
         }
case SINGLE_POSTS:
  return { ...state,
  singlePosts:payload,
loading: false }
    case PROFILE_ERROR:
      return {
        ...state,
        error:payload,
        loading:false
      } 
    case CLEAR_PROFILE:
      return {
        ...state,
        profile:null,
        singlePosts:null,
        singleprof: null,
        posts:null,
        allP:null,
        error:{},
        loading:true
      }  
    case USERPOSTS:
      return { ...state,
      posts:payload,
      loading: false
     }  
     case UPDATE_PROFILE:
       return { ...state,
        allP:payload,
        loading: false
       }
     case UPDATE_LIKES:
       return { ...state,
        allP:state.allP && state.allP.map(post=>post._id ===payload.id?{...post,likes:payload.likes}:post ),
      posts:state.posts && state.posts.map(post=>post._id ===payload.id?{...post,likes:payload.likes}:post ),
      singlePosts:state.singlePosts && state.singlePosts.map(post=>post._id ===payload.id?{...post,likes:payload.likes}:post ),
      loading: false
    }  
    case FOLLOW:
      return { ...state,
        singleprof:state.singleprof.map((p)=>p.user._id ===payload.id1?{...p,follower:payload.follower}:p),
       
        loading: false
      }
    
    case UPDATE_COMMENTS:
      return { ...state,
        allP:state.allP && state.allP.map(post=>post._id ===payload.id?{...post,comments:payload.comments}:post ),
        posts:state.posts && state.posts.map(post=>post._id ===payload.id?{...post,comments:payload.comments}:post ),
        singlePosts:state.singlePosts && state.singlePosts.map(post=>post._id ===payload.id?{...post,comments:payload.comments}:post ),
      loading: false
       }

    default:
      return state;
  }
}