import React from "react";
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
      Hour1,
      Min,
      CurrentTime = Dates;

    if (CurrentTime.getMonth() < 9) Month = `0${CurrentTime.getMonth() + 1}`;
    else Month = `${CurrentTime.getMonth() + 1}`;

    if (CurrentTime.getDate() < 10) Day = `0${CurrentTime.getDate()}`;
    else Day = `${CurrentTime.getDate()}`;

    if (CurrentTime.getHours() > 12) {
      Hour = `${CurrentTime.getHours() - 12}:00`;
    }
    else {
      if (CurrentTime.getHours() < 10) {
        Hour = `0${CurrentTime.getHours()}:00`;
      }
      else {
        Hour = `${CurrentTime.getHours()}:00`;
      }
    }

    if (CurrentTime.getHours() > 11) {
      Hour1 = `${CurrentTime.getHours() - 11}:00PM`;
    }
    else {
      if (CurrentTime.getHours() < 9) {
        Hour1 = `0${CurrentTime.getHours() + 1}:00AM`;
      }
      else {
        Hour1 = `${CurrentTime.getHours() + 1}:00AM`;
      }
    }

    // if (CurrentTime.getMinutes() < 10) Min = `0${CurrentTime.getMinutes() - CurrentTime.getMinutes() % 2}`;
    // else Min = `${CurrentTime.getMinutes() - CurrentTime.getMinutes() % 2}`;

    if (CurrentTime.getMinutes() < 10) Min = `0${CurrentTime.getMinutes()}`;
    else Min = `${CurrentTime.getMinutes()}`;

    result = `${CurrentTime.getFullYear()}-${Month}-${Day} ${Hour}-${Hour1}${Min}`;
    return result;
  };

  // function autoRefresh() {
  //   window.location = window.location.href;
  // }
  // setInterval(autoRefresh(), 55000);

  let timeArray = Object.create(null);
  let datetimeArray = Object.create(null);
  
  if (thumbnails && thumbnails[0]) {
    for (let i = 0; i < thumbnails.length; i++) {
      let time = new Date(thumbnails[i][0].time);
      // time.setMinutes(0);
      time.setSeconds(0);
      time.setMilliseconds(0);

      let timeGroup = getDateTime(time);
      if (!timeArray[timeGroup]) {
        timeArray[timeGroup] = [];
      }

      timeArray[timeGroup].push(thumbnails[i]);
    }
  }

  let indexs = 0, dateCount = 0, cnt = -1, endTime;
  let clipArray = [];
  let subThumb = Object.create(null);

  
  for (let i = 0; i < Object.keys(timeArray).length; i++) {
    datetimeArray[Object.keys(timeArray)[Object.keys(timeArray).length - 1 - i]] = Object.values(timeArray)[Object.keys(timeArray).length - 1 - i]
  }

  if (Object.keys(datetimeArray).length) {
    let flag = datetimeArray[Object.keys(datetimeArray)[0]].length, count = 0;
    for (let i = 1; i < Object.keys(datetimeArray).length; i++) {
      if (Object.keys(datetimeArray)[i].split(" ")[0].localeCompare(Object.keys(datetimeArray)[i - 1].split(" ")[0]) === 0) {
        flag = flag + datetimeArray[Object.keys(datetimeArray)[i]].length;
      }
      else {
        flag = datetimeArray[Object.keys(datetimeArray)[i]].length;
        clipArray[count] = flag;
        count = count + 1;
      }
    }
    clipArray[count] = flag;
  }


  for (let i = 0; i < Object.keys(datetimeArray).length; i++) {
    for (let j = 0; j < datetimeArray[Object.keys(datetimeArray)[i]].length; j++) {
      cnt = cnt + 1;
      if (!subThumb[cnt]) {
        subThumb[cnt] = [];
      }
      subThumb[cnt] = datetimeArray[Object.keys(datetimeArray)[i]][j];
      if (i === 0 && j === (datetimeArray[Object.keys(datetimeArray)[i]].length-1)){
      endTime = datetimeArray[Object.keys(datetimeArray)[i]][j][datetimeArray[Object.keys(datetimeArray)[i]][j].length-1].time
        
      }
    }
    subThumb['length'] = cnt+1;
  }

  return mode === "VOD" ? (
    <div>
      <font size={30} color="#888888">
        {thumbnails ? thumbnails.length : 0}
      </font>{" "}
      <b>Clip Segments</b>
      <Divider sx={{ marginBottom: 1, width: "98%" }} />
      {Object.keys(datetimeArray).map((key, count) => {
        return (
          <Grid container spacing={2} key={key}>
            <Grid item xs={12} sm container>
              {
                datetimeArray[key].map((items, index) => {
                  indexs = indexs + 1;
                  dateCount = dateCount + 1;
                  let item = items[0];
                  let trues = 1;
                  if (count > 0) {
                    if (Object.keys(datetimeArray)[count - 1].split(" ")[0].localeCompare(Object.keys(datetimeArray)[count].split(" ")[0]) === 0) {
                      trues = 0;
                    }
                  }
                  return <Grid item xs={2} key={index} style={{ marginTop: 'auto' }}>
                    {index === 0 ?
                      <div>
                        {trues !== 0 ? <div className="datetime">{key.split(" ")[0]} <font color="#888888" size={5}>({clipArray[dateCount - 1]}Clips)</font></div> : <br />}
                        <div className="time">{key.split(" ")[1]}</div>
                      </div> :
                      <div style={{ marginBottom: 48 }}></div>}
                    <Thumbnail
                      id={indexs - 1}
                      thumbnails={subThumb}
                      selected={selected}
                      url={item.path}
                      time={item.time}
                      camera_id={item.camera_id}
                      endTime={endTime}
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