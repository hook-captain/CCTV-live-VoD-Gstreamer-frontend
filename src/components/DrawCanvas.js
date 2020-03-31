import { useEffect, useState } from "react";
import Canvas from "react-canvas-polygons";

const DrawCanvas = ({ initialData, onChange, onSubmit, width, height }, ref) => {
  const [tool, setTool] = useState("Line");
  const [desc, setDesc] = useState("");
  
  const handleCleanCanva = (e) => {
    e.stopPropagation();
    ref.cleanCanvas();
    setTool("Line");
    const timeout = setTimeout(() => setTool("Polygon"), 50);
    return () => clearTimeout(timeout);
  };

  const handleSubmit = (desc) => {
    onSubmit(desc);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setTool("Polygon"), 50);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div>
      <div style={{position:"absolute"}}><button
        variant="outlined"
        style={{ marginBottom: "20px" }}
        onClick={handleCleanCanva}
      >
        Clean
      </button>
      <button
        variant="outlined"
        style={{ marginBottom: "20px" }}
        onClick={()=>handleSubmit(desc)}
      >
        Add Polygon
      </button>
      <input type="text" value={desc} onChange={(e)=>{setDesc(e.target.value) ;console.log(e.target.value)}} />
      </div>
      <Canvas
        ref={(canvas) => (ref = canvas)}
        height={height}
        width={width}
        canUndo={true}
        tool={tool}
        color="blue"
        brushSize={4}
        onDataUpdate={(data) => onChange(data)}
        onFinishDraw={() => console.log("finish draw")}
        initialData={initialData}
        
      />
    </div>
  );
};

export default DrawCanvas;
