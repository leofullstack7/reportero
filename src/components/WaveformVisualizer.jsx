import { useRef, useEffect } from "react";

export function WaveformVisualizer({ analyser, active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      if (!analyser || !active) {
        const bars = 40;
        for (let i = 0; i < bars; i++) {
          const x = (i / bars) * W;
          const h = 4 + Math.sin(Date.now() * 0.002 + i * 0.5) * 2;
          ctx.fillStyle = "rgba(99,102,241,0.25)";
          ctx.beginPath();
          ctx.roundRect(x, H / 2 - h / 2, W / bars - 2, h, 2);
          ctx.fill();
        }
        return;
      }

      const buf = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(buf);
      const bars = 60;
      const step = Math.floor(buf.length / bars);

      for (let i = 0; i < bars; i++) {
        const val = buf[i * step] / 255;
        const h = Math.max(3, val * (H - 8));
        const x = (i / bars) * W;
        const g = ctx.createLinearGradient(0, H / 2 - h / 2, 0, H / 2 + h / 2);
        g.addColorStop(0, "#818cf8");
        g.addColorStop(1, "#6366f1");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.roundRect(x, H / 2 - h / 2, W / bars - 1.5, h, 2);
        ctx.fill();
      }
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser, active]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={72}
      style={{
        width: "100%",
        height: 72,
        borderRadius: 12,
        background: "rgba(99,102,241,0.06)",
      }}
    />
  );
}
