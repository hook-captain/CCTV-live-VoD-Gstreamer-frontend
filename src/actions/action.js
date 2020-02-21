import axios from "axios";
import {
  GET_CAMERA_LIST,
  GET_THUMBNAIL_LIST,
  SET_CAMERA_SELECT,
  VIDEO_LIVE_MODE,
  VIDEO_VOD_MODE,
  SELECT_THUMBNAIL_GROUP,
} from "../redux/types";

export const getCameras = (keyword) => (dispatch) => {
  keyword === ""
    ? axios.get(`/api/cameras`).then((res) => {
      dispatch({ type: GET_CAMERA_LIST, payload: res.data });
      dispatch({ type: VIDEO_LIVE_MODE, payload: res.data[0] });
    })
    : axios.get(`/api/cameras/search/${keyword}`).then((res) => {
      dispatch({ type: GET_CAMERA_LIST, payload: res.data });
    });
};

export const setCamera = (obj) => (dispatch) => {
  dispatch({ type: SET_CAMERA_SELECT, payload: obj });
};

export const GetVodVideo = (ID, start, end) => (dispatch) => {
  axios.get(`/api/videos/play/${ID}/${start}/${end}`).then((res) => {
    dispatch({ type: VIDEO_VOD_MODE, payload: res.data });
  });
};

export const selectThumbnail = (id) => (dispatch) => {
  dispatch({ type: SELECT_THUMBNAIL_GROUP, payload: id });
};

export const GetLiveVideo = (ID) => (dispatch) => {
  axios.get(`/api/cameras/${ID}`).then((res) => {
    dispatch({ type: VIDEO_LIVE_MODE, payload: res.data });
  });
};

export const getThumbnail =
  (cameraid, starttime, endtime, duration) => (dispatch) => {
    axios
      .get(`/api/thumbnails/${cameraid}/${starttime}/${endtime}/${duration}`)
      .then((res) => {
        if (res.data.length > 0) {
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
          dispatch({ type: VIDEO_VOD_MODE, payload: {} });
        } else {
          dispatch({ type: GET_THUMBNAIL_LIST, payload: [] });
          dispatch({ type: VIDEO_VOD_MODE, payload: {} });
        }
      });
  };
