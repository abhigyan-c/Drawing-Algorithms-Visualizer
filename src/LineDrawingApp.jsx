import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LineDrawingApp.css';
import { Stage, Layer, Line, Circle, Text } from "react-konva";

const gridSize = 15; // Size of each grid square
const gridColor = 'lightgrey';
const canvasWidth = 1200;
const canvasHeight = 1200;
let tablePoints = [];

const Gridlines = () => {
  const lines = [];

  // Create vertical gridlines
  for (let x = 0; x <= canvasWidth; x += gridSize) {
    lines.push(<Line key={`v_${x}`} points={[x, 0, x, canvasHeight]} stroke={gridColor} />);
  }

  // Create horizontal gridlines
  for (let y = 0; y <= canvasHeight; y += gridSize) {
    lines.push(<Line key={`h_${y}`} points={[0, y, canvasWidth, y]} stroke={gridColor} />);
  }

  return <>{lines}</>;
}; 

function ddaLine(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const xIncrement = dx / steps;
  const yIncrement = dy / steps;

  let points = [];
  let x = x1;
  let y = y1;
  tablePoints.length = 0;
  for (let i = 0; i <= steps; i++) {
    tablePoints.push({x: Math.round(x), y: Math.round(y)});
    points.push({ x: Math.round(x * 10) + (canvasWidth / 2), y: Math.round(-y * 10) + (canvasHeight/2) });
    x += xIncrement;
    y += yIncrement;
  }
  
  
  return points;
}

function bresenhamLine(x1, y1, x2, y2) {
  let x = x1;
  let y = y1;
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  let p = (2 * dy) - dx;
  let points = [];
  tablePoints.length = 0;
  while(x <= x2) {
    tablePoints.push({x: x, y: y});
    points.push({x: x * 10 + (canvasWidth / 2), y: -y * 10 + (canvasHeight/2)});
    x++;
    if(p <= 0)
      p = p + (2 * dy);
    else {
      p = p + (2 * dy) - (2 * dx);
      y++;
    }
  }
  console.log(points)
  return points;
}


function midPointLine(x1, y1, x2, y2) {
  let x = x1;
  let y = y1;
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  let p = (2 * dy) - dx;
  let points = [];
  tablePoints.length = 0;
  while(x <= x2) {
    tablePoints.push({x: x, y: y});
    points.push({x: x * 10 + (canvasWidth / 2), y: -y * 10 + (canvasHeight/2)});
    if(p < 0) {
      p += dy;
    }
    else {
      p = p + dy - dx;
      y++;
    }
    x++;
  }
  return points;
}

