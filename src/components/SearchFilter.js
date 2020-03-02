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
import { START_TIME_GROUP, START_CLIPTIME_GROUP, GET_SEARCH_KEY } from "../redux/types";

export default function SearchFilter() {
  const { camera } = useSelector((state) => state.camera);
  const thumbnails = useSelector((state) => state.thumbnail.thumbnails);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [duration, setDuration] = useState(5);
  const dispatch = useDispatch();

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

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen1(false);
    setOpen2(false);
  };

  const getDatetime = () => {
    let CurrentTime = new Date();
    CurrentTime.setDate(CurrentTime.getDate() - 3);
    return DateTime(CurrentTime);
  };

  const [starttime, setStarttime] = useState(`${getDatetime()}`);
  const [endtime, setEndtime] = useState(`${DateTime(new Date())}`);

  useEffect(() => {    
    dispatch({ type: GET_SEARCH_KEY, payload: {starttime, endtime, duration} });
    if (thumbnails.length) {
      let start = thumbnails[thumbnails.length - 1][0].time
      let end = thumbnails[thumbnails.length - 1][thumbnails[thumbnails.length - 1].length - 2].time
      dispatch(GetVodVideo(camera.id, start, end));
      dispatch({ type: START_TIME_GROUP, payload: start });
      dispatch({ type: START_CLIPTIME_GROUP, payload: start });

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thumbnails]);

  const handleChange = (e) => {
    setDuration(e.target.value);
    dispatch(getThumbnail(camera.id, starttime, endtime, e.target.value));
  };

  const setStarttimeChange = (e) => {
    setStarttime(e.target.value);
    if (e.target.value < endtime) {
      dispatch(getThumbnail(camera.id, e.target.value, endtime, duration));
    }
    else {
      setOpen1(true);
    }
  };

  const setEndtimeChange = (e) => {
    setEndtime(e.target.value);
    if (e.target.value > starttime) {
      dispatch(getThumbnail(camera.id, starttime, e.target.value, duration));
    }
    else {
      setOpen2(true);
    }
  };


  return (
    <Grid style={{ marginTop: 15 }} container spacing={2}>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open1} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          {'From time should be <= To time or Current time!'}
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open2} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          {'To time should be >= From time!'}
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
