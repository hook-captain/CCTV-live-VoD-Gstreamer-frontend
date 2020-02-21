import React, { useState } from "react";
import { ButtonBase } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import "../public/Thumbnail.css";
import line from "../public/line.png";
import { OVER_THUMBNAIL_GROUP, START_TIME_GROUP } from "../redux/types";
import { GetVodVideo, selectThumbnail } from "../actions/action";

export default function Thumbnail({ id, selected, url, time, camera_id }) {

  const thumbnails = useSelector((state) => state.thumbnail.thumbnails);
  const thumbnail = thumbnails[id]
  const over = useSelector((state) => state.thumbnail.overed);
  const [sub_URL, setSubURL] = useState(url);
  const [startTime, setstartTime] = useState(new Date());
  const [sub_Time, setSubTime] = useState(time);
  const [arrow, setarrow] = useState(0);
  const dispatch = useDispatch();


  const timeformat = (date) => {
    let Hour, Min, Second, result;
    let time = new Date(date);
    if (time.getHours() < 9) Hour = `0${time.getHours()}`;
    else Hour = `${time.getHours()}`;

    if (time.getMinutes() < 9) Min = `0${time.getMinutes()}`;
    else Min = `${time.getMinutes()}`;

    if (time.getSeconds() < 9) Second = `0${time.getSeconds()}`;
    else Second = `${time.getSeconds()}`;

    result = `${Hour}:${Min}:${Second}`;
    return result;
  };


  const handleMouseover = (e) => {
    let over = e.target.id;
    dispatch({ type: OVER_THUMBNAIL_GROUP, payload: over });
  }

  const getSelectedVodVideo = (id) => {
    if (id) {
      let end = thumbnails[thumbnails.length - 1][thumbnails[thumbnails.length - 1].length - 2].time
      dispatch(GetVodVideo(camera_id, startTime, end));
      dispatch({ type: START_TIME_GROUP, payload: startTime });
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
    let subTime = thumbnail ? thumbnail[number].time : time;
    setSubURL(subURL);
    setSubTime(subTime);
    setarrow(arrow);
    let startTime = subTime;
    setstartTime(startTime);
  };

  return (
    <ButtonBase
      sx={
        id.toString() === selected.toString()
          ? {
            width: "90%",
            height: 124,
            border: "2px solid rgb(2, 151, 253)",
            marginTop: 1,
            marginLeft: 1,
          }
          : { width: "90%", height: 124, marginTop: 1, marginLeft: 1 }
      }
    >
      <div className="thumbnail">
        <li>
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