const LineDrawingApp = () => {
  const [x1, setX1] = useState(0);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(30);
  const [y2, setY2] = useState(30);
  const [points, setPoints] = useState([]);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationInterval, setAnimationInterval] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [algorithm, setAlgorithm] = useState('DDA');
  const [scale, setScale] = useState(1); // State to keep track of the canvas scale
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      clearInterval(animationInterval);
    };
  }, [animationInterval]);

  useEffect(() => {
    drawLine();
  }, [x1, y1, x2, y2, algorithm]);
  
  useEffect(() => {
    animateDrawing();
  }, [points]);

  

  const animateDrawing = () => {
    if (!points) return; // Check if points is not null or undefined
    
    const interval = setInterval(() => {
      if (animationStep < points.length) {
        setAnimationStep(prevStep => prevStep + 1);
      } else {
        clearInterval(interval);
      }
    }, 100);
  
    setAnimationInterval(interval);
  };

  
  const drawLine = () => {
    setButtonPressed(true);
    setAnimationStep(0);
    tablePoints = [];
  
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
      toast.error('Please enter all coordinates.');
      return;
    }
  
    let linePoints = [];
    if (algorithm === 'DDA') {
      linePoints = ddaLine(x1, y1, x2, y2);
    } else if (algorithm === 'BresenhamLine') {
      linePoints = bresenhamLine(x1, y1, x2, y2);
    } else if (algorithm === 'MidPointLine') {
      linePoints = midPointLine(x1, y1, x2, y2);
    }
  
    setPoints(linePoints);
  
    animateDrawing(linePoints);

    if (x1 === '' || y1 === '' || x2 === '' || y2 === '') {
      tablePoints = [];
    }
  };
  


  const DrawPoints = ({ linePoints, algorithm }) => {
    if (buttonPressed) {
      let circleArray = [];
      if (algorithm === "DDA") {
        circleArray = linePoints;
      } else if (algorithm === "BresenhamLine") {
        circleArray = linePoints;
      } else if (algorithm === "MidPointLine") {
        circleArray = linePoints;
      }
      const p = [];
      for (let i = 0; i < circleArray.length; i++) {
        p.push(<Circle key={i} x={circleArray[i].x} y={circleArray[i].y} radius={2} fill="black" opacity={1} />);
      }
      return <>{p}</>;
      
    }
    return null;
  };
  
  
  return (
    <div className="container" style={{ background: 'linear-gradient(to right, darkslategray, darkviolet)' }}>
      <h1>Line Drawing Algorithms</h1>
      <div className="menu">
  <div className="input-group">
    <label htmlFor="x1">X1:</label>
    <input type="number" id="x1" value={x1} onChange={(e) => setX1(e.target.value === '' ? '' : parseInt(e.target.value))} />
  </div>
  <div className="input-group">
    <label htmlFor="y1">Y1:</label>
    <input type="number" id="y1" value={y1} onChange={(e) => setY1(e.target.value === '' ? '' : parseInt(e.target.value))} />
  </div>
  <div className="input-group">
    <label htmlFor="x2">X2:</label>
    <input type="number" id="x2" value={x2} onChange={(e) => setX2(e.target.value === '' ? '' : parseInt(e.target.value))} />
  </div>
  <div className="input-group">
    <label htmlFor="y2">Y2:</label>
    <input type="number" id="y2" value={y2} onChange={(e) => setY2(e.target.value === '' ? '' : parseInt(e.target.value))} />
  </div>
  <div className="input-group">
    <label htmlFor="algo">Algorithm:</label>
    <select id="algo" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
      <option value="DDA">Digital Differential Analyzer</option>
      <option value="BresenhamLine">Bresenham Line Drawing Algorithm</option>
      <option value="MidPointLine">Mid Point Line Drawing Algorithm</option>
    </select>
  </div>
        <br></br>
        {/* <button onClick={drawLine}>Draw Line</button> */}
      </div>

      <div className="content">
        <div className='canvas-section'>
          <Stage width={canvasWidth} height={canvasHeight} className='stage'>
            <Layer clearBeforeDraw = {true} >
              <Gridlines />
              <Line
                x={0}
                y={0}
                points={points.slice(0, animationStep).flatMap(point => [point.x, point.y])}
                tension={0.5}
                closed
                stroke="black"
              />

                {points.length > 0 && (
                <>
                  <Text
  text={`(${tablePoints.length > 0 ? tablePoints[0].x : ''}, ${tablePoints.length > 0 ? tablePoints[0].y : ''})`}
  x={points.length > 0 ? points[0].x - 20 : 0}
  y={points.length > 0 ? points[0].y + 10 : 0}
  fontSize={12}
/>
<Text
  text={`(${tablePoints.length > 0 ? tablePoints[tablePoints.length - 1].x : ''}, ${tablePoints.length > 0 ? tablePoints[tablePoints.length - 1].y : ''})`}
  x={points.length > 0 ? points[points.length - 1].x : 0}
  y={points.length > 0 ? points[points.length - 1].y - 20 : 0}
  fontSize={12}
/>


                </>
              )}
                
                
                <DrawPoints linePoints={points} algorithm={algorithm} />

              
            </Layer>
          </Stage>
        </div>

        <div className="table-section">
          <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          <table className="table-border">
            <thead>
              <tr>
                <th>X</th>
                <th>Y</th>
              </tr>
            </thead>
            <tbody>
              {tablePoints.map((point, index) => (
                <tr key={index}>
                  <td>{point.x}</td>
                  <td>{point.y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default LineDrawingApp;
