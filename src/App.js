import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ImageList, Grid, Input, Paper, Typography, Divider } from "@mui/material";

import "./public/App.css";

import CameraListItem from "./components/CameraListItem";
import SearchFilter from "./components/SearchFilter";
import Thumbnails from "./components/Thumbnails";
import Header from "./components/Header";
import HLSPlayer from "./components/HLSPlayer";

import { GetLiveVideo, getCameras, setCamera } from "./actions/action";

function App() {
  const dispatch = useDispatch();
  const { camera, cameras } = useSelector((state) => state.camera);

  const searchCameras = (value) => {
    dispatch(getCameras(value));
  };
  const getSelectedLiveVideo = (target) => {
    if (target.id) {
      dispatch(setCamera(cameras[target.id]));
      dispatch(GetLiveVideo(camera.id));
    }
  };

  useState(() => {
    dispatch(getCameras(""));
  }, []);

  return (
    <div className="App">
      <Header />
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={2.4} style={{ marginLeft: "1%", marginTop: "1%" }} className="box">
          <Paper
            sx={{
              paddingLeft: 2,
              paddingTop: 2,
              paddingBottom: 2,
              marginBottom: 2,
              maxWidth: "90%",
              maxHeight: 100,
              backgroundColor: (theme) => "#fff",
            }}
          >
            <Input
              style={{ width: "95%" }}
              placeholder="Search by location or camera"
              onChange={(e) => searchCameras(e.target.value)}
            />{" "}
          </Paper>
          <Divider sx={{ width: "94%" }} />
          <ImageList sx={{ width: "100%", maxHeight: "100%" }} cols={1}>
            {cameras.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={(e) => {
                    getSelectedLiveVideo(e.target);
                  }}
                >
                  <CameraListItem
                    selected={camera.id}
                    id={index}
                    self={item.id}
                    name={item.name}
                    location={item.location}
                    conn={item.online}
                    image={item.thumbnail}
                  />
                </div>
              );
            })}
          </ImageList>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h3" sx={{ marginTop: 4, marginLeft: 3 }}>What are you Looking For</Typography>
          <SearchFilter />
          <HLSPlayer />
          <Thumbnails />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
