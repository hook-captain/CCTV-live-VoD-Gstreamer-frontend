import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ImageList, Grid, Input, Paper } from "@mui/material";

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
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <div style={{ marginLeft: "10%", marginTop: "5%" }}>
            <Paper
              sx={{
                paddingLeft: 2,
                paddingTop: 2,
                paddingBottom: 2,
                maxWidth: "76%",
                maxHeight: 100,
                backgroundColor: (theme) => "#fff",
              }}
            >
              <Input
                style={{ width: "95%" }}
                placeholder="Search"
                onChange={(e) => searchCameras(e.target.value)}
              />{" "}
            </Paper>
            <ImageList sx={{ width: "85%", maxHeight: 720 }} cols={1}>
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
          </div>
        </Grid>
        <Grid item xs={9}>
          <SearchFilter />
          <Thumbnails />
          <HLSPlayer/>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
