import React, { useState } from "react";
import { ButtonBase } from "@mui/material";
import { useSelector } from "react-redux";

export default function Thumbnail({
  id,
  selected,
  url,
  time,
  camera_id,
  index,
}) {
  const thumbnail = useSelector((state) => state.thumbnail.thumbnails)[index];
  const [sub_URL, setSubURL] = useState(url);
  const handleMouseMove = (e) => {
    let number = Math.floor(
      (e.nativeEvent.offsetX * thumbnail.length) / e.target.width
    );
    let subURL = thumbnail ? thumbnail[number].path : url;
    setSubURL(subURL);
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
    >
      <div className="thumbnail">
        <li>
          <img
            onMouseMove={(e) => handleMouseMove(e)}
            id={id}
            alt="alt"
            prop="prop"
            src={url}
            width={200}
            height={120}
          />
          <span className="large">
            <img
              src={sub_URL}
              className="large-image"
              width={250}
              height={150}
              alt="alt"
              prop="prop"
            />
          </span>
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
            07:30 AM
          </div>
        </li>
      </div>
    </ButtonBase>
  );
}
