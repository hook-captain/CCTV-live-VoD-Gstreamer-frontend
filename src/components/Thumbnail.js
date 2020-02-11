import React, { useState } from "react";
import { ButtonBase } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import "../public/Thumbnail.css";
import line from "../public/line.png";
import { selectThumbnail } from "../actions/action";

export default function Thumbnail({ id, selected, url, time, camera_id }) {
  const thumbnail = useSelector((state) => state.thumbnail.thumbnails)[id];
  const [sub_URL, setSubURL] = useState(url);
  const [sub_Time, setSubTime] = useState(time);
  const [arrow, setarrow] = useState(0);
  const [Status, MouseDownStatus] = useState(0);
  const dispatch = useDispatch();
  const MouseDown = () => {
    let Status = 1;
    MouseDownStatus(Status);
  };

  const timefromat = (date) => {
    let Hour, Min, Second, result;
    let time = new Date(date);
    if (time.getHours() < 9) Hour = `0${time.getHours() + 1}`;
    else Hour = `${time.getHours() + 1}`;

    if (time.getMinutes() < 9) Min = `0${time.getMinutes() + 1}`;
    else Min = `${time.getMinutes() + 1}`;

    if (time.getSeconds() < 9) Second = `0${time.getSeconds() + 1}`;
    else Second = `${time.getSeconds() + 1}`;

    result = `${Hour}:${Min}:${Second}`;
    return result;
  };

  const onclickline = (e) => {
    dispatch(selectThumbnail(e.target.id));
  };

  const handleMouseMove = (e) => {
    let number = Math.floor(
      (e.nativeEvent.offsetX * thumbnail.length) / e.target.width
    );
    if (Status === 1 && id.toString() === selected.toString()) {
      let arrow = e.nativeEvent.offsetX / 2;
      let subURL = thumbnail ? thumbnail[number].path : url;
      let subTime = thumbnail ? thumbnail[number].time : time;
      setSubURL(subURL);
      setSubTime(subTime);
      setarrow(arrow);
    }
  };

  return (
    <ButtonBase
      sx={
        id.toString() === selected.toString()
          ? {
              width: 206,
              height: 126,
              border: "3px solid rgb(2, 151, 253)",
              marginTop: 1,
              marginLeft: 1,
            }
          : { width: 206, height: 126, marginTop: 1, marginLeft: 1 }
      }
      onMouseDown={() => MouseDown()}
    >
      <div className="thumbnail">
        <li>
          <img
            onMouseMove={(e) => handleMouseMove(e)}
            id={id}
            alt="alt"
            prop="prop"
            src={sub_URL}
            width={200}
            height={120}
          />
          {Status === 1 ? (
            <div className="viewline" style={{ marginLeft: `${arrow}%` }}>
              <img
                src={line}
                alt="img"
                id={id}
                prop="prop"
                style={
                  id.toString() !== selected.toString()
                    ? { display: "none" }
                    : { display: "" }
                }
                height={120}
                onClick={(e) => onclickline(e)}
              />
            </div>
          ) : (
            <></>
          )}
          {id.toString() === selected.toString() ? (
            <div className="viewtag" style={{ marginTop: "8%" }}>
              ▶️ Viewing
            </div>
          ) : (
            <></>
          )}
          <div
            className="viewtime"
            style={{ marginTop: "8%", marginLeft: "55%" }}
          >
            {timefromat(sub_Time)}
          </div>
        </li>
      </div>
    </ButtonBase>
  );
}
