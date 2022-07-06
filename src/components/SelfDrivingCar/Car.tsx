import { useEffect, useState } from 'react';

export interface CarProps {
  x: number;
  y: number;
  height: number;
  width: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

interface CarStats {
  velocity: number;
  acceleration: number;
  friction: number;
  angle: number;
  maxSpeed: number;
  forward: boolean;
  backwards: boolean;
  left: boolean;
  right: boolean;
}

const Car = ({ x, y, height, width, canvasRef }: CarProps) => {
  const StartingCarStats: CarStats = {
    velocity: 0,
    acceleration: 0.2,
    friction: 0.05,
    angle: 0,
    maxSpeed: 3,
    forward: false,
    backwards: false,
    left: false,
    right: false,
  };

  const [stats, setStats] = useState<CarStats>(StartingCarStats);

  function draw(context: CanvasRenderingContext2D | undefined | null) {
    if (context === null || context === undefined) return;
    context.beginPath();
    context.fillRect(x, y, width, height);
  }

  function registerKeyDownControls(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        setStats({ ...stats, left: true });
        break;
      case 'ArrowUp':
        setStats({ ...stats, forward: true });
        break;
      case 'ArrowDown':
        setStats({ ...stats, backwards: true });
        break;
      case 'ArrowRight':
        setStats({ ...stats, right: true });
        break;
    }
  }
  function registerKeyUpControls(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        setStats({ ...stats, left: false });
        break;
      case 'ArrowUp':
        setStats({ ...stats, forward: false });
        break;
      case 'ArrowDown':
        setStats({ ...stats, backwards: false });
        break;
      case 'ArrowRight':
        setStats({ ...stats, right: false });
        break;
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', registerKeyDownControls);
    document.addEventListener('keyup', registerKeyUpControls);
  });

  useEffect(() => {
    draw(canvasRef.current?.getContext('2d'));
  });

  return <div></div>;
};

export default Car;
