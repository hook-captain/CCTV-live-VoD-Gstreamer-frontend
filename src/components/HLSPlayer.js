import React, { useState, useEffect } from "react";
import {
    AppBar,
    Grid,
    Button,
    createTheme,
    ThemeProvider
} from "@mui/material";

import {
    SkipPreviousRounded,
    SkipNextRounded,
    PauseCircleOutlineRounded,
    PlayCircleOutlineRounded,
    FileDownloadOutlined,
    AddAPhotoOutlined,
    FullscreenOutlined
} from "@mui/icons-material";

import ReactHlsPlayer from "react-hls-player";
import { useDispatch, useSelector } from "react-redux";
import { START_TIME_GROUP } from "../redux/types";
import { GetVodVideo, selectThumbnail, GetLiveVideo } from "../actions/action";
import "../public/App.css";
import { findDOMNode } from "react-dom";
import screenfull from 'screenfull';
import captureVideoFrame from 'capture-video-frame';
import { toPng } from 'html-to-image';

const theme = createTheme({
    palette: {
        primary: {
            main: '#D9D9D9',
        },
    },
});

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
    const selected = useSelector((state) => state.thumbnail.selected)
    const startTime = useSelector((state) => state.thumbnail.startTime)
    const thumbnails = useSelector((state) => state.thumbnail.thumbnails);
    const dispatch = useDispatch();
    const [status, setStatus] = useState(0);
    const [timerID, setTimerID] = useState(0);
    const [selectState, setSelectState] = useState(0);
    const playerRef = React.useRef(null);
    const [time, setTime] = useState(new Date());

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

    const GoLiveVideo = () => {
        dispatch(GetLiveVideo(camera.id))
    }

    const previousClick = () => {
        if (mode === "VOD") {
            if (selected && selected > 0) {
                let start = thumbnails[selected - 1][0].time
                let end = thumbnails[thumbnails.length - 1][thumbnails[thumbnails.length - 1].length - 2].time
                dispatch({ type: START_TIME_GROUP, payload: start });
                dispatch(GetVodVideo(camera.id, start, end));
                dispatch(selectThumbnail(selected - 1));
            }
        }
    }

    const nextClick = () => {
        if (mode === "VOD") {
            if (parseInt(selected) < thumbnails.length - 1) {
                let start = thumbnails[parseInt(selected) + 1][0].time;
                let end = thumbnails[thumbnails.length - 1][thumbnails[thumbnails.length - 1].length - 2].time;
                dispatch({ type: START_TIME_GROUP, payload: start });
                dispatch(GetVodVideo(camera.id, start, end));
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
        toPng(document.querySelector('.react-flow'), {
            filter: (node) => {
                if (
                    node?.classList?.contains('react-flow__minimap') ||
                    node?.classList?.contains('react-flow__controls')
                ) {
                    return false;
                }
                return true;
            },
        }).then(downloadImage(frame.dataUri));
    };



    function downloadImage(dataUrl) {
        const a = document.createElement('a');

        a.setAttribute('download', 'reactflow.png');
        a.setAttribute('href', dataUrl);
        a.click();
    }

    function addSeconds(date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }


    let started = new Date(startTime);
    function increase() {
        setTime(new Date(addSeconds(started, 1)));
    }


    function playVideo() {
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
                    controls={false}
                    width="85%"
                    height="auto"
                    playerRef={playerRef}
                />
            </div>
            {mode === "VOD" ?
                <ThemeProvider theme={theme}>
                    <AppBar position="static" className="playcontrols" color="primary">

                        <Grid container spacing={0} sx={{ marginTop: "5px" }}>
                            <Grid item xs={9.3} className="nextdate">
                                <SkipPreviousRounded cursor="pointer" sx={{ marginLeft: 2 }} fontSize="large" onClick={() => previousClick()} />
                                {status === 1 ? <PlayCircleOutlineRounded cursor="pointer" fontSize="large" onClick={() => playVideo()} />
                                    : <PauseCircleOutlineRounded cursor="pointer" fontSize="large" onClick={pauseVideo} />}
                                <SkipNextRounded cursor="pointer" fontSize="large" onClick={() => nextClick()} />
                                <font size="2" style={{ marginLeft: 10, maxWidth: "5%" }}>
                                    {DateTime(time)}
                                </font>
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
