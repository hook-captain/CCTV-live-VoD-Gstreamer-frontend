import React, { useRef, useEffect, useState } from "react";

const DrawCanvas = (props) => {
  const { draw, ...rest } = props;
  const canvasRef = useRef(null);

  const [dragFlag, setDragFlag] = useState(-1);

  const MouseDown = (e) => {
    props.points.map((item, index) => {
      if (
        Math.abs(e.nativeEvent.offsetX - item[0]) <= 20 &&
        Math.abs(e.nativeEvent.offsetY - item[1]) <= 20
      ) {
        setDragFlag(index);
        console.log(index);
      }
    });
  };

  const MouseMove = (e) => {
    if (dragFlag >= 0) {
      let points = props.points;
      let real = props.real;

      points[dragFlag][0] = e.nativeEvent.offsetX;
      points[dragFlag][1] = e.nativeEvent.offsetY;

      let x = e.nativeEvent.offsetX / props.width
      let y = e.nativeEvent.offsetY / props.height

      real[dragFlag][0] = x.toFixed(4);
      real[dragFlag][1] = y.toFixed(4);

      props.changePoint(points);
      props.changeReal(real);
    }
  };

  const MouseUp = (e) => {
    setDragFlag(-1);
  };

  const MouseClick = (e) => {
    let points = props.points;
    let real = props.real
    let flag = true;

    props.points.map((item, index) => {
      if (
        Math.abs(e.nativeEvent.offsetX - item[0]) <= 10 &&
        Math.abs(e.nativeEvent.offsetY - item[1]) <= 10
      ) {
        flag = false;
      }
    });

    if (flag) {
      let x = e.nativeEvent.offsetX / props.width
      let y = e.nativeEvent.offsetY / props.height
      points.push([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
      real.push([x.toFixed(4), y.toFixed(4)])

      props.changePoint(points);
      props.changeReal(real);
    }
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      {...rest}
      onClick={MouseClick}
      onMouseDown={MouseDown}
      onMouseMove={MouseMove}
      onMouseUp={MouseUp}
      width={props.width}
      height={props.width}
    />
  );
};

export default DrawCanvas;
