import React, { useState } from "react";
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
  Button,
} from "@mui/material";
import { getThumbnail } from "../actions/action";

export default function SearchFilter() {
  const { camera } = useSelector((state) => state.camera);
  const [duration, setDuration] = useState(5);

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

  const getDatetime = () => {
    let CurrentTime = new Date();
    CurrentTime.setDate(CurrentTime.getDate() - 3);
    return DateTime(CurrentTime);
  };
  const [starttime, setStarttime] = useState(`${getDatetime()}`);
  const [endtime, setEndtime] = useState(`${DateTime(new Date())}`);

  const handleChange = (e) => {
    setDuration(e.target.value);
  };
  const setStarttimeChange = (e) => {
    setStarttime(e.target.value);
  };
  const setEndtimeChange = (e) => {
    setEndtime(e.target.value);
  };
  const dispatch = useDispatch();
  //const thumbnails = useSelector((state) => state.thumbnail.thumbnails);

  const getThumbnailClick = () => {
    dispatch(getThumbnail(camera.id, starttime, endtime, duration));
  };

  return (
    <Grid style={{ marginTop: 15 }} container spacing={2}>
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
          style={{ color: "rgb(2, 151, 253)", marginTop: 10 }}
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
              onChange={handleChange}
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
      <Grid item xs={1} marginTop={1}>
        <Button variant="outlined" onClick={() => getThumbnailClick()}>
          Search
        </Button>
      </Grid>
    </Grid>
  );
}
