import { GET_THUMBNAIL_LIST, SELECT_THUMBNAIL_GROUP, OVER_THUMBNAIL_GROUP, START_TIME_GROUP, GET_SUBTHUMBNAILS_LIST, SET_ENDTIME } from "../types";

const initialState = {
  selected: 0,
  overed: -1,
  startTime: 0,
  endTime: 0,
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
    case START_TIME_GROUP:
      return {
        ...state,
        startTime: action.payload
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
