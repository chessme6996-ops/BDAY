import { useEffect, useRef, useState } from "react";

const GRID_COLS = 12;
const GRID_ROWS = 8;
const REVEAL_RADIUS = 2.5; // how many cells around mouse to unblur

const CameraBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraRequested, setCameraRequested] = useState(false);
  const animFrameRef = useRef<number>(0);

  const requestCamera = async () => {
    setCameraRequested(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setHasCamera(true);
      }
    } catch {
      setHasCamera(false);
    }
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        setMousePos({
          x: e.touches[0].clientX / window.innerWidth,
          y: e.touches[0].clientY / window.innerHeight,
        });
      }
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleTouch);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, []);

  useEffect(() => {
    if (!hasCamera) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cellW = w / GRID_COLS;
      const cellH = h / GRID_ROWS;

      // Draw full video frame
      ctx.drawImage(video, 0, 0, w, h);
      const fullFrame = ctx.getImageData(0, 0, w, h);

      // Draw heavily blurred version
      ctx.filter = "blur(20px)";
      ctx.drawImage(video, 0, 0, w, h);
      ctx.filter = "none";
      const blurredFrame = ctx.getImageData(0, 0, w, h);

      // Mouse position in grid coords
      const mx = mousePos.x * GRID_COLS;
      const my = mousePos.y * GRID_ROWS;

      // Composite: for each cell, blend between blurred and clear
      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          const cx = col + 0.5;
          const cy = row + 0.5;
          const dist = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
          const t = Math.min(1, Math.max(0, dist / REVEAL_RADIUS)); // 0 = clear, 1 = blurred

          const x0 = Math.floor(col * cellW);
          const y0 = Math.floor(row * cellH);
          const x1 = Math.floor((col + 1) * cellW);
          const y1 = Math.floor((row + 1) * cellH);

          for (let py = y0; py < y1; py++) {
            for (let px = x0; px < x1; px++) {
              const i = (py * w + px) * 4;
              blurredFrame.data[i] = fullFrame.data[i] * (1 - t) + blurredFrame.data[i] * t;
              blurredFrame.data[i + 1] = fullFrame.data[i + 1] * (1 - t) + blurredFrame.data[i + 1] * t;
              blurredFrame.data[i + 2] = fullFrame.data[i + 2] * (1 - t) + blurredFrame.data[i + 2] * t;
            }
          }
        }
      }

      ctx.putImageData(blurredFrame, 0, 0);

      // Dark overlay for readability
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(0, 0, w, h);

      // Grid lines (subtle)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      for (let col = 1; col < GRID_COLS; col++) {
        ctx.beginPath();
        ctx.moveTo(col * cellW, 0);
        ctx.lineTo(col * cellW, h);
        ctx.stroke();
      }
      for (let row = 1; row < GRID_ROWS; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * cellH);
        ctx.lineTo(w, row * cellH);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [hasCamera, mousePos]);

  if (!cameraRequested) {
    return (
      <button
        onClick={requestCamera}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
      >
        📷 Enable Camera BG
      </button>
    );
  }

  return (
    <>
      <video ref={videoRef} className="hidden" playsInline muted />
      {hasCamera && (
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="fixed inset-0 w-full h-full object-cover z-0"
        />
      )}
    </>
  );
};

export default CameraBackground;
