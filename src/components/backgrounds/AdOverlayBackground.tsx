import { useEffect, useRef } from "react";

interface Arrow {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  offset: number;
}

interface DollarDrop {
  x: number;
  y: number;
  speed: number;
  size: number;
  glowPhase: number;
}

const AdOverlayBackground = () => {
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

    // Green lead arrows traveling bottom-left to top-right
    const arrows: Arrow[] = [];
    for (let i = 0; i < 12; i++) {
      arrows.push({
        x: Math.random() * canvas.width * 0.5 - canvas.width * 0.3,
        y: canvas.height + Math.random() * canvas.height,
        speed: 0.6 + Math.random() * 0.8,
        size: 18 + Math.random() * 14,
        opacity: 0.15 + Math.random() * 0.2,
        offset: Math.random() * 200,
      });
    }

    // Dollar sign rain
    const dollars: DollarDrop[] = [];
    const dollarColumns = Math.floor(canvas.width / 60);
    for (let i = 0; i < dollarColumns; i++) {
      dollars.push({
        x: i * 60 + Math.random() * 30,
        y: Math.random() * -canvas.height,
        speed: 1.2 + Math.random() * 1.5,
        size: 14 + Math.random() * 10,
        glowPhase: Math.random() * Math.PI * 2,
      });
    }

    const magenta = [200, 60, 200];
    const cyan = [0, 200, 220];

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw green lead arrows (bottom-left → top-right)
      for (const arrow of arrows) {
        arrow.x += arrow.speed * 0.7;
        arrow.y -= arrow.speed;

        // Reset when off screen
        if (arrow.y < -60 || arrow.x > canvas.width + 60) {
          arrow.x = Math.random() * canvas.width * 0.3 - canvas.width * 0.2;
          arrow.y = canvas.height + Math.random() * 100;
        }

        ctx.save();
        ctx.translate(arrow.x, arrow.y);
        ctx.rotate(-Math.PI / 4); // 45° diagonal

        const glow = 0.5 + 0.5 * Math.sin(time * 0.002 + arrow.offset);
        ctx.shadowColor = `rgba(34, 197, 94, ${glow * 0.6})`;
        ctx.shadowBlur = 12 + glow * 10;
        ctx.strokeStyle = `rgba(34, 197, 94, ${arrow.opacity + glow * 0.1})`;
        ctx.fillStyle = `rgba(34, 197, 94, ${arrow.opacity + glow * 0.1})`;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        const s = arrow.size;
        // Arrow shaft
        ctx.beginPath();
        ctx.moveTo(0, s * 0.5);
        ctx.lineTo(0, -s * 0.5);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(0, -s * 0.5);
        ctx.lineTo(-s * 0.25, -s * 0.15);
        ctx.moveTo(0, -s * 0.5);
        ctx.lineTo(s * 0.25, -s * 0.15);
        ctx.stroke();

        // "LEADS" label on some arrows
        if (arrow.size > 26) {
          ctx.font = `bold ${s * 0.22}px Inter, sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText("LEADS", 0, s * 0.8);
        }

        ctx.restore();
      }

      // Draw dollar sign rain
      for (const d of dollars) {
        d.y += d.speed;
        if (d.y > canvas.height + 30) {
          d.y = -30 - Math.random() * 200;
          d.x = Math.random() * canvas.width;
        }

        const t = (Math.sin(time * 0.0008 + d.glowPhase) + 1) / 2;
        const r = magenta[0] + (cyan[0] - magenta[0]) * t;
        const g = magenta[1] + (cyan[1] - magenta[1]) * t;
        const b = magenta[2] + (cyan[2] - magenta[2]) * t;
        const glow = 0.5 + 0.5 * Math.sin(time * 0.0015 + d.glowPhase);

        ctx.save();
        ctx.shadowColor = `rgba(${r},${g},${b},${glow * 0.5})`;
        ctx.shadowBlur = 10 + glow * 8;
        ctx.fillStyle = `rgba(${r},${g},${b},${0.12 + glow * 0.1})`;
        ctx.font = `900 ${d.size}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("$", d.x, d.y);
        ctx.restore();
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
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.8 }}
    />
  );
};

export default AdOverlayBackground;
