import axios from "axios";
import { GET_CAMERA_LIST, GET_THUMBNAIL_LIST } from "../redux/types";

export const getCameras = () => (dispatch) => {
  axios.get("/api/cameras").then((res) => {
    dispatch({ type: GET_CAMERA_LIST, payload: res.data });
  });
};

export const getThumbnail =
  (cameraid, starttime, endtime, duration) => (dispatch) => {
    axios
      .get(`/api/thumbnails/${cameraid}/${starttime}/${endtime}/${duration}`)
      .then((res) => {
        let first = new Date(res.data[0].time);
        let thumbnails = [],
          sub_Thumbnails = [];
        let _duration = duration * 60;
        Promise.all(
          res.data.map(async (item) => {
            let second = new Date(item.time);
            if ((second - first) / 1000 <= _duration) {
              sub_Thumbnails.push(item);
            } else {
              first = second;
              thumbnails.push(sub_Thumbnails);
              sub_Thumbnails = [];
              sub_Thumbnails.push(item);
            }
          })
        );
        thumbnails.push(sub_Thumbnails);
        dispatch({ type: GET_THUMBNAIL_LIST, payload: thumbnails });
      });
  };
