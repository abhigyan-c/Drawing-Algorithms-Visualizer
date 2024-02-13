import React, { useState } from 'react';
import './LineDrawingApp.css'; 


function ddaLine(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const xIncrement = dx / steps;
  const yIncrement = dy / steps;

  let points = [];
  let x = x1;
  let y = y1;
  for (let i = 0; i <= steps; i++) {
    points.push({ x: Math.round(x), y: Math.round(y) });
    x += xIncrement;
    y += yIncrement;
  }
  return points;
}

const LineDrawingApp = () => {
  const [buttonClicked, setButtonClicked] = useState(false);

  const [x1, setX1] = useState(50); 
  const [y1, setY1] = useState(50); 
  const [x2, setX2] = useState(100); 
  const [y2, setY2] = useState(100); 
  const [algorithm, setAlgorithm] = useState('dda');
  const [points, setPoints] = useState([]);
  const [scale, setScale] = useState(1);

  const drawLine = () => {
    setPoints([]);
    if (algorithm === 'dda') {
      setButtonClicked(true);
      const linePoints = ddaLine(x1, y1, x2, y2);
      setPoints(linePoints);
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lineLength = Math.sqrt(dx * dx + dy * dy);
      setScale(lineLength < 50 ? 50 / lineLength : 1);
    }
  };

  return (
    <div className="container" style={{ background: 'linear-gradient(to bottom, #4b6cb7, #182848)' }}>
      <h1>Line Drawing App</h1>
      <div className="menu">
        <div className="input-container">
          <label htmlFor="x1">X1:</label>
          <input type="number" id="x1" value={x1} onChange={(e) => setX1(parseInt(e.target.value))} />
        </div>
        <div className="input-container">
          <label htmlFor="y1">Y1:</label>
          <input type="number" id="y1" value={y1} onChange={(e) => setY1(parseInt(e.target.value))} />
        </div>
        <div className="input-container">
          <label htmlFor="x2">X2:</label>
          <input type="number" id="x2" value={x2} onChange={(e) => setX2(parseInt(e.target.value))} />
        </div>
        <div className="input-container">
          <label htmlFor="y2">Y2:</label>
          <input type="number" id="y2" value={y2} onChange={(e) => setY2(parseInt(e.target.value))} />
        </div>
        <div className="input-container">
          <label htmlFor="algorithm">Algorithm:</label>
          <select id="algorithm" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="dda">DDA</option>
            
          </select>
        </div>
        <br></br>
        <button onClick={drawLine}>Draw Line</button>
      </div>
      <div className="content">
        <div className="canvas-container">
          <canvas
            className="canvas"
            width={1600}
            height={1200}
            style={{ border: '1px solid black', background: 'white' }}
            ref={(canvas) => {
              if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Draw grid lines
                ctx.beginPath();
                for (let x = 0.5; x < canvas.width; x += 20) {
                  ctx.moveTo(x, 0);
                  ctx.lineTo(x, canvas.height);
                }
                for (let y = 0.5; y < canvas.height; y += 20) {
                  ctx.moveTo(0, y);
                  ctx.lineTo(canvas.width, y);
                }
                ctx.strokeStyle = '#ccc';
                ctx.stroke();
points.forEach((point, index) => {
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(point.x * scale, point.y * scale, 3, 0, 2 * Math.PI);
  ctx.fill();
  if (index > 0) {
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(points[index - 1].x * scale, points[index - 1].y * scale);
    ctx.lineTo(point.x * scale, point.y * scale);
    ctx.setLineDash([2, 2]);
    ctx.stroke();
  }
});

if(buttonClicked) {
ctx.fillStyle = 'black';
ctx.fillText(`(${x1}, ${y1})`, x1 * scale + 5, y1 * scale - 5);
ctx.fillText(`(${x2}, ${y2})`, x2 * scale + 5, y2 * scale - 5);
}
              }
            }}
          ></canvas>
        </div>
        <div className="table-section">
          <table className="table-border">
            <thead>
              <tr>
                <th>X</th>
                <th>Y</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point, index) => (
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
