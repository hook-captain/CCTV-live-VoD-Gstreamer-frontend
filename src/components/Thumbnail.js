import React, { useEffect, useState } from "react";
import { ButtonBase } from "@mui/material";
import { OVER_THUMBNAIL_GROUP, START_TIME_GROUP, GET_SUBTHUMBNAILS_LIST, SET_ENDTIME, GET_SUB_URL, START_CLIPTIME_GROUP, SET_CLIP_CHECK } from "../redux/types";
import { useDispatch, useSelector } from "react-redux";
import { GetVodVideo, selectThumbnail } from "../actions/action";
import "../public/Thumbnail.css";
import line from "../public/line.png";

export default function Thumbnail({ id, thumbnails, selected, url, time, camera_id}) {

  const thumbnail = thumbnails[id]
  const over = useSelector((state) => state.thumbnail.overed);
  const mode = useSelector((state) => state.video.mode);
  const video = useSelector((state) => state.video.video);
  const [sub_URL, setSubURL] = useState('');
  const [startTime, setstartTime] = useState(new Date());
  const [startClipTime, setstartClipTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [sub_Time, setSubTime] = useState('');
  const [arrow, setarrow] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: GET_SUBTHUMBNAILS_LIST, payload: thumbnails });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbnail]);

  useEffect(() => {
    setSubURL(url);
    // dispatch({ type: GET_SUB_URL, payload: url });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    setSubTime(time);
  }, [time]);

  const timeformat = (date) => {
    let Hour, Min, result;
    let time = new Date(date);

    if (time.getMinutes() < 10) Min = `0${time.getMinutes()}`;
    else Min = `${time.getMinutes()}`;

    if (time.getHours() > 12) {
      Hour = `${time.getHours() - 12}:${Min}PM`;
    }
    else {
      if (time.getHours() < 10) {
        Hour = `0${time.getHours()}:${Min}AM`;
      }
      else {
        if (time.getHours() === 12) {
          Hour = `${time.getHours()}:${Min}PM`;
        } else {
          Hour = `${time.getHours()}:${Min}AM`;
        }
      }
    }

    result = `${Hour}`;
    return result;
  };

  const handleMouseover = (e) => {
    let over = e.target.id;
    dispatch({ type: OVER_THUMBNAIL_GROUP, payload: over });
  }

  const getSelectedVodVideo = (id) => {
    if (id) {
      // let end = thumbnails[thumbnails.length - 1][thumbnails[thumbnails.length - 1].length - 2].time
      dispatch({ type: START_TIME_GROUP, payload: startTime });
      dispatch({ type: SET_CLIP_CHECK, payload: 1 });
      dispatch({ type: START_CLIPTIME_GROUP, payload: startClipTime });
      dispatch(GetVodVideo(camera_id, startClipTime, endTime, mode, video));
      dispatch({ type: SET_ENDTIME, payload: endTime });
      dispatch(selectThumbnail(id));
    }
  };

  const handleMouseMove = (e) => {
    let number = Math.floor(
      (e.nativeEvent.offsetX * thumbnail.length) / e.target.width
    );
    if (number < 0)
      number = 0;
    if (number > thumbnail.length - 1)
      number = thumbnail.length - 1;
    let arrow = e.nativeEvent.offsetX / e.target.width * 100;
    let subURL = thumbnail ? thumbnail[number].path : url;
    let subTime = thumbnail ? thumbnail[number].time2str : time;
    let ClipTime = thumbnail ? thumbnail[0].time2str : time;
    setSubURL(subURL);
    dispatch({ type: GET_SUB_URL, payload: subURL });
    setSubTime(subTime);
    setarrow(arrow);
    let startTime = subTime;
    setstartTime(startTime);
    setstartClipTime(ClipTime);
    setEndTime(thumbnail[thumbnail.length - 1].time2str);
  };

  const handleMouseOut = (e) => {
    if (over === e.target.id) {
      let subTime = thumbnails[e.target.id][0].time2str
      setSubTime(subTime);
    }
    setSubURL(url);
  }

  return (
    <ButtonBase
      sx={
        id.toString() === selected.toString()
          ? {
            width: "90%",
            height: 124,
            border: "2px solid rgb(0, 0, 0)",
            marginTop: 1,
            marginLeft: "20%",
          }
          : { width: "90%", height: 124, marginTop: 1, marginLeft: "20%" }
      }
    >

      <div className="thumbnail">
        <li onMouseLeave={(e) => handleMouseOut(e)}>
          <img
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseOver={(e) => handleMouseover(e)}
            id={id}
            alt="alt"
            prop="prop"
            src={sub_URL}
            width="100%"
            height={120}
          />
          <span className="large">
            <img className="large-image"
              onMouseMove={(e) => handleMouseMove(e)}
              onMouseOver={(e) => handleMouseover(e)}
              id={id}
              alt="alt"
              prop="prop"
              src={sub_URL}
              width="110%"
              height={150}
            />
          </span>
          <div className="viewline" style={{ marginLeft: `${arrow}%` }}>
            <img
              src={line}
              alt="img"
              id={id}
              prop="prop"
              style={
                over.toString() !== id.toString()
                  ? { display: "none" }
                  : { display: "" }
              }
              height={120}
              onClick={(e) => getSelectedVodVideo(e.target.id)}
              onMouseLeave={(e) => handleMouseOut(e)}
            />
          </div>
          {id.toString() === selected.toString() ? (
            <div className="viewtag" style={{ marginTop: "8%" }}>
              ▶️Viewing
            </div>
          ) : (
            <></>
          )}
          <div
            className="viewtime"
            style={{ marginTop: "8%", marginLeft: "60%" }}
          >
            {timeformat(sub_Time)}
          </div>
        </li>
      </div>
    </ButtonBase>
  );
}
