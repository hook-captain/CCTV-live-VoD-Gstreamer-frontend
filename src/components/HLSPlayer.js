import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Grid,
    Button
  } from "@mui/material";

import { 
    SkipPreviousOutlined,
    SkipNextOutlined, 
    PauseCircleOutlineOutlined ,
    PlayCircleOutlineOutlined,
    VolumeOffOutlined ,
    VolumeUpOutlined ,
    AddAPhotoOutlined ,
    ShareOutlined ,
    FullscreenOutlined 
} from "@mui/icons-material";

import ReactHlsPlayer from "react-hls-player";
import { useDispatch, useSelector } from "react-redux";
import { GetVodVideo, selectThumbnail, GetLiveVideo } from "../actions/action";
  
import "../public/App.css";
  
function HLSPlayer() { 

     const DateTime = (Dates) => {
        let result,
          Month,
          Day,
          Hour,
          Min,
          second,
          CurrentTime = Dates;
          
        if (CurrentTime.getMonth() < 9) Month = `0${CurrentTime.getMonth() + 1}`;
        else Month = `${CurrentTime.getMonth() + 1}`;

        if (CurrentTime.getDate() < 10) Day = `0${CurrentTime.getDate()}`;
        else Day = `${CurrentTime.getDate()}`;

        if (CurrentTime.getHours() < 10) Hour = `0${CurrentTime.getHours()}`;
        else Hour = `${CurrentTime.getHours()}`;

        if (CurrentTime.getMinutes() < 10) Min = `0${CurrentTime.getMinutes()}`;
        else Min = `${CurrentTime.getMinutes()}`;

        if (CurrentTime.getSeconds() < 10) second = `0${CurrentTime.getSeconds()}`;
        else second = `${CurrentTime.getSeconds()}`;

        result = `${CurrentTime.getFullYear()}/${Month}/${Day} ${Hour}:${Min}:${second}`;
        return result;
    }; 

    const camera = useSelector((state) => state.camera.camera);
    const mode = useSelector((state) => state.video.mode);
    const video = useSelector((state) => state.video.video);
    const selected = useSelector((state)=>state.thumbnail.selected)
    const startTime = useSelector((state)=>state.thumbnail.startTime)
    const thumbnails = useSelector((state) => state.thumbnail.thumbnails);
    const dispatch = useDispatch();
    const [status, setStatus] = useState(0);

    const [selectState, setSelectState] = useState(0);
    const playerRef = React.useRef(null);

    useEffect(() => {
            dispatch(selectThumbnail(selectState));
    },[selectState]);

    const GoLiveVideo = () => {
        dispatch(GetLiveVideo(camera.id))  
    }

    const previousClick = () =>{
        if(mode === "VOD"){
            if(selected && selected > 0){
                let start = thumbnails[selected-1][0].time
                let end = thumbnails[thumbnails.length-1][thumbnails[thumbnails.length-1].length - 2].time
                dispatch(GetVodVideo(camera.id, start, end)); 
                dispatch(selectThumbnail(selected-1));
            }
        }
    }

    const nextClick = () => {
        if(mode === "VOD"){
          if(parseInt(selected) < thumbnails.length-1){
                let start = thumbnails[parseInt(selected) + 1][0].time;
                let end = thumbnails[thumbnails.length-1][thumbnails[thumbnails.length-1].length - 2].time;
                dispatch(GetVodVideo(camera.id, start, end)); 

                setSelectState(parseInt(selected) + 1);
          }
        }
    }

    // function addSeconds(date, seconds) {
    //     date.setSeconds(date.getSeconds() + seconds);
    //     return date;
    // }

    // setTimeout(start, 1000);
    // function start() {
    //     setInterval(increase, 1000);
    // }
    // function increase() {
    //     startTime = addSeconds(startTime, 1);
    // }

    function playVideo(e) {
        playerRef.current.play();
        let status = 0;
        setStatus(status);
    }

    function pauseVideo() {
        playerRef.current.pause();
        let status = 1;
        setStatus(status);
    }

return (
    <div>
        <div className="videoview">
            <div className="Modetext">{mode === "LIVE" ? "Live Video Mode" : "Vod Video Mode"}</div>
            <ReactHlsPlayer
                key={`${selected}`+ `${startTime}`}
                src={mode === "VOD" ? video : ""}
                autoPlay={true}
                controls={false}
                width="50%"
                height="auto"
                playerRef={playerRef}
            />
        </div>          
        <AppBar position="static" className="playcontrols">
        {mode==="VOD"?
            <Grid container spacing={0}>
            <Grid item xs={4}>
                <Typography variant="h12" sx={{ maxWidth: "25%"}}>
                {DateTime(new Date(startTime))}
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <SkipPreviousOutlined onClick={()=>previousClick()}/>
                {status === 1?<PlayCircleOutlineOutlined onClick={()=>playVideo()}/>
                :<PauseCircleOutlineOutlined onClick={pauseVideo}/>}
                <SkipNextOutlined onClick={()=>nextClick()}/>
            </Grid>
            <Grid item xs={3}>
                <VolumeOffOutlined />
                <AddAPhotoOutlined />
                <ShareOutlined />
                <FullscreenOutlined />
            </Grid>
            <Grid item xs={3}>
                <Button variant="contained" color="success" onClick={GoLiveVideo}>Live Video</Button>
            </Grid></Grid>
            :<Grid container spacing={0}>
            <Grid item xs={5}>
                <Typography variant="h12" sx={{ maxWidth: "25%"}}>
                {DateTime(new Date())}
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <SkipPreviousOutlined onClick={()=>previousClick()}/>
                {status === 1?<PlayCircleOutlineOutlined onClick={playVideo}/>
                :<PauseCircleOutlineOutlined onClick={pauseVideo}/>}
                <SkipNextOutlined onClick={()=>nextClick()}/>
            </Grid>
            <Grid item xs={3}>
                <VolumeOffOutlined />
                <AddAPhotoOutlined />
                <ShareOutlined />
                <FullscreenOutlined />
            </Grid>
            </Grid>}
        </AppBar>
    </div>
);
}

export default HLSPlayer;
  