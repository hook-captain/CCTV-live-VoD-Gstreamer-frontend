import { GET_THUMBNAIL_LIST } from "../types";

const initialState = {
  thumbnail: {},
  thumbnails: [],
};

const thumbnail = (state = initialState, action) => {
  switch (action.type) {
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
