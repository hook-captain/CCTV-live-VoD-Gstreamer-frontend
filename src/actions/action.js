import axios from "axios";
import {
  GET_CAMERA_LIST,
  GET_THUMBNAIL_LIST,
  SET_CAMERA_SELECT,
  VIDEO_VOD_MODE,
  VIDEO_LIVE_MODE,
  SELECT_THUMBNAIL_GROUP,
  GET_SEARCH_TIME,
  GET_LIVE_URL,
  GET_CAMERA_ONLINE_STATUS,
  POLYGON_GET_MODE,
} from "../redux/types";

export const createPolygons =
  (camera_id, name, desc, position) => (dispatch) => {
    let data = {
      camera_id: camera_id,
      name: name,
      desc: desc,
      position: position,
    };
    axios.post(`/api/polygons`, data).then((res) => {
      dispatch(getPolygons(camera_id));
    });
  };

export const updatePolygons =
  (camera_id, desc, position) => {
    let data = {
      desc: desc,
      position: position
    };
    axios.put(`/api/polygons/${camera_id}`, data).then((res) => {
      
    });
};

export const deletePolygons =
  (camera_id) => {
    axios.delete(`/api/polygons/${camera_id}`).then((res) => {
      
    });
  };

export const getPolygons = (camera_id) => (dispatch) => {
  axios.get(`/api/polygons/${camera_id}`).then((res) => {
    let polygons = {};
    let points = [],
      point = [];

    let data = [];
    let key = 0;

    res.data.map(async (item) => {
      Promise.all(
        item.position.split(",").map(async (item1) => {
          point.push(Number.parseFloat(item1));
          key++;
          if (key === 2) {
            points.push(point);
            point = [];
            key = 0;
          }
        })
      );
      polygons.points = points;
      polygons.desc = item.desc;
      polygons.id = item.id;
      data.push(polygons);
      polygons = {};
      points = [];
    });
    dispatch({ type: POLYGON_GET_MODE, payload: data });
  });
};

export const getCameras = (keyword, start, end, mode, video) => (dispatch) => {
  keyword === ""
    ? axios.get(`/api/cameras`).then((res) => {
        dispatch({ type: GET_CAMERA_LIST, payload: res.data });
        dispatch(getThumbnail(res.data[0].id, start, end, 5, mode, video));
      })
    : axios.get(`/api/cameras/search/${keyword}`).then((res) => {
        dispatch({ type: GET_CAMERA_LIST, payload: res.data });
        if (res.data[0]) {
          dispatch(getThumbnail(res.data[0].id, start, end, 5, mode, video));
        }
      });
};

export const GetDownloadUrl = async (path) => {
  let url = "";
  await axios.get(`/api/videos/convert/${path}`).then((res) => {
    //dispatch({type: GET_DOWNLOAD_URL, payload: res.data})
    url = res.data;
  });
  return url;
};

export const getCamerasOnline = (id, mode) => (dispatch) => {
  axios.get(`/api/cameras/online/${id}`).then(async (res) => {
    let result1 = res.data[0];
    let result2 = res.data[1];
    dispatch({
      type: GET_CAMERA_ONLINE_STATUS,
      payload: { ...result1, ...result2 },
    });
    if (res.data[0].flag === "NO") {
      dispatch({ type: GET_LIVE_URL, payload: `/share/graylist.m3u8` });
    } else {
      await setTimeout(() => {}, 2000);
      dispatch({ type: GET_LIVE_URL, payload: `/share/${id}/playlist.m3u8` });
    }
  });
};

export const setCamera = (obj) => (dispatch) => {
  dispatch({ type: SET_CAMERA_SELECT, payload: obj });
};

export const GetVodVideo = (ID, start, end, mode, video) => (dispatch) => {
  let url = "none";
  if (typeof video === "string") {
    url = video.replaceAll("/", "*");
  }
  axios
    .get(`/api/videos/play/${ID}/${start}/${end}/${mode}/${url}`)
    .then((res) => {
      dispatch({ type: VIDEO_VOD_MODE, payload: res.data });
    });
};

export const selectThumbnail = (id) => (dispatch) => {
  dispatch({ type: SELECT_THUMBNAIL_GROUP, payload: id });
};

export const GetLiveVideo = (ID, mode, video) => (dispatch) => {
  let url = "none";
  if (typeof video === "string") {
    url = video.replaceAll("/", "*");
  }
  axios.get(`/api/cameras/${ID}/${mode}/${url}`).then((res) => {
    dispatch({ type: VIDEO_LIVE_MODE, payload: `/share/${ID}/playlist.m3u8` });
  });
};

export const getThumbnail =
  (cameraid, starttime, endtime, duration, mode, video) => (dispatch) => {
    let count = 0;
    let url = "none";
    if (typeof video === "string") {
      url = video.replaceAll("/", "*");
    }
    setInterval(() => {
      count++;
    }, 1);
    axios
      .get(
        `/api/thumbnails/${cameraid}/${starttime}/${endtime}/${duration}/${mode}/${url}`
      )
      .then((res) => {
        if (res.data.length > 0) {
          let first, initTime;
          if (duration === 60) {
            initTime =
              parseInt(
                new Date(res.data[0].time2str).getTime() /
                  (duration * 60 * 1000)
              ) *
              duration *
              60 *
              1000;
            if (new Date(initTime).getMinutes() === 30) {
              initTime = initTime - 30 * 60 * 1000;
            }
            first = initTime;
          } else {
            initTime =
              parseInt(
                new Date(res.data[0].time2str).getTime() /
                  (duration * 60 * 1000)
              ) *
              duration *
              60 *
              1000;
            first = initTime;
          }
          let thumbnails = [],
            sub_Thumbnails = [];
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
