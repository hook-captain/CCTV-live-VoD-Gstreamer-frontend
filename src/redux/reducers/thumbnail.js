import { GET_THUMBNAIL_LIST, SELECT_THUMBNAIL_GROUP } from "../types";

const initialState = {
  selected: -1,
  thumbnail: {},
  thumbnails: [],
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
    default:
      return state;
  }
};

export default thumbnail;
