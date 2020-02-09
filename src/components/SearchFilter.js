import React, { useState } from "react";
import { useDispatch } from "react-redux";

import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { getThumbnail } from "../actions/action";

export default function SearchFilter() {
  const [duration, setDuration] = useState("");
  const [starttime, setStarttime] = useState("2017-05-24T10:30");
  const [endtime, setEndtime] = useState("2017-05-24T10:30");

  const handleChange = (e) => {
    setDuration(e.target.value);
  };
  const setStarttimeChange = (e) => {
    setStarttime(e.target.value)
  };
  const setEndtimeChange = (e) => {
    setEndtime(e.target.value)
  };
  const dispatch = useDispatch();
  //const thumbnails = useSelector((state) => state.thumbnail.thumbnails);

  const cameraid = 1;

  const getThumbnailClick = () => {
    dispatch(getThumbnail(cameraid, starttime, endtime, duration));
  };

  return (
    <Grid style={{ marginTop: 15 }} container spacing={2}>
      <Grid item xs={1}>
        <SearchIcon
          fontSize="large"
          style={{ color: "rgb(2, 151, 253)", marginTop: 15 }}
          onClick={() => getThumbnailClick()}
        />
        </Grid>
        <Grid item xs={3}>
        <TextField
          id="datetime-local"
          label="Start Time"
          type="datetime-local"
          sx={{ width: 250 }}
          InputLabelProps={{
            shrink: true,
          }}
          value={starttime}
          onChange={(e)=>setStarttimeChange(e)}
        />
        </Grid>
        <Grid item xs={1}>
        <ArrowForwardIcon
          fontSize="large"
          style={{ color: "rgb(2, 151, 253)", marginTop:10 }}
        />
        </Grid>
        <Grid item xs={3}>
        <TextField
          id="datetime-local"
          label="End Time"
          type="datetime-local"
          sx={{ width: 250 }}
          InputLabelProps={{
            shrink: true,
          }}
          value={endtime}
          onChange={(e)=>setEndtimeChange(e)}
        />
      </Grid>
      <Grid item xs={4}>
        <Box sx={{ width: 200 }}>
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
    </Grid>
  );
}
