import React, { useEffect, useState } from 'react';
import Car, { CarProps } from './Car';
import './styles.css';

const SelfDrivingCar = () => {
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight - 60);
  const canvasRef = React.createRef<HTMLCanvasElement>();
  const handleWindowSizeChange = () => {
    setCanvasHeight(window.innerHeight - 60);
  };
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
  });
  const CarStartingParams: CarProps = {
    x: 100,
    y: 100,
    height: 50,
    width: 30,
    canvasRef: canvasRef,
  };

  return (
    <div id="main">
      <canvas id="canvas" width={200} height={canvasHeight} ref={canvasRef}></canvas>
      <Car {...CarStartingParams}></Car>
    </div>
  );
};

export default SelfDrivingCar;
