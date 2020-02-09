import { combineReducers } from "redux";
import camera from './camera'
import thumbnail from "./thumbnail";

export default combineReducers({
    camera: camera,
    thumbnail: thumbnail
})