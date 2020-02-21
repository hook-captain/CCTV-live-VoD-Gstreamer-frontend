import React, { useState } from "react";
import Thumbnail from "./Thumbnail";
import "../public/Thumbnail.css";
import { Divider, Grid } from "@mui/material";
import { useSelector } from "react-redux";

export default function Thumbnails() {
  const { mode } = useSelector((state) => state.video);
  const { selected, thumbnails } = useSelector((state) => state.thumbnail);
  const getDateTime = (Dates) => {
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

    // if (CurrentTime.getMinutes() < 10) Min = `0${CurrentTime.getMinutes() - CurrentTime.getMinutes() % 2}`;
    // else Min = `${CurrentTime.getMinutes() - CurrentTime.getMinutes() % 2}`;

    // if (CurrentTime.getMinutes() < 10) Min = `0${CurrentTime.getMinutes()}`;
    // else Min = `${CurrentTime.getMinutes()}`;

    result = `${CurrentTime.getFullYear()}-${Month}-${Day} ${Hour}:00 ~`;
    return result;
  };

  let timeArray = new Object();

  if (thumbnails && thumbnails[0]) {
    for (let i = 0; i < thumbnails.length; i++) {
      let time = new Date(thumbnails[i][0].time);
      time.setMinutes(0);
      time.setSeconds(0);
      time.setMilliseconds(0);

      let timeGroup = getDateTime(time);
      if (!timeArray[timeGroup]) {
        timeArray[timeGroup] = [];
      }

      timeArray[timeGroup].push(thumbnails[i]);
    }
  }

  let indexs = 0;

  return mode === "VOD" ? (
    <div>
      <font size={30} color="blue">
        {thumbnails ? thumbnails.length : 0}
      </font>{" "}
      <b>Clip Segments</b>
      <Divider sx={{ marginBottom: 1, width: "98%" }} />
      {Object.keys(timeArray).map((key, count) => {
        return (
          <Grid container spacing={2} key={key}>
            <Grid item xs={12} sm container>
              {
                timeArray[key].map((items, index) => {
                  indexs = indexs + 1;
                  let item = items[0];
                  return <Grid item xs={2} key={index} >
                    {index === 0 ? <div style={{ color: "blue" }}>{key}</div> : <div style={{ marginBottom: 20 }}></div>}
                    <Thumbnail
                      id={indexs - 1}
                      thumbnails={items}
                      selected={selected}
                      url={item.path}
                      time={item.time}
                      camera_id={item.camera_id}
                    />
                  </Grid>
                })
              }
            </Grid>
          </Grid>
        );
      })}
      <Divider sx={{ marginTop: 1, marginBottom: 1, width: "98%" }} />
    </div>
  ) : (
    <Divider sx={{ marginTop: 1, marginBottom: 1, width: "98%" }} />
  );
}