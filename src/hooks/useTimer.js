import { useState, useEffect, useRef } from "react";

export function useTimer(running) {
  const [secs, setSecs] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSecs((s) => s + 1), 1000);
    } else {
      clearInterval(ref.current);
      setSecs(0);
    }
    return () => clearInterval(ref.current);
  }, [running]);

  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}
