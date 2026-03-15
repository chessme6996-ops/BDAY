import { useMemo } from "react";

const COLORS = [
  "hsl(36, 90%, 55%)",
  "hsl(12, 80%, 65%)",
  "hsl(340, 70%, 60%)",
  "hsl(200, 70%, 60%)",
  "hsl(160, 60%, 50%)",
  "hsl(280, 60%, 65%)",
  "hsl(50, 90%, 60%)",
];

const ConfettiPiece = ({ index }: { index: number }) => {
  const style = useMemo(() => {
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 3 + Math.random() * 4;
    const size = 6 + Math.random() * 8;
    const color = COLORS[index % COLORS.length];
    const shape = Math.random() > 0.5 ? "50%" : "0";
    return {
      left: `${left}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderRadius: shape,
    };
  }, [index]);

  return (
    <div
      className="absolute top-0 opacity-80"
      style={{
        ...style,
        animation: `confetti-fall ${style.animationDuration} linear ${style.animationDelay} infinite`,
      }}
    />
  );
};

const Confetti = () => {
  const pieces = useMemo(() => Array.from({ length: 40 }, (_, i) => i), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </div>
  );
};

export default Confetti;
