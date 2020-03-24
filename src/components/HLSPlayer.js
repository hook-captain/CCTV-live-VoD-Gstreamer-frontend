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
import { START_TIME_GROUP, GET_SUB_URL, SET_ENDTIME, START_CLIPTIME_GROUP } from "../redux/types";
import { GetVodVideo, selectThumbnail, GetLiveVideo, getCamerasOnline, getThumbnail } from "../actions/action";
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

const themesubSlider = createTheme({
    palette: {
        primary: {
            main: '#e7944d',
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

    const DateStartTime = (Dates) => {
        let result,
            Month,
            Day,
            Hour,
            CurrentTime = Dates;

        if (CurrentTime.getMonth() < 9) Month = `0${CurrentTime.getMonth() + 1}`;
        else Month = `${CurrentTime.getMonth() + 1}`;

        if (CurrentTime.getDate() < 10) Day = `0${CurrentTime.getDate()}`;
        else Day = `${CurrentTime.getDate()}`;

        if (CurrentTime.getHours() < 10) Hour = `0${CurrentTime.getHours()}`;
        else Hour = `${CurrentTime.getHours()}`;

        if (CurrentTime.getHours() > 12) {
            Hour = `${CurrentTime.getHours() - 12}:00PM`;
        }
        else {
            if (CurrentTime.getHours() < 10) {
                Hour = `0${CurrentTime.getHours()}:00AM`;
            }
            else {
                if (CurrentTime.getHours() === 12) {
                    Hour = `${CurrentTime.getHours()}:00PM`;
                } else {
                    Hour = `${CurrentTime.getHours()}:00AM`;
                }
            }
        }

        result = `${CurrentTime.getFullYear()}/${Month}/${Day} ${Hour}`;
        return result;
    };

    const TimeFormat = (Dates) => {
        let result,
            Hour,
            CurrentTime = Dates;

        if (CurrentTime.getHours() < 10) Hour = `0${CurrentTime.getHours()}`;
        else Hour = `${CurrentTime.getHours()}`;

        result = Hour;
        return result;
    };

    const TimeFormatAdd = (Dates) => {
        let result,
            Hour,
            CurrentTime = Dates;

        if (CurrentTime.getHours() < 9) Hour = `0${CurrentTime.getHours() + 1}`;
        else Hour = `${CurrentTime.getHours() + 1}`;

        if (CurrentTime.getHours() === 23) {
            Hour = `00`
        }

        result = `${Hour}`;
        return result;
    };

    const GetMinute = (Dates) => {
        let result,
            Min,
            CurrentTime = Dates;

        if (CurrentTime.getMinutes() < 10) Min = `0${CurrentTime.getMinutes()}`;
        else Min = `${CurrentTime.getMinutes()}`;

        result = `${Min}`;
        return result;
    };

    const TimelineFormat1 = (Dates) => {
        let Hour, Min, result;
        let time = new Date(Dates);

        if (time.getMinutes() < 10) Min = `0${time.getMinutes()}`;
        else Min = `${time.getMinutes()}`;

        if (time.getHours() > 12) {
            Hour = `${time.getHours() - 12}:${Min}PM`;
        }
        else {
            if (time.getHours() < 10) {
                Hour = `0${time.getHours()}:${Min}AM`;
            }
            else {
                if (time.getHours() === 12) {
                    Hour = `${time.getHours()}:${Min}PM`;
                } else {
                    Hour = `${time.getHours()}:${Min}AM`;
                }
            }
        }

        result = `${Hour}`;
        return result;
    };

    const TimelineFormat2 = (Dates) => {
        let Hour, Min, result;
        let time = new Date(Dates);

        if (time.getMinutes() < 9) Min = `0${time.getMinutes() + 1}`;
        else Min = `${time.getMinutes() + 1}`;        

        if (time.getHours() > 12) {
            Hour = `${time.getHours() - 12}:${Min}PM`;
        }
        else {
            if (time.getHours() < 10) {
                Hour = `0${time.getHours()}:${Min}AM`;
            }
            else {
                if (time.getHours() === 12) {
                    Hour = `${time.getHours()}:${Min}PM`;
                } else {
                    Hour = `${time.getHours()}:${Min}AM`;
                }
            }
        }

        if (time.getMinutes() === 59) {
            if (time.getHours() > 11) {
                if(time.getHours() === 23){
                    Hour = `00:00AM`;
                }else{
                   Hour = `${time.getHours() - 11}:00PM`; 
                }                
            }
            else {
                if (time.getHours() < 9) {
                    Hour = `0${time.getHours()+1}:00AM`;
                }
                else {
                    if (time.getHours() === 11) {
                        Hour = `${time.getHours()+1}:00PM`;
                    } else {
                        Hour = `${time.getHours()+1}:00AM`;
                    }
                }
            }
        }

        result = `${Hour}`;
        return result;
    };


    const getBetweenDate = (Date1, Date2) => {
        return parseInt((new Date(Date2).getTime() - new Date(Date1).getTime()) / 1000)
    }

    const camera = useSelector((state) => state.camera.camera);
    const cameraStatus = useSelector((state) => state.camera.cameraStatus);
    const mode = useSelector((state) => state.video.mode);
    const video = useSelector((state) => state.video.video);
    const filterStartTime = useSelector((state) => state.thumbnail.searchKey.starttime);
    const filterEndTime = useSelector((state) => state.thumbnail.searchKey.endtime);
    const filterDuration = useSelector((state) => state.thumbnail.searchKey.duration);
    const { selected, startTime, startClipTime, endTime, subThumbnails, sub_Url, thumbnails } = useSelector((state) => state.thumbnail)
    const dispatch = useDispatch();
    const [status, setStatus] = useState(0);
    const [timerID, setTimerID] = useState(0);
    const [timerEID, setTimerEID] = useState(0);
    const [selectState, setSelectState] = useState(0);
    const playerRef = React.useRef(null);
    const [time, setTime] = useState(new Date());
    const [startFormat, setStartFormat] = useState(0);
    const [endFormat, setEndFormat] = useState(0);
    const [startClipFormat, setStartClipFormat] = useState(0);

    useEffect(() => {
        dispatch(selectThumbnail(selectState));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectState]);

    useEffect(() => {
        if (startTime) {
            if (timerID > 0) {
                clearInterval(timerID);
            }
            let timer_id = setInterval(increase, 1000)
            setTimerID(timer_id);
            setStartFormat(parseInt(GetMinute(new Date(startTime))))
            setStartClipFormat(parseInt(GetMinute(new Date(startClipTime))))
            if (endTime) {
                setEndFormat(parseInt(GetMinute(new Date(endTime))) + 1)
            }
            if (playerRef.current) {
                playerRef.current.currentTime = playerRef.current.currentTime + getBetweenDate(startClipTime, startTime);
            }
        }
        let status = 0;
        setStatus(status);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startTime]);

    useEffect(() => {
        if (timerEID > 0) {
            clearInterval(timerEID);
        }
        let timer_id = setInterval(onlineStateCapture, 1000)
        setTimerEID(timer_id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const handleChange = (e) => {
        if (playerRef.current.duration) {
            playerRef.current.currentTime = e.target.value / 100 * playerRef.current.duration;
        }

        playVideo();
    }


    const GoLiveVideo = () => {
        dispatch(GetLiveVideo(camera.id))
    }

    const GoVodVideo = () => {
        dispatch(getThumbnail(camera.id, filterStartTime, filterEndTime, filterDuration));
    }

    const previousClick = () => {
        if (mode === "VOD") {
            if (parseInt(selected) && parseInt(selected) > 0) {
                let start = subThumbnails[parseInt(selected) - 1][0].time2str;
                dispatch({ type: GET_SUB_URL, payload: subThumbnails[parseInt(selected) - 1][0].path });
                let end = subThumbnails[parseInt(selected) - 1][subThumbnails[parseInt(selected) - 1].length - 1].time2str
                dispatch({ type: START_TIME_GROUP, payload: start });
                dispatch({ type: START_CLIPTIME_GROUP, payload: start });
                dispatch({ type: SET_ENDTIME, payload: end });
                dispatch(GetVodVideo(camera.id, start, end));
                dispatch(selectThumbnail(parseInt(selected) - 1));
            }
            let status = 0;
            setStatus(status);
        }
    }

    const nextClick = () => {
        if (mode === "VOD") {
            if (parseInt(selected) < subThumbnails.length - 1) {
                let start = subThumbnails[parseInt(selected) + 1][0].time2str;
                dispatch({ type: GET_SUB_URL, payload: subThumbnails[parseInt(selected) + 1][0].path });
                let end = subThumbnails[parseInt(selected) + 1][subThumbnails[parseInt(selected) + 1].length - 1].time2str
                dispatch({ type: START_TIME_GROUP, payload: start });
                dispatch({ type: START_CLIPTIME_GROUP, payload: start });
                dispatch({ type: SET_ENDTIME, payload: end });
                dispatch(GetVodVideo(camera.id, start, end));
                setSelectState(parseInt(selected) + 1);
            }
            let status = 0;
            setStatus(status);
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
        a.setAttribute('href', "/share/playlist.m3u8");
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

    function addSeconds(date) {
        if (playerRef.current) {
            date.setSeconds(date.getSeconds() + playerRef.current.currentTime);
        }
        return date;
    }

    function increase() {
        // timeUpdate()
        // timeDuration()
        setTime(new Date(addSeconds(new Date(startClipTime))));
    }

    function onlineStateCapture(){
        if(mode === "LIVE"){ 
            dispatch(getCamerasOnline(camera.id, mode))
        }
    }

    function playVideo() {
        if (playerRef.current.duration) {
            playerRef.current.play();
        }
        let status = 0;
        setStatus(status);
    }

    // const timeUpdate = () => {
    //     const minutes = Math.floor(playerRef.current.currentTime / 60);
    //     const seconds = Math.floor(playerRef.current.currentTime - minutes * 60);
    //     const currentTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
    //     setCurrentTime(currentTime);
    // }

    // const timeDuration = () => {
    //     const minutes = Math.floor(playerRef.current.duration / 60);
    //     const seconds = Math.floor(playerRef.current.duration - minutes * 60);
    //     const currentTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
    //     if (playerRef.current.duration) {
    //         setDurationTime(currentTime);
    //     } else {
    //         setDurationTime("00:00");
    //     }
    // }

    // const str_pad_left = (string, pad, length) => {
    //     return (new Array(length + 1).join(pad) + string).slice(-length);
    // }

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
            if (playerRef.current.duration) {
                playerRef.current.currentTime = playerRef.current.duration;
            }
        }
    }

    function pauseVideo() {
        if (playerRef.current.duration) {
            playerRef.current.pause();
        }
        let status = 1;
        setStatus(status);
    }

    let width, height;
    if (document.getElementById('wrapper')) {
        width = (document.getElementById('wrapper').clientWidth) * 0.9;
        height = (document.getElementById('wrapper').clientWidth) * 0.45;
    }

    const marks = [
        {
            value: 0,
            label: `${TimeFormat(new Date(startTime))}:00`,
        },
        {
            value: 5,
            label: `${TimeFormat(new Date(startTime))}:05`,
        },
        {
            value: 10,
            label: `${TimeFormat(new Date(startTime))}:10`,
        },
        {
            value: 15,
            label: `${TimeFormat(new Date(startTime))}:15`,
        },
        {
            value: 20,
            label: `${TimeFormat(new Date(startTime))}:20`,
        },
        {
            value: 25,
            label: `${TimeFormat(new Date(startTime))}:25`,
        },
        {
            value: 30,
            label: `${TimeFormat(new Date(startTime))}:30`,
        },
        {
            value: 35,
            label: `${TimeFormat(new Date(startTime))}:35`,
        },
        {
            value: 40,
            label: `${TimeFormat(new Date(startTime))}:40`,
        },
        {
            value: 45,
            label: `${TimeFormat(new Date(startTime))}:45`,
        },
        {
            value: 50,
            label: `${TimeFormat(new Date(startTime))}:50`,
        },
        {
            value: 55,
            label: `${TimeFormat(new Date(startTime))}:55`,
        },
        {
            value: 60,
            label: `${TimeFormatAdd(new Date(startTime))}:00`,
        },

    ];

    return (
        <div>
            <div className="videoview">
                <div className="Modetext">{mode === "LIVE" ? "Live Video Mode" : "Vod Video Mode"}</div>
                {mode === "VOD" ?
                    <div className="liveButton">
                        <ThemeProvider theme={theme}>
                            <Button variant="contained" onClick={GoLiveVideo}>Go To Live</Button>
                        </ThemeProvider>
                    </div> : 
                    <div className="liveButton">
                        <ThemeProvider theme={theme}>
                            <Button variant="contained" onClick={GoVodVideo}>Go To Vod</Button>
                        </ThemeProvider>
                    </div>}
                <div id="wrapper" >
                    {
                        thumbnails[0] && mode === "VOD"?
                            <img src={sub_Url}
                                alt="img"
                                prop="prop"
                                className="grey"
                                height={height}></img> : mode === "VOD" ? <div style={{ marginTop: "20%", marginLeft: "30%" }}><font size={10} style={{ color: "#888888" }}><b>No Data!</b></font></div> 
                                :<></>
                    }   
                    {
                         mode === "LIVE" && cameraStatus.flag === "NO" ?
                         <div>
                            <img src={cameraStatus.path}
                                alt="img"
                                prop="prop"
                                className="grey2"
                                height={height}></img> 
                            <div className="grey1"
                                style={{'height': height}}></div></div>:<></>
                    }
                    <div className="show">
                        <ReactHlsPlayer
                            key={`${selected}${startTime}`}
                            src={video}
                            autoPlay={true}
                            controls={false}
                            width={width}
                            height={height}
                            playerRef={playerRef}
                        />
                    </div>
                </div>
            </div>
            {(mode === "VOD") && (thumbnails[0]) ?
                <ThemeProvider theme={theme}>
                    <AppBar position="static" className="playcontrols" color="primary">
                        <Grid container spacing={0} >
                            <Grid item xs={1} >
                                <div style={{ marginTop: 5, marginLeft: 10 }}>
                                    {`${TimelineFormat1(new Date(startClipTime))}`}
                                </div>
                            </Grid>
                            <Grid item xs={10} >
                                <ThemeProvider theme={themeSlider}>
                                    <Slider
                                        aria-label= "Temp"
                                        value={playerRef.current.currentTime / playerRef.current.duration * 100 ? playerRef.current.currentTime / playerRef.current.duration * 100 : 0}
                                        onChange={(e) => handleChange(e)}
                                        sx={{ marginLeft: '4%', width: '92%' }}
                                        color="primary"
                                    />
                                </ThemeProvider>
                            </Grid>
                            <Grid item xs={1} >
                                <div style={{ marginTop: 5, marginRight: 10 }}>
                                    {`${TimelineFormat2(new Date(endTime))}`}
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} >
                            <Grid item xs={5.3} className="nextdate">
                                <SkipPreviousRounded cursor="pointer" sx={{ marginLeft: 2 }} fontSize="large" onClick={() => previousClick()} />
                                {status === 1 ? <PlayCircleOutlineRounded cursor="pointer" fontSize="large" onClick={() => playVideo()} />
                                    : <PauseCircleOutlineRounded cursor="pointer" fontSize="large" onClick={pauseVideo} />}
                                <SkipNextRounded cursor="pointer" fontSize="large" onClick={() => nextClick()} />

                                <font size="2" style={{ marginLeft: 10, width: "10%" }}>
                                    <b>{DateTime(time)}</b>
                                    {/* <b>{`${currentTime}` + "/" + `${durationTime}`}</b> */}
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
                    <AppBar position="static" className="subPlaycontrol" color="primary">
                        <ThemeProvider theme={themesubSlider}>
                            <Grid container spacing={0} >
                                <Grid item xs={1} sx={{ marginLeft: 2, marginTop: 1 }}>
                                    <font size="2" >
                                        <b>{DateStartTime(new Date(startTime))}</b>
                                    </font>
                                </Grid>
                                <Grid item xs={10.5}>
                                    <Slider
                                        key={`slider-${startClipFormat}-${startFormat}-${endFormat}`}
                                        // defaultValue={[startFormat, endFormat]}
                                        value={[startClipFormat, startFormat, endFormat]}
                                        step={1}
                                        marks={marks}
                                        max={60}
                                        sx={{ marginLeft: '3%', width: '96%' }}
                                        color="primary"
                                        // disabled = {true}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </ThemeProvider>
                    </AppBar>
                </ThemeProvider>
                : <></>}
        </div>
    );
}

export default HLSPlayer;
