import { GET_THUMBNAIL_LIST, SELECT_THUMBNAIL_GROUP, OVER_THUMBNAIL_GROUP, START_TIME_GROUP, GET_SUBTHUMBNAILS_LIST, SET_ENDTIME, GET_SEARCH_TIME, GET_SUB_URL, START_CLIPTIME_GROUP } from "../types";

const initialState = {
  selected: 0,
  overed: -1,
  startTime: 0,
  startClipTime: 0,
  endTime: 0,
  searchTime: 0,
  sub_Url: "",
  thumbnail: {},
  thumbnails: [],
  subThumbnails: [],
};

const thumbnail = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_THUMBNAIL_GROUP:
      return {
        ...state,
        selected: action.payload,
      };
    case GET_THUMBNAIL_LIST:
      return {
        ...state,
        thumbnails: action.payload,
      };
    case OVER_THUMBNAIL_GROUP:
      return {
        ...state,
        overed: action.payload
      }
    case GET_SEARCH_TIME:
      return {
        ...state,
        searchTime: action.payload
      }
    case GET_SUB_URL:
      return {
        ...state,
        sub_Url: action.payload
      }
    case START_TIME_GROUP:
      return {
        ...state,
        startTime: action.payload
      }
    case START_CLIPTIME_GROUP:
      return {
        ...state,
        startClipTime: action.payload
      }
    case SET_ENDTIME:
      return {
        ...state,
        endTime: action.payload
      }
    case GET_SUBTHUMBNAILS_LIST:
      return {
        ...state,
        subThumbnails: action.payload
      }
    default:
      return state;
  }
};

export default thumbnail;
