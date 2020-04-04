import React, { useRef, useEffect, useState } from "react";

const Canvas = (props) => {
  const { draw, ...rest } = props;
  const canvasRef = useRef(null);

  const [dragFlag, setDragFlag] = useState(-1);
  const [polygonIndex, setPolygonIndex] = useState(-1);

  const MouseDown = (e) => {
    props.points.map((item, index) => {
      if (
        Math.abs(e.nativeEvent.offsetX - item[0] * props.width) <= 10 &&
        Math.abs(e.nativeEvent.offsetY - item[1] * props.height) <= 10
      ) {
        setDragFlag(index);
      }
    });
  };

  const MouseMove = (e) => {
    if (dragFlag >= 0) {
      let points = props.points;

      let x = e.nativeEvent.offsetX / props.width
      let y = e.nativeEvent.offsetY / props.height

      points[dragFlag][0] = x.toFixed(4);
      points[dragFlag][1] = y.toFixed(4);

      props.changePoint(points);
    }
  };

  const MouseUp = (e) => {
    setDragFlag(-1);
  };

  const pointInPolygon = function (polygon, point) {
    let wid = props.width, hei = props.height;
    //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
    let odd = false;
    //For each edge (In this case for each point of the polygon and the previous one)
    for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
        //If a line from the point into infinity crosses this edge
        if (((polygon[i][1] * hei > point[1]) !== (polygon[j][1] * hei > point[1])) // One point needs to be above, one below our y coordinate
            // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
            && (point[0] < ((polygon[j][0] * wid - polygon[i][0] * wid) * (point[1] - polygon[i][1] * hei) / (polygon[j][1] * hei - polygon[i][1] * hei) + polygon[i][0] * wid))) {
            // Invert odd
            odd = !odd;
        }
        j = i;

    }
    //If the number of crossings was odd, the point is in the polygon
    return odd;
  };


  const MouseClick = (e) => {

    props.multi.map((item, index) => {
      if(pointInPolygon(item.points, [e.nativeEvent.offsetX, e.nativeEvent.offsetY])){
        setPolygonIndex(index);
        props.changePoint(item.points)
        props.changeSelectedPoly(item.index)
      }
    });
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
      height={props.height}
    />
  );
};

export default Canvas;
