import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Alert,
  Snackbar
} from "@mui/material";
import { getThumbnail, GetVodVideo } from "../actions/action";
import { START_TIME_GROUP } from "../redux/types";

export default function SearchFilter() {
  const { camera } = useSelector((state) => state.camera);
  const thumbnails = useSelector((state) => state.thumbnail.thumbnails);
  const [startTime, setstartTime] = useState(new Date());
  const [open, setOpen] = React.useState(false);
  // const video = useSelector((state) => state.video);
  const [duration, setDuration] = useState(5);
  const [cameraID, setCameraID] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (thumbnails.length) {
      let start = thumbnails[0][0].time
      let end = thumbnails[thumbnails.length - 1][thumbnails[thumbnails.length - 1].length - 2].time
      dispatch(GetVodVideo(cameraID, start, end));
      let startTime = start;
      setstartTime(startTime);
      dispatch({ type: START_TIME_GROUP, payload: startTime });
    }
  }, [thumbnails]);

  const DateTime = (Date) => {
    let result,
      Month,
      Day,
      Hour,
      Min,
      CurrentTime = Date;

    if (CurrentTime.getMonth() < 9) Month = `0${CurrentTime.getMonth() + 1}`;
    else Month = `${CurrentTime.getMonth() + 1}`;

    if (CurrentTime.getDate() < 10) Day = `0${CurrentTime.getDate()}`;
    else Day = `${CurrentTime.getDate()}`;

    if (CurrentTime.getHours() < 10) Hour = `0${CurrentTime.getHours()}`;
    else Hour = `${CurrentTime.getHours()}`;

    if (CurrentTime.getMinutes() < 10) Min = `0${CurrentTime.getMinutes()}`;
    else Min = `${CurrentTime.getMinutes()}`;

    result = `${CurrentTime.getFullYear()}-${Month}-${Day}T${Hour}:${Min}`;
    return result;
  };

  // const [timerID, setTimerID] = useState(0);

  // useEffect(() => {
  //   if (startTime) {
  //     if (timerID > 0) {
  //       clearInterval(timerID);
  //     }
  //     let timer_id = setInterval(increase, 300000)
  //     setTimerID(timer_id);
  //   }
  // }, [startTime]);

  // function increase() {
  //   dispatch(getThumbnail(camera.id, starttime, endtime, duration));
  // }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const getDatetime = () => {
    let CurrentTime = new Date();
    CurrentTime.setDate(CurrentTime.getDate() - 3);
    return DateTime(CurrentTime);
  };

  const [starttime, setStarttime] = useState(`${getDatetime()}`);
  const [endtime, setEndtime] = useState(`${DateTime(new Date())}`);

  const getdefaultVod = (camera_id) => {
    setCameraID(camera_id);
  }



  const handleChange = (e) => {
    setDuration(e.target.value);
    dispatch(getThumbnail(camera.id, starttime, endtime, e.target.value));
    getdefaultVod(camera.id)
  };

  const setStarttimeChange = (e) => {
    setStarttime(e.target.value);
    if (e.target.value <= endtime) {
      dispatch(getThumbnail(camera.id, e.target.value, endtime, 0.2));
      getdefaultVod(camera.id);
    }
    else {
      setOpen(true);
    }
  };

  const setEndtimeChange = (e) => {
    setEndtime(e.target.value);
    if (e.target.value >= starttime) {
      dispatch(getThumbnail(camera.id, starttime, e.target.value, duration));
      getdefaultVod(camera.id);
    }
    else {
      setOpen(true);
    }
  };


  return (
    <Grid style={{ marginTop: 15 }} container spacing={2}>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          StartTime or EndTime is not correct!
        </Alert>
      </Snackbar>
      <Grid item xs={3}>
        <TextField
          id="datetime-local"
          label="Start Time"
          type="datetime-local"
          sx={{ width: "70%" }}
          InputLabelProps={{
            shrink: true,
          }}
          value={starttime}
          onChange={(e) => setStarttimeChange(e)}
        />
      </Grid>
      <Grid item xs={1}>
        <ArrowForwardIcon
          fontSize="large"
          style={{ color: "#888888", marginTop: 10 }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id="datetime-local"
          label="End Time"
          type="datetime-local"
          sx={{ width: "70%" }}
          InputLabelProps={{
            shrink: true,
          }}
          value={endtime}
          onChange={(e) => setEndtimeChange(e)}
        />
      </Grid>
      <Grid item xs={2}>
        <Box sx={{ width: "80%" }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Clip Duration</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={duration}
              label="Clip Duration"
              onChange={(e) => handleChange(e)}
            >
              <MenuItem value={1}>1 minute</MenuItem>
              <MenuItem value={5}>5 minutes</MenuItem>
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={60}>60 minutes</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>
    </Grid>
  );
}
