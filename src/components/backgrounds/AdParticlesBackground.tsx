import { useEffect, useRef } from "react";

interface FloatingItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  type: "arrow" | "chart" | "dollar" | "sale" | "leads";
  rotation: number;
  rotationSpeed: number;
  glowPhase: number;
}

const AdParticlesBackground = () => {
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

    const types: FloatingItem["type"][] = ["arrow", "chart", "dollar", "sale", "leads"];
    const items: FloatingItem[] = [];
    const count = 60; 
    for (let i = 0; i < count; i++) {
      items.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.5 + Math.random() * 1.2), // faster drift upward
        size: 20 + Math.random() * 25,
        opacity: 0.15 + Math.random() * 0.25, // more visible
        type: types[i % types.length],
        rotation: (Math.random() - 0.5) * 0.4,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        glowPhase: Math.random() * Math.PI * 2,
      });
    }

    const magenta = [200, 60, 200];
    const cyan = [0, 200, 220];

    const getColor = (item: FloatingItem, time: number, extraAlpha = 0) => {
      const t = (Math.sin(time * 0.0005 + item.glowPhase) + 1) / 2;
      const r = magenta[0] + (cyan[0] - magenta[0]) * t;
      const g = magenta[1] + (cyan[1] - magenta[1]) * t;
      const b = magenta[2] + (cyan[2] - magenta[2]) * t;
      return { r, g, b, color: `rgba(${r},${g},${b},${item.opacity + extraAlpha})` };
    };

    const drawItem = (item: FloatingItem, time: number) => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);

      const glow = 0.5 + 0.5 * Math.sin(time * 0.001 + item.glowPhase);
      const { r, g, b, color } = getColor(item, time, glow * 0.12);

      ctx.shadowColor = `rgba(${r},${g},${b},${glow * 0.8})`;
      ctx.shadowBlur = 25 + glow * 20;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const s = item.size;

      switch (item.type) {
        case "arrow": {
          // Upward arrow with "LEADS" label
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.5);
          ctx.lineTo(-s * 0.25, -s * 0.1);
          ctx.moveTo(0, -s * 0.5);
          ctx.lineTo(s * 0.25, -s * 0.1);
          ctx.moveTo(0, -s * 0.5);
          ctx.lineTo(0, s * 0.4);
          ctx.stroke();
          ctx.font = `bold ${s * 0.28}px Inter, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("LEADS", 0, s * 0.7);
          break;
        }
        case "chart": {
          // Bar chart showing growth
          const bw = s * 0.15;
          const heights = [0.3, 0.5, 0.45, 0.7, 0.95];
          heights.forEach((h, i) => {
            const bx = (i - 2) * (bw + 3);
            ctx.fillRect(bx - bw / 2, s * 0.4 - h * s * 0.8, bw, h * s * 0.8);
          });
          // Trend line
          ctx.beginPath();
          ctx.moveTo(-s * 0.4, s * 0.25);
          ctx.lineTo(s * 0.35, -s * 0.35);
          ctx.lineTo(s * 0.45, -s * 0.25);
          ctx.stroke();
          break;
        }
        case "dollar": {
          // Dollar sign with glow
          ctx.font = `900 ${s}px Inter, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("$", 0, 0);
          break;
        }
        case "sale": {
          // "SALE" tag
          ctx.font = `900 ${s * 0.5}px Inter, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("ROAS", 0, -s * 0.1);
          // Small upward arrow
          ctx.beginPath();
          ctx.moveTo(0, s * 0.2);
          ctx.lineTo(-s * 0.12, s * 0.35);
          ctx.moveTo(0, s * 0.2);
          ctx.lineTo(s * 0.12, s * 0.35);
          ctx.moveTo(0, s * 0.2);
          ctx.lineTo(0, s * 0.5);
          ctx.stroke();
          break;
        }
        case "leads": {
          // Upward trending line graph
          ctx.beginPath();
          ctx.moveTo(-s * 0.4, s * 0.3);
          ctx.quadraticCurveTo(-s * 0.1, s * 0.1, 0, -s * 0.1);
          ctx.quadraticCurveTo(s * 0.1, -s * 0.3, s * 0.4, -s * 0.45);
          ctx.stroke();
          // Arrow tip
          ctx.beginPath();
          ctx.moveTo(s * 0.4, -s * 0.45);
          ctx.lineTo(s * 0.25, -s * 0.35);
          ctx.moveTo(s * 0.4, -s * 0.45);
          ctx.lineTo(s * 0.35, -s * 0.28);
          ctx.stroke();
          break;
        }
      }
      ctx.restore();
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const item of items) {
        item.x += item.vx;
        item.y += item.vy;
        item.rotation += item.rotationSpeed;

        if (item.x < -60) item.x = canvas.width + 60;
        if (item.x > canvas.width + 60) item.x = -60;
        if (item.y < -60) item.y = canvas.height + 60;

        drawItem(item, time);
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
      style={{ opacity: 0.7 }}
    />
  );
};

export default AdParticlesBackground;
