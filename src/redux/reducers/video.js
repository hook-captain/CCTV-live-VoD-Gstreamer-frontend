import { VIDEO_LIVE_MODE, VIDEO_VOD_MODE, GET_LIVE_URL, GET_DOWNLOAD_URL } from "../types";

const initialState = {
  mode: "VOD",
  video: {},
  videos: [],
  downloadUrl: ""
};

const video = (state = initialState, action) => {
  switch (action.type) {
    case VIDEO_LIVE_MODE:
      return {
        ...state,
        mode: "LIVE",
        video: action.payload,
      };
    case GET_LIVE_URL:
      return {
        ...state,
        video: action.payload,
      };
    case VIDEO_VOD_MODE:
      return {
        ...state,
        mode: "VOD",
        video: action.payload,
      };
    case GET_DOWNLOAD_URL:
      return {
        ...state,
        downloadUrl: action.payload,
      };
    default:
      return state;
  }
};

export default video;

