import React from "react";
import { useState } from "react";
import Thumbnail from "./Thumbnail";
import ImageList from "@mui/material/ImageList";
import "./Thumbnail.css";
import { Divider } from "@mui/material";
import { useSelector } from "react-redux";

export default function Thumbnails() {
  const [selected, setSelected] = useState("-1");
  const thumbnails = useSelector((state) => state.thumbnail.thumbnails);

  return (
    <div>
      <font size={30} color="blue">
        {thumbnails ? thumbnails.length : 0}
      </font>{" "}
      <b>Clip Segments</b>
      <Divider sx={{ marginBottom: 1, width: "98%" }} />
      <ImageList sx={{ width: "98%", height: 280 }} cols={6}>
        {thumbnails.map((cell, index) => {
          let item = cell[0];
          return (
            <div
              key={item.id}
              onClick={(e) => {
                setSelected(e.target.id);
              }}
            >
              <Thumbnail
                id={item.id}
                selected={selected}
                url={item.path}
                time={item.time}
                camera_id={item.camera_id}
                index={index}
              />
            </div>
          );
        })}
      </ImageList>
      <Divider sx={{ marginTop: 1, marginBottom: 1, width: "98%" }} />
    </div>
  );
}
