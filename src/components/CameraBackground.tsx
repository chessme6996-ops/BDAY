import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CameraBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraRequested, setCameraRequested] = useState(false);
  const animFrameRef = useRef<number>(0);
  const isMobile = useIsMobile();
  const gridCols = isMobile ? 8 : 12;
  const gridRows = isMobile ? 6 : 8;
  const revealRadius = isMobile ? 2 : 2.5; // how many cells around touch to unblur
  const canvasSize = isMobile ? { width: 360, height: 270 } : { width: 640, height: 480 };

  const requestCamera = async () => {
    setCameraRequested(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isMobile
          ? { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }
          : { facingMode: "user", width: 640, height: 480 },
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
      mousePosRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mousePosRef.current = {
          x: e.touches[0].clientX / window.innerWidth,
          y: e.touches[0].clientY / window.innerHeight,
        };
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
      const cellW = w / gridCols;
      const cellH = h / gridRows;

      // Draw full video frame
      ctx.drawImage(video, 0, 0, w, h);
      const fullFrame = ctx.getImageData(0, 0, w, h);

      // Draw heavily blurred version
      ctx.filter = "blur(20px)";
      ctx.drawImage(video, 0, 0, w, h);
      ctx.filter = "none";
      const blurredFrame = ctx.getImageData(0, 0, w, h);

      // Mouse position in grid coords
      const mx = mousePosRef.current.x * gridCols;
      const my = mousePosRef.current.y * gridRows;

      // Composite: for each cell, blend between blurred and clear
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const cx = col + 0.5;
          const cy = row + 0.5;
          const dist = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
          const t = Math.min(1, Math.max(0, dist / revealRadius)); // 0 = clear, 1 = blurred

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
      for (let col = 1; col < gridCols; col++) {
        ctx.beginPath();
        ctx.moveTo(col * cellW, 0);
        ctx.lineTo(col * cellW, h);
        ctx.stroke();
      }
      for (let row = 1; row < gridRows; row++) {
        ctx.beginPath();
        ctx.moveTo(0, row * cellH);
        ctx.lineTo(w, row * cellH);
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gridCols, gridRows, hasCamera, revealRadius]);

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  if (!cameraRequested) {
    return (
      <button
        onClick={requestCamera}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 px-3 sm:px-4 py-2 rounded-full bg-primary text-primary-foreground font-body text-xs sm:text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity"
      >
        📷 Enable camera background
      </button>
    );
  }

  return (
    <>
      <video ref={videoRef} className="hidden" playsInline muted />
      {hasCamera && (
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="fixed inset-0 w-full h-full object-cover z-0"
        />
      )}
    </>
  );
};

export default CameraBackground;
