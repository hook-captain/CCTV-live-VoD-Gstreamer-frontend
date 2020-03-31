import { combineReducers } from "redux";
import camera from "./camera";
import thumbnail from "./thumbnail";
import video from "./video";
import polygon from "./polygon";

export default combineReducers({
  camera: camera,
  thumbnail: thumbnail,
  video: video,
  polygon: polygon
});
