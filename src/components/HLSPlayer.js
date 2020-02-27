import React, { useState, useEffect } from "react";
import {
    AppBar,
    Grid,
    Button,
    createTheme,
    ThemeProvider,
    Slider
} from "@mui/material";

import {
    SkipPreviousRounded,
    SkipNextRounded,
    PauseCircleOutlineRounded,
    PlayCircleOutlineRounded,
    FileDownloadOutlined,
    AddAPhotoOutlined,
    FullscreenOutlined,
    FastRewindRounded,
    FastForwardRounded
} from "@mui/icons-material";

import ReactHlsPlayer from "react-hls-player";
import { useDispatch, useSelector } from "react-redux";
import { START_TIME_GROUP } from "../redux/types";
import { GetVodVideo, selectThumbnail, GetLiveVideo } from "../actions/action";
import "../public/App.css";
import { findDOMNode } from "react-dom";
import screenfull from 'screenfull';
import captureVideoFrame from 'capture-video-frame';

const theme = createTheme({
    palette: {
        primary: {
            main: '#D9D9D9',
        },
    },
});

const themeSlider = createTheme({
    palette: {
        primary: {
            main: '#575774',
        },
    },
});

function HLSPlayer() {

    // const DateTime = (Dates) => {
    //     let result,
    //         Month,
    //         Day,
    //         Hour,
    //         Min,
    //         second,
    //         CurrentTime = Dates;

    //     if (CurrentTime.getMonth() < 9) Month = `0${CurrentTime.getMonth() + 1}`;
    //     else Month = `${CurrentTime.getMonth() + 1}`;

    //     if (CurrentTime.getDate() < 10) Day = `0${CurrentTime.getDate()}`;
    //     else Day = `${CurrentTime.getDate()}`;

    //     if (CurrentTime.getHours() < 10) Hour = `0${CurrentTime.getHours()}`;
    //     else Hour = `${CurrentTime.getHours()}`;

    //     if (CurrentTime.getMinutes() < 10) Min = `0${CurrentTime.getMinutes()}`;
    //     else Min = `${CurrentTime.getMinutes()}`;

    //     if (CurrentTime.getSeconds() < 10) second = `0${CurrentTime.getSeconds()}`;
    //     else second = `${CurrentTime.getSeconds()}`;

    //     result = `${CurrentTime.getFullYear()}/${Month}/${Day} ${Hour}:${Min}:${second}`;
    //     return result;
    // };

    const camera = useSelector((state) => state.camera.camera);
    const mode = useSelector((state) => state.video.mode);
    const video = useSelector((state) => state.video.video);
    const selected = useSelector((state) => state.thumbnail.selected)
    const startTime = useSelector((state) => state.thumbnail.startTime)
    const endTime = useSelector((state) => state.thumbnail.endTime)
    const subThumb = useSelector((state) => state.thumbnail.subThumbnails)
    // const thumbnails = useSelector((state) => state.thumbnail.thumbnails);
    const dispatch = useDispatch();
    const [status, setStatus] = useState(0);
    const [timerID, setTimerID] = useState(0);
    const [selectState, setSelectState] = useState(0);
    const playerRef = React.useRef(null);
    // const [time, setTime] = useState(new Date());
    const [currentTime, setCurrentTime] = useState("00:00");
    const [durationTime, setDurationTime] = useState("00:00");

    useEffect(() => {
        dispatch(selectThumbnail(selectState));
    }, [selectState]);

    useEffect(() => {
        if (startTime) {
            if (timerID > 0) {
                clearInterval(timerID);
            }
            let timer_id = setInterval(increase, 1000)
            setTimerID(timer_id);
        }
    }, [startTime]);

    const handleChange = (e) => {
        playerRef.current.currentTime = e.target.value / 100 * playerRef.current.duration;
        playVideo();
    }


    const GoLiveVideo = () => {
        dispatch(GetLiveVideo(camera.id))
    }

    const previousClick = () => {
        if (mode === "VOD") {
            if (selected && selected > 0) {
                let start = subThumb[parseInt(selected) - 1][0].time
                // let end = thumbnails[thumbnails.length - 1][thumbnails[thumbnails.length - 1].length - 2].time
                dispatch({ type: START_TIME_GROUP, payload: start });
                dispatch(GetVodVideo(camera.id, start, endTime));
                dispatch(selectThumbnail(parseInt(selected) - 1));
            }
        }
    }

    const nextClick = () => {
        if (mode === "VOD") {
            if (parseInt(selected) < subThumb.length - 1) {
                let start = subThumb[parseInt(selected) + 1][0].time;
                // let end = thumbnails[thumbnails.length - 1][thumbnails[thumbnails.length - 1].length - 2].time;
                dispatch({ type: START_TIME_GROUP, payload: start });
                dispatch(GetVodVideo(camera.id, start, endTime));
                setSelectState(parseInt(selected) + 1);
            }
        }
    }

    const onClickFullScreen = () => {
        if (screenfull.isEnabled) {
            screenfull.request(findDOMNode(playerRef.current))
        }
    }

    const onClickDownload = () => {
        const a = document.createElement('a');
        a.setAttribute('download', 'playlist.m3u8');
        a.setAttribute('href', "http://localhost:5000/share/playlist.m3u8");
        a.click();
    }

    const onClickScreenShot = () => {
        const frame = captureVideoFrame(playerRef.current);
        downloadImage(frame.dataUri)
    };

    function downloadImage(dataUri) {
        const a = document.createElement('a');
        a.setAttribute('download', 'reactflow.png');
        a.setAttribute('href', dataUri);
        a.click();
    }

    // function addSeconds(date, seconds) {
    //     date.setSeconds(date.getSeconds() + seconds);
    //     return date;
    // }

    // let started = new Date(startTime);

    function increase() {
        timeUpdate()
        timeDuration()
        // setTime(new Date(addSeconds(started, 1)));
    }

    function playVideo() {
        playerRef.current.play();
        let status = 0;
        setStatus(status);
    }

    const timeUpdate = () => {
        const minutes = Math.floor(playerRef.current.currentTime / 60);
        const seconds = Math.floor(playerRef.current.currentTime - minutes * 60);
        const currentTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
        setCurrentTime(currentTime);
    }

    const timeDuration = () => {
        const minutes = Math.floor(playerRef.current.duration / 60);
        const seconds = Math.floor(playerRef.current.duration - minutes * 60);
        const currentTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
        if (playerRef.current.duration) {
            setDurationTime(currentTime);
        } else {
            setDurationTime("00:00");
        }
    }

    const str_pad_left = (string, pad, length) => {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }

    const onClickFastRewind = () => {
        if (playerRef.current.currentTime > 10) {
            playerRef.current.currentTime = playerRef.current.currentTime - 10;
        }
        else {
            playerRef.current.currentTime = 0;
        }
    }

    const onClickFastForward = () => {
        if ((playerRef.current.duration - playerRef.current.currentTime) > 10) {
            playerRef.current.currentTime = playerRef.current.currentTime + 10;
        }
        else {
            playerRef.current.currentTime = playerRef.current.duration;
        }
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
                {mode === "VOD" ?
                    <div className="liveButton">
                        <ThemeProvider theme={theme}>
                            <Button variant="contained" onClick={GoLiveVideo}>Go To Live</Button>
                        </ThemeProvider>
                    </div> : <></>}
                <ReactHlsPlayer
                    key={`${selected}${startTime}`}
                    src={mode === "VOD" ? video : ""}
                    autoPlay={true}
                    controls={true}
                    width="85%"
                    height="auto"
                    playerRef={playerRef}
                />
            </div>
            {mode === "VOD" ?
                <ThemeProvider theme={theme}>
                    <AppBar position="static" className="playcontrols" color="primary">
                        <ThemeProvider theme={themeSlider}>
                            <Slider
                                aria-label="Temperature"
                                value={playerRef.current.currentTime / playerRef.current.duration * 100}
                                onChange={(e) => handleChange(e)}
                                sx={{ marginLeft: '3%', width: '94%' }}
                                color="primary"
                            />
                        </ThemeProvider>
                        <Grid container spacing={0} >
                            <Grid item xs={5.3} className="nextdate">
                                <SkipPreviousRounded cursor="pointer" sx={{ marginLeft: 2 }} fontSize="large" onClick={() => previousClick()} />
                                {status === 1 ? <PlayCircleOutlineRounded cursor="pointer" fontSize="large" onClick={() => playVideo()} />
                                    : <PauseCircleOutlineRounded cursor="pointer" fontSize="large" onClick={pauseVideo} />}
                                <SkipNextRounded cursor="pointer" fontSize="large" onClick={() => nextClick()} />

                                <font size="3" style={{ marginLeft: 10, marginTop: 9 }}>
                                    {/* {DateTime(time)} */}
                                    <b>{`${currentTime}` + "/" + `${durationTime}`}</b>
                                </font>
                            </Grid>
                            <Grid item xs={4} >
                                <FastRewindRounded cursor="pointer" fontSize="large" onClick={() => onClickFastRewind()} />
                                {" "}
                                <FastForwardRounded cursor="pointer" fontSize="large" onClick={() => onClickFastForward()} />
                            </Grid>
                            <Grid item xs={1} >
                                <AddAPhotoOutlined cursor="pointer" fontSize="large" onClick={() => onClickScreenShot()} />
                            </Grid>
                            <Grid item xs={1}>
                                <FileDownloadOutlined cursor="pointer" fontSize="large" onClick={() => onClickDownload()} />
                            </Grid>
                            <Grid item xs={0.7}>
                                <FullscreenOutlined cursor="pointer" fontSize="large" onClick={() => onClickFullScreen()} />
                            </Grid>
                        </Grid>
                    </AppBar>
                </ThemeProvider>
                : <></>}
        </div>
    );
}

export default HLSPlayer;
