import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

export function Countdown({ date }: { date: string }) {
  const target = new Date(date).getTime();
  const [time, setTime] = useState(() => diff(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-6">
      {units.map((u) => (
        <div
          key={u.label}
          className="rounded-sm border border-gold/40 bg-card/70 px-2 py-5 text-center backdrop-blur-sm sm:px-4 sm:py-7"
        >
          <div className="font-display text-3xl tabular-nums text-foreground sm:text-5xl">
            {mounted ? String(u.value).padStart(2, "0") : "--"}
          </div>
          <div className="eyebrow mt-2 text-[0.6rem] sm:text-xs">{u.label}</div>
        </div>
      ))}
    </div>
  );
}
