import { VIDEO_LIVE_MODE, VIDEO_VOD_MODE } from "../types";

const initialState = {
  mode: "",
  video: {},
  videos: [],
};

const video = (state = initialState, action) => {
  switch (action.type) {
    case VIDEO_LIVE_MODE:
      return {
        ...state,
        mode: "LIVE",
        video: action.payload,
      };
    case VIDEO_VOD_MODE:
      return {
        ...state,
        mode: "VOD",
        video: action.payload,
      };
    default:
      return state;
  }
};

export default video;
