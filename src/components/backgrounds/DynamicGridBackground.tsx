import { useEffect, useRef } from "react";

const DynamicGridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    const magenta = [255, 0, 255];
    const cyan = [0, 255, 255];
    const blue = [0, 128, 255];

    const gridSize = 60;
    
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const W = canvas.width;
      const H = canvas.height;
      const t = time * 0.001;

      // Draw Grid with subtle glow
      ctx.strokeStyle = "rgba(0, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Draw Pulses
      const pulseCount = 20; // Increased
      for (let i = 0; i < pulseCount; i++) {
        const x = (Math.sin(t * 0.15 + i * 1.5) * 0.5 + 0.5) * W;
        const y = (Math.cos(t * 0.12 + i * 2.2) * 0.5 + 0.5) * H;
        const size = 200 + Math.sin(t + i) * 80;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        const colorT = (Math.sin(t * 0.4 + i) + 1) / 2;
        const r = magenta[0] + (cyan[0] - magenta[0]) * colorT;
        const g = magenta[1] + (cyan[1] - magenta[1]) * colorT;
        const b = magenta[2] + (cyan[2] - magenta[2]) * colorT;
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.2)`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
      }

      // Draw moving nodes (paths)
      for (let i = 0; i < 60; i++) {
        const nx = (Math.sin(t * 0.25 + i * 2) * 0.5 + 0.5) * W;
        const ny = (Math.cos(t * 0.18 + i * 1.1) * 0.5 + 0.5) * H;
        
        const glow = 0.5 + 0.5 * Math.sin(t * 3 + i);
        ctx.beginPath();
        ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
        const color = i % 2 === 0 ? `rgba(255, 0, 255, ${0.4 + glow * 0.4})` : `rgba(0, 255, 255, ${0.4 + glow * 0.4})`;
        ctx.fillStyle = color;
        ctx.shadowColor = i % 2 === 0 ? "rgba(255, 0, 255, 1)" : "rgba(0, 255, 255, 1)";
        ctx.shadowBlur = 15 * glow;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default DynamicGridBackground;
