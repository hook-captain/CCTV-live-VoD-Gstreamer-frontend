import React, { useState, useEffect } from "react";

import {
  AppBar,
  Grid,
  Button,
  createTheme,
  ThemeProvider,
  Slider,
  Switch,
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
  FastForwardRounded,
} from "@mui/icons-material";

import ReactHlsPlayer from "react-hls-player";
import { useDispatch, useSelector } from "react-redux";
import {
  START_TIME_GROUP,
  GET_SUB_URL,
  SET_ENDTIME,
  START_CLIPTIME_GROUP,
  POLYGON_SET_ONE,
} from "../redux/types";
import {
  GetVodVideo,
  selectThumbnail,
  GetLiveVideo,
  getCamerasOnline,
  getThumbnail,
  GetDownloadUrl,
  createPolygons,
  getPolygons,
  updatePolygons,
  deletePolygons,
} from "../actions/action";
import "../public/App.css";
import { findDOMNode } from "react-dom";
import screenfull from "screenfull";
import captureVideoFrame from "capture-video-frame";
import DrawCanvas from "./DrawCanvas";
import Canvas from "./Canvas";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D9D9D9",
    },
  },
});

const themeSlider = createTheme({
  palette: {
    primary: {
      main: "#575774",
    },
  },
});

const themesubSlider = createTheme({
  palette: {
    primary: {
      main: "#e7944d",
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
    } else {
      if (CurrentTime.getHours() < 10) {
        Hour = `0${CurrentTime.getHours()}:00AM`;
      } else {
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

  const DateTime1 = (Dates) => {
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

    result = `${CurrentTime.getFullYear()}-${Month}-${Day} ${Hour}:${Min}:${second}`;
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
      Hour = `00`;
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

  const GetPreTimeFormat = (Dates) => {
    let time = Dates;
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    return time;
}

  const AddMinute = (Dates, minute) => {
      let time = Dates;
      time.setMinutes(time.getMinutes() + minute);
      return time;
  }

  const TimelineFormat1 = (Dates) => {
    let Hour, Min, result;
    let time = new Date(Dates);

    if (time.getMinutes() < 10) Min = `0${time.getMinutes()}`;
    else Min = `${time.getMinutes()}`;

    if (time.getHours() > 12) {
      Hour = `${time.getHours() - 12}:${Min}PM`;
    } else {
      if (time.getHours() < 10) {
        Hour = `0${time.getHours()}:${Min}AM`;
      } else {
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
    } else {
      if (time.getHours() < 10) {
        Hour = `0${time.getHours()}:${Min}AM`;
      } else {
        if (time.getHours() === 12) {
          Hour = `${time.getHours()}:${Min}PM`;
        } else {
          Hour = `${time.getHours()}:${Min}AM`;
        }
      }
    }

    if (time.getMinutes() === 59) {
      if (time.getHours() > 11) {
        if (time.getHours() === 23) {
          Hour = `00:00AM`;
        } else {
          Hour = `${time.getHours() - 11}:00PM`;
        }
      } else {
        if (time.getHours() < 9) {
          Hour = `0${time.getHours() + 1}:00AM`;
        } else {
          if (time.getHours() === 11) {
            Hour = `${time.getHours() + 1}:00PM`;
          } else {
            Hour = `${time.getHours() + 1}:00AM`;
          }
        }
      }
    }

    result = `${Hour}`;
    return result;
  };

  const getBetweenDate = (Date1, Date2) => {
    return parseInt(
      (new Date(Date2).getTime() - new Date(Date1).getTime()) / 1000
    );
  };

  const camera = useSelector((state) => state.camera.camera);
  const polygons = useSelector((state) => state.polygon.polygons);
  const polygon = useSelector((state) => state.polygon.polygon);

  const [polygon_state, setPolygonState] = useState({});
  const [showCanvas, setShowCanvas] = useState(false);
  const [showCanvasPane, setCanvasPane] = useState(false);

  const [updateDesc, setUpdateDesc] = useState("");
  const [indexDesc, setIndexDesc] = useState(-1);

  const cameraStatus = useSelector((state) => state.camera.cameraStatus);
  const mode = useSelector((state) => state.video.mode);
  const video = useSelector((state) => state.video.video);
  const filterStartTime = useSelector(
    (state) => state.thumbnail.searchKey.starttime
  );
  const filterEndTime = useSelector(
    (state) => state.thumbnail.searchKey.endtime
  );
  const filterDuration = useSelector(
    (state) => state.thumbnail.searchKey.duration
  );
  // const link = useSelector((state) => state.video.downloadUrl);
  const {
    selected,
    startTime,
    startClipTime,
    endTime,
    subThumbnails,
    sub_Url,
    thumbnails,
  } = useSelector((state) => state.thumbnail);
  const dispatch = useDispatch();
  const [status, setStatus] = useState(0);
  const [timerID, setTimerID] = useState(0);
  const [timerEID, setTimerEID] = useState(0);
  const [selectState, setSelectState] = useState(0);
  const playerRef = React.useRef(null);
  const [time, setTime] = useState(new Date());
  // const [startFormat, setStartFormat] = useState(0);
  const [endFormat, setEndFormat] = useState(0);
  const [startClipFormat, setStartClipFormat] = useState(0);
  const [download, setdownload] = useState(false);
  const [points, setPoint] = useState({});
  const [realPoints, setRealPoints] = useState([]);
  const [sliderValue, setSliderValue] = useState([startClipFormat, endFormat]);
  localStorage.setItem('delay1',true);
  localStorage.setItem('delay2',true);
  localStorage.setItem('delay3',true);
  localStorage.setItem('Latency',true);

  useEffect(() => {
    dispatch(selectThumbnail(selectState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectState]);

  useEffect(() => {
    setSliderValue([startClipFormat, endFormat-1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startClipFormat, endFormat]);

  useEffect(() => {
      setTime(new Date(startClipTime));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startClipTime]);

  useEffect(() => {
    if (camera.id !== undefined) {
      dispatch(getPolygons(camera.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera]);

  useEffect(() => {
    setPoint(polygons);
  }, [polygons]);

  const onChange = (data) => {
    setPoint(data);
    const entries = Object.entries(data);
    // dispatch(
    //   createPolygons(camera.id, entries[1][0], desc, entries[1][1].toString())
    // );
    if(entries[1]!==undefined){
      let pair = entries[1][1][entries[1][1].length-1];
      let x = pair[0] / 0.89 /width;
      let y = pair[1]/height;

      let tmpPoints = realPoints;
      tmpPoints.push([x.toFixed(4), y.toFixed(4)])

      setRealPoints(tmpPoints)

    }
  };

  const onPointSubmit = (desc) => {
    const entries = Object.entries(points);
    dispatch(
      createPolygons(camera.id, entries[1][0], desc, realPoints.toString())
    );
    setRealPoints([]);
  };

  useEffect(() => {
    setPolygonState(polygon);
  }, [polygon]);

  const clickList = (e) => {
    if (e.target.value !== "none") {
      setCanvasPane(true);
      setUpdateDesc(polygons[e.target.value].desc);
      setIndexDesc(polygons[e.target.value].id);
      dispatch({
        type: POLYGON_SET_ONE,
        payload: {
          name: e.target.value,
          polygons: polygons[e.target.value]["points"],
        },
      });
      // alert(polygons[e.target.value].toString())
    } else {
      setCanvasPane(false);
    }
  };

  const draw = (ctx, frameCount) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    // ctx.moveTo(10, 10);
    // ctx.lineTo(100,50);
    // ctx.lineTo(50, 100);
    // ctx.lineTo(0, 90);
    let flag = true;
    polygon.map((item) => {
      if (flag) {
        ctx.moveTo(item[0]*ctx.canvas.width, item[1]*ctx.canvas.height);
        flag = !flag;
      } else {
        ctx.lineTo(item[0]*ctx.canvas.width, item[1]*ctx.canvas.height);
      }
    });
    ctx.closePath();
    ctx.fill();
  };

  useEffect(() => {
    if (startTime) {
      if (timerID > 0) {
        clearInterval(timerID);
      }
      let timer_id = setInterval(increase, 1000);
      setTimerID(timer_id);
      // setStartFormat(parseInt(GetMinute(new Date(startTime))));
      setStartClipFormat(parseInt(GetMinute(new Date(startClipTime))));
      if (endTime) {
        setEndFormat(parseInt(GetMinute(new Date(endTime))) + 1);
      }
      if (playerRef.current) {
        playerRef.current.currentTime =
          playerRef.current.currentTime +
          getBetweenDate(startClipTime, startTime);
      }
    }
    let status = 0;
    setStatus(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, startClipTime]);

  useEffect(() => {
    if (timerEID > 0) {
      clearInterval(timerEID);
    }
    let timer_id = setInterval(onlineStateCapture, 1000);
    setTimerEID(timer_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const downloadButtonPanel = async () =>{
    if(localStorage.getItem('Latency')==='true')
    {
        await localStorage.setItem('Latency',false)
        await setTimeout(()=>{
            setdownload(false);
            localStorage.setItem('Latency', true);
        }, (new Date(endTime).getTime()-new Date(startClipTime).getTime())/120);
    }   
  }

  const handleChange = (e) => {
    if (playerRef.current.duration) {
      playerRef.current.currentTime =
        (e.target.value / 100) * playerRef.current.duration;
    }

    playVideo();
  };

  const GetVideo = () => {
    dispatch(GetVodVideo(camera.id, startTime, endTime, mode, video));
  }

  const GoLiveVideo = () => {
    dispatch(GetLiveVideo(camera.id, mode, video));
  };

  const GoVodVideo = () => {
    dispatch(
      getThumbnail(
        camera.id,
        filterStartTime,
        filterEndTime,
        filterDuration,
        mode,
        video
      )
    );
  };

  const previousClick = () => {
    if (mode === "VOD") {
      if (parseInt(selected) && parseInt(selected) > 0) {
        let start = subThumbnails[parseInt(selected) - 1][0].time2str;
        dispatch({
          type: GET_SUB_URL,
          payload: subThumbnails[parseInt(selected) - 1][0].path,
        });
        let end =
          subThumbnails[parseInt(selected) - 1][
            subThumbnails[parseInt(selected) - 1].length - 1
          ].time2str;
        dispatch({ type: START_TIME_GROUP, payload: start });
        dispatch({ type: START_CLIPTIME_GROUP, payload: start });
        dispatch({ type: SET_ENDTIME, payload: end });
        GetVideo();
        dispatch(selectThumbnail(parseInt(selected) - 1));
      }
      let status = 0;
      setStatus(status);
    }
  };

  const nextClick = () => {
    if (mode === "VOD") {
      if (parseInt(selected) < subThumbnails.length - 1) {
        let start = subThumbnails[parseInt(selected) + 1][0].time2str;
        dispatch({
          type: GET_SUB_URL,
          payload: subThumbnails[parseInt(selected) + 1][0].path,
        });
        let end =
          subThumbnails[parseInt(selected) + 1][
            subThumbnails[parseInt(selected) + 1].length - 1
          ].time2str;
        dispatch({ type: START_TIME_GROUP, payload: start });
        dispatch({ type: START_CLIPTIME_GROUP, payload: start });
        dispatch({ type: SET_ENDTIME, payload: end });
        GetVideo();
        setSelectState(parseInt(selected) + 1);
      }
      let status = 0;
      setStatus(status);
    }
  };

  const onClickFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.request(findDOMNode(playerRef.current));
    }
  };

  const onClickDownload = () => {
    // dispatch(GetDownloadUrl(video.split("/")[3]));
    setdownload(true);
    let url = GetDownloadUrl(video.split("/")[3]);
    url.then((res) => {
      let skillName = "playlist";
      let xhr = new XMLHttpRequest();
      xhr.open("GET", `${res}`, true);
      xhr.responseType = "blob";
      xhr.onload = function () {
        let urlCreator = window.URL || window.webkitURL;
        let videoUrl = urlCreator.createObjectURL(this.response);
        let tag = document.createElement("a");
        tag.href = videoUrl;
        tag.target = "_blank";
        tag.download = skillName.includes(".mp4")
          ? skillName
          : skillName + ".mp4";
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
        downloadButtonPanel()
      };
      xhr.onerror = (err) => {};
      xhr.send();
    });
  };

  const onClickScreenShot = () => {
    const frame = captureVideoFrame(playerRef.current);
    downloadImage(frame.dataUri);
  };

  function downloadImage(dataUri) {
    const a = document.createElement("a");
    a.setAttribute("download", "reactflow.png");
    a.setAttribute("href", dataUri);
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

    if( playerRef.current.currentTime === playerRef.current.duration ){
      pauseVideo();
    }
  }

  function onlineStateCapture() {
    if (mode === "LIVE") {
      dispatch(getCamerasOnline(camera.id, mode));
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
    if(playerRef.current.currentTime !== playerRef.current.duration){
      playVideo();
    }
    
    if (playerRef.current.currentTime > 10) {
      playerRef.current.currentTime = playerRef.current.currentTime - 10;
    } else {
      playerRef.current.currentTime = 0;
    }
  };

  const onClickFastForward = () => {
    if(playerRef.current.currentTime !== playerRef.current.duration){
      playVideo();
    }

    if (playerRef.current.duration - playerRef.current.currentTime > 10) {
      playerRef.current.currentTime = playerRef.current.currentTime + 10;
    } else {
      if (playerRef.current.duration) {
        playerRef.current.currentTime = playerRef.current.duration;
      }
    }
  };

  const  onSliderChange = async (event, newValue, activeThumb) => {
    let start, end, cnt1, cnt2;
    if (localStorage.getItem('delay3')==='true')
        {
           await localStorage.setItem('delay3',false)
           await setTimeout(()=>{
                console.log();
        }, 300);
    }   

    if (!Array.isArray(newValue)) {
        return;
    }

    cnt1 = Math.floor((new Date(thumbnails[thumbnails.length-1][thumbnails[thumbnails.length-1].length-1].time2str).getTime() - new Date(GetPreTimeFormat(new Date(startTime))).getTime())/60000)+1;
    cnt2 = Math.floor((new Date(thumbnails[0][0].time2str).getTime() - new Date(GetPreTimeFormat(new Date(startTime))).getTime())/60000);

    if (cnt1 < 60 && newValue[1] > cnt1){
        newValue[1] = cnt1;
    }

    if (cnt2 < 60 && newValue[0] < cnt2){
        newValue[0] = cnt2;
    }

    if (activeThumb === 0) {
        setSliderValue([Math.min(newValue[0], sliderValue[1] - 1), sliderValue[1]]);
      } else {
        setSliderValue([sliderValue[0], Math.max(newValue[1], sliderValue[0] + 1)]);
    }
         
    start = DateTime1(AddMinute(new Date(GetPreTimeFormat(new Date(startTime))), newValue[0]));
    end = DateTime1(AddMinute(new Date(GetPreTimeFormat(new Date(startTime))), newValue[1]));

    dispatch({ type: START_CLIPTIME_GROUP, payload: start });
    dispatch({ type: SET_ENDTIME, payload: end });

    dispatch(GetVodVideo(camera.id, start, end, mode, video));
  }

  function pauseVideo() {
    if (playerRef.current.duration) {
      playerRef.current.pause();
    }
    let status = 1;
    setStatus(status);
  }

  let width, height;
  if (document.getElementById("wrapper")) {
    width = document.getElementById("wrapper").clientWidth * 0.9;
    height = document.getElementById("wrapper").clientWidth * 0.45;
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
        <div className="Modetext">
          {mode === "LIVE" ? "Live Video Mode" : "Vod Video Mode"}
          <Switch
            onChange={() => {
              setShowCanvas(!showCanvas);
              setCanvasPane(false);
              dispatch({ type: POLYGON_SET_ONE, payload: [] });
            }}
          />
          {showCanvas ? (
            <>
              <select onChange={clickList}>
                <option key={"none"} value={"none"}>
                  {"--NONE--"}
                </option>
                {polygons.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item.desc}
                    </option>
                  );
                })}
              </select>
            </>
          ) : (
            <></>
          )}
          {showCanvas && showCanvasPane ? (
            <>
              <input
                type={"text"}
                onChange={(e) => {
                  setUpdateDesc(e.target.value);
                }}
                value={updateDesc}
              />
              <input
                type={"button"}
                onClick={() => {
                  updatePolygons(indexDesc, updateDesc);
                  dispatch(getPolygons(camera.id));
                }}
                value={"Update"}
              />
              <input
                type={"button"}
                onClick={() => {
                  deletePolygons(indexDesc);
                  dispatch(getPolygons(camera.id));
                }}
                value={"delete"}
              />
            </>
          ) : (
            <></>
          )}
        </div>
        {mode === "VOD" ? (
          <div className="liveButton">
            <ThemeProvider theme={theme}>
              <Button variant="contained" onClick={GoLiveVideo}>
                Go To Live
              </Button>
            </ThemeProvider>
          </div>
        ) : (
          <div className="liveButton">
            <ThemeProvider theme={theme}>
              <Button variant="contained" onClick={GoVodVideo}>
                Go To Vod
              </Button>
            </ThemeProvider>
          </div>
        )}
        <div id="wrapper">
          {showCanvas && !showCanvasPane ? (
            <div className="wrapper1">
              <DrawCanvas
                initialData={polygon_state}
                onChange={onChange}
                onSubmit={onPointSubmit}
                width={width * 0.89}
                height={height}
              />
            </div>
          ) : (
            <></>
          )}
          {showCanvas && showCanvasPane ? (
            <div className="wrapper1">
              <Canvas draw={draw} width={width * 0.89} height={height} />
            </div>
          ) : (
            <></>
          )}
          {thumbnails[0] && mode === "VOD" ? (
            <img
              src={sub_Url}
              alt="img"
              prop="prop"
              className="grey"
              height={height}
            ></img>
          ) : mode === "VOD" ? (
            <div style={{ marginTop: "20%", marginLeft: "30%" }}>
              <font size={10} style={{ color: "#888888" }}>
                <b>No Data!</b>
              </font>
            </div>
          ) : (
            <></>
          )}
          {mode === "LIVE" && cameraStatus.flag === "NO" ? (
            <div>
              <img
                src={cameraStatus.path}
                alt="img"
                prop="prop"
                className="grey2"
                height={height}
              ></img>
              <div className="grey1" style={{ height: height }}></div>
            </div>
          ) : (
            <></>
          )}
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
      {mode === "VOD" && thumbnails[0] ? (
        <ThemeProvider theme={theme}>
          <AppBar position="static" className="playcontrols" color="primary">
            <Grid container spacing={0}>
              <Grid item xs={1}>
                <div style={{ marginTop: 5, marginLeft: 10 }}>
                  {`${TimelineFormat1(new Date(startClipTime))}`}
                </div>
              </Grid>
              <Grid item xs={10}>
                <ThemeProvider theme={themeSlider}>
                  <Slider
                    aria-label="Temp"
                    value={
                      (playerRef.current.currentTime /
                        playerRef.current.duration) *
                      100
                        ? (playerRef.current.currentTime /
                            playerRef.current.duration) *
                          100
                        : 0
                    }
                    onChange={(e) => handleChange(e)}
                    sx={{ marginLeft: "4%", width: "92%" }}
                    color="primary"
                  />
                </ThemeProvider>
              </Grid>
              <Grid item xs={1}>
                <div style={{ marginTop: 5, marginRight: 10 }}>
                  {`${TimelineFormat2(new Date(endTime))}`}
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={0}>
              <Grid item xs={5.3} className="nextdate">
              <SkipPreviousRounded cursor="pointer" sx={{ marginLeft: 2 }} fontSize="large" onClick={async() => {
                    if(localStorage.getItem('delay2')==='true')
                    {
                        await localStorage.setItem('delay2',false)
                        await setTimeout(()=>{
                            previousClick();
                        },100);
                    }   
                }} />
                {status === 1 ? (
                  <PlayCircleOutlineRounded
                    cursor="pointer"
                    fontSize="large"
                    onClick={() => playVideo()}
                  />
                ) : (
                  <PauseCircleOutlineRounded
                    cursor="pointer"
                    fontSize="large"
                    onClick={pauseVideo}
                  />
                )}
                <SkipNextRounded cursor="pointer" fontSize="large" onClick={async() => {
                    if(localStorage.getItem('delay1')==='true')
                    {
                        await localStorage.setItem('delay1',false)
                        await setTimeout(()=>{
                            nextClick();
                        },100);
                    }                                   
                }} />

                <font size="2" style={{ marginLeft: 10, width: "10%" }}>
                  <b>{DateTime(time)}</b>
                  {/* <b>{`${currentTime}` + "/" + `${durationTime}`}</b> */}
                </font>
              </Grid>
              <Grid item xs={4}>
                <FastRewindRounded
                  cursor="pointer"
                  fontSize="large"
                  onClick={() => onClickFastRewind()}
                />{" "}
                <FastForwardRounded
                  cursor="pointer"
                  fontSize="large"
                  onClick={() => onClickFastForward()}
                />
              </Grid>
              <Grid item xs={1}>
                <AddAPhotoOutlined
                  cursor="pointer"
                  fontSize="large"
                  onClick={() => onClickScreenShot()}
                />
              </Grid>
              <Grid item xs={1}>
              {
                  download === false ? <FileDownloadOutlined cursor="pointer" fontSize="large" onClick={() => onClickDownload()} />:
                  <div className="loader" style={{marginLeft:"10%", marginTop:3}}></div>
              }
              </Grid>
              <Grid item xs={0.7}>
                <FullscreenOutlined
                  cursor="pointer"
                  fontSize="large"
                  onClick={() => onClickFullScreen()}
                />
              </Grid>
            </Grid>
          </AppBar>
          <AppBar position="static" className="subPlaycontrol" color="primary">
            <ThemeProvider theme={themesubSlider}>
              <Grid container spacing={0}>
                <Grid item xs={1} sx={{ marginLeft: 2, marginTop: 1 }}>
                  <font size="2">
                    <b>{DateStartTime(new Date(startTime))}</b>
                  </font>
                </Grid>
                <Grid item xs={10.5}>
                  <Slider
                    key={`slider-${startClipTime}-${endTime}`}
                    // defaultValue={[startFormat, endFormat]}
                    // value={[startClipFormat, startFormat, endFormat]}
                    value={sliderValue}
                    onChange={onSliderChange}
                    step={1}
                    marks={marks}
                    max={60}
                    sx={{ marginLeft: "3%", width: "96%" }}
                    color="primary"
                    // disabled = {true}
                    size="small"
                  />
                </Grid>
              </Grid>
            </ThemeProvider>
          </AppBar>
        </ThemeProvider>
      ) : (
        <></>
      )}
    </div>
  );
}

export default HLSPlayer;
