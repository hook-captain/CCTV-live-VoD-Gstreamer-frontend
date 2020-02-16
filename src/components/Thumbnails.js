import React, { useState } from "react";
import Thumbnail from "./Thumbnail";
import ImageList from "@mui/material/ImageList";
import "../public/Thumbnail.css";
import { Divider } from "@mui/material";
import { useSelector } from "react-redux";

export default function Thumbnails() {
  const { mode } = useSelector((state) => state.video);
  const {selected, thumbnails} = useSelector((state) => state.thumbnail);
  const [showtime, setShowtime] = useState(new Date());  
  const [status, setStatus] = useState(0); 

  const DateTime = (Dates) => {
    let result,
      Month,
      Day,
      Hour,
      Min,
      CurrentTime = Dates;
      
    if (CurrentTime.getMonth() < 9) Month = `0${CurrentTime.getMonth() + 1}`;
    else Month = `${CurrentTime.getMonth() + 1}`;

    if (CurrentTime.getDate() < 10) Day = `0${CurrentTime.getDate()}`;
    else Day = `${CurrentTime.getDate()}`;

    if (CurrentTime.getHours() < 10) Hour = `0${CurrentTime.getHours()}`;
    else Hour = `${CurrentTime.getHours()}`;

    if (CurrentTime.getMinutes() < 10) Min = `0${CurrentTime.getMinutes()}`;
    else Min = `${CurrentTime.getMinutes()}`;

    result = `${CurrentTime.getFullYear()}-${Month}-${Day} ${Hour}:00 ~`;
    return result;
  };

  return mode === "VOD" ? (
    <div>
      <font size={30} color="blue">
        {thumbnails ? thumbnails.length : 0}
      </font>{" "}
      <b>Clip Segments</b>
      <Divider sx={{ marginBottom: 1, width: "98%" }} />
      <ImageList sx={{ width: "98%", maxHeight: 280 }} cols={6}>
        {thumbnails.map((cell, index) => {
          let item = cell[0];
          return (
            <div
              key={index}
            >
              <Thumbnail
                id={index}
                selected={selected}
                url={item.path}
                time={item.time}
                camera_id={item.camera_id}
              />
            </div>
          );
        })}
      </ImageList>
      <Divider sx={{ marginTop: 1, marginBottom: 1, width: "98%" }} />
    </div>
  ) : (
    <Divider sx={{ marginTop: 1, marginBottom: 1, width: "98%" }} />
  );
}
