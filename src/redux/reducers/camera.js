import { GET_CAMERA_LIST, SET_CAMERA_SELECT, GET_CAMERA_ONLINE_STATUS } from "../types";

const initialState = {
  camera: {},
  cameraStatus: [],
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
    case GET_CAMERA_ONLINE_STATUS:
      return {
        ...state,
        cameraStatus: action.payload
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
