import React from "react";
import { useDispatch } from "react-redux";
import Thumbnail from "./Thumbnail";
import ImageList from "@mui/material/ImageList";
import "../public/Thumbnail.css";
import { Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { GetVodVideo, selectThumbnail } from "../actions/action";

export default function Thumbnails() {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.video);
  const { camera } = useSelector((state) => state.camera);
  const {selected, thumbnails} = useSelector((state) => state.thumbnail);
  const getSelectedVodVideo = (id) => {
    if (id) {
      let start = thumbnails[id][0].time;
      let end = thumbnails[id][thumbnails[id].length - 1].time;
      dispatch(GetVodVideo(camera.id, start, end));
      dispatch(selectThumbnail(id));
    }
  };
  //const vodVideo = useSelector((state) => state.VodVideo.VodVideos);

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
              onClick={(e) => {
                getSelectedVodVideo(e.target.id);
              }}
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
