import { GET_CAMERA_LIST, SET_CAMERA_SELECT } from "../types";

const initialState = {
  camera: {},
  cameras: [],
};

const camera = (state = initialState, action) => {
  switch (action.type) {
    case GET_CAMERA_LIST:
      return {
        ...state,
        cameras: action.payload,
        camera: action.payload[0]
      };
    case SET_CAMERA_SELECT:
      return {
        ...state,
        camera: action.payload
      }
    default:
      return state;
  }
};

export default camera;
