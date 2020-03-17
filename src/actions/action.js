import axios from "axios";
import {
  GET_CAMERA_LIST,
  GET_THUMBNAIL_LIST,
  SET_CAMERA_SELECT,
  VIDEO_VOD_MODE,
  VIDEO_LIVE_MODE,
  SELECT_THUMBNAIL_GROUP,
  GET_SEARCH_TIME,
  GET_CAMERA_ONLINE_STATUS,
} from "../redux/types";

export const getCameras = (keyword, start, end) => (dispatch) => {
  keyword === ""
    ? axios.get(`/api/cameras`).then((res) => {
      dispatch({ type: GET_CAMERA_LIST, payload: res.data });
      dispatch(getThumbnail(res.data[0].id, start, end, 5));
    })
    : axios.get(`/api/cameras/search/${keyword}`).then((res) => {
      dispatch({ type: GET_CAMERA_LIST, payload: res.data });
      if (res.data[0]) {
        dispatch(getThumbnail(res.data[0].id, start, end, 5));
      }
    });
};

export const getCamerasOnline = (id) => (dispatch) => {
    axios.get(`/api/cameras/online/${id}`).then((res) => {
      dispatch({ type: GET_CAMERA_ONLINE_STATUS, payload: res.data });
      if (res.data.flag === "NO"){
        dispatch({type: VIDEO_LIVE_MODE, payload: `/share/graylist.m3u8`})
      } else {
        setTimeout(()=>{dispatch({type: VIDEO_LIVE_MODE, payload: `/share/${id}/playlist.m3u8`})}, 2000)
      }
    })
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
  // axios.get(`/api/cameras/${ID}`).then((res) => {
  //   dispatch({ type: VIDEO_LIVE_MODE, payload: res.data });
  // });
  dispatch({type: VIDEO_LIVE_MODE, payload: `/share/${ID}/playlist.m3u8`})
};

export const getThumbnail =
  (cameraid, starttime, endtime, duration) => (dispatch) => {
    let count = 0;
    setInterval(() => { count++ }, 1)
    axios
      .get(`/api/thumbnails/${cameraid}/${starttime}/${endtime}/${duration}`)
      .then((res) => {
        if (res.data.length > 0) {
          let first, initTime;
          if (duration === 60){
            initTime = parseInt(new Date(res.data[0].time2str).getTime() / (duration * 60 * 1000)) * duration * 60 * 1000;
            if(new Date(initTime).getMinutes() === 30){
              initTime = initTime - 30*60*1000;
            }
            first = initTime;
          }else{
            initTime = parseInt(new Date(res.data[0].time2str).getTime() / (duration * 60 * 1000)) * duration * 60 * 1000;
            first = initTime;
          }
          let thumbnails = [], sub_Thumbnails = [];
          let _duration = duration * 60;
          let flag = 0;
          Promise.all(
            res.data.map(async (item) => {
              let second = new Date(item.time2str).getTime();
              if ((second - first) / 1000 < _duration) {
                if (item.path.indexOf("gray") < 0) {
                  flag = 1;
                }
                sub_Thumbnails.push(item);
              } else {
                first = first + _duration * 1000;
                if (flag === 1) {
                  thumbnails.push(sub_Thumbnails);
                }
                flag = 0;
                sub_Thumbnails = [];
                sub_Thumbnails.push(item);
              }
            })
          );
          if (flag === 1) {
            thumbnails.push(sub_Thumbnails);
          }
          dispatch({ type: GET_THUMBNAIL_LIST, payload: thumbnails });
          dispatch({ type: VIDEO_VOD_MODE, payload: {} });
        } else {
          dispatch({ type: GET_THUMBNAIL_LIST, payload: [] });
          dispatch({ type: VIDEO_VOD_MODE, payload: {} });
        }
        dispatch({ type: GET_SEARCH_TIME, payload: count / 1000 });
      });
  };
