import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  hue: number;
  speed: number;
  angle: number;
  orbitRadius: number;
}

const PARTICLE_COUNT = 50;

const MouseParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Init particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      targetX: 0,
      targetY: 0,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      hue: 36 + Math.random() * 40 - 20, // warm gold range
      speed: Math.random() * 0.03 + 0.01,
      angle: Math.random() * Math.PI * 2,
      orbitRadius: Math.random() * 120 + 40,
    }));

    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleTouch);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach((p) => {
        p.angle += p.speed;
        p.targetX = mx + Math.cos(p.angle) * p.orbitRadius;
        p.targetY = my + Math.sin(p.angle) * p.orbitRadius;

        // Smooth follow
        p.x += (p.targetX - p.x) * 0.04;
        p.y += (p.targetY - p.y) * 0.04;

        // Draw glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${p.opacity})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 90%, 65%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.opacity + 0.3})`;
        ctx.fill();
      });

      // Draw faint lines between nearby particles
      ctx.strokeStyle = "rgba(255, 200, 100, 0.05)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i];
          const b = particlesRef.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[1] pointer-events-none"
    />
  );
};

export default MouseParticles;
