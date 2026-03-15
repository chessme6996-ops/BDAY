import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: Date;
}

const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 justify-center w-full max-w-md mx-auto">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center bg-card/80 backdrop-blur-sm rounded-xl px-3 sm:px-5 py-3 sm:py-4 shadow-lg border border-primary/20">
          <span className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] sm:text-xs font-body text-muted-foreground uppercase tracking-widest mt-1">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
