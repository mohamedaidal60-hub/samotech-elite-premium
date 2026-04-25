import { useEffect, useRef } from "react";

const LightTunnelBackground = () => {
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

    // 5-corner jagged trajectory: Up -> Dip -> Up -> Dip -> Major Surge
    const trajectory = [
      { x: 0.02, y: 0.95 },
      { x: 0.15, y: 0.72 },  // up
      { x: 0.25, y: 0.78 },  // dip
      { x: 0.42, y: 0.52 },  // up
      { x: 0.55, y: 0.58 },  // dip
      { x: 0.72, y: 0.30 },  // up
      { x: 0.98, y: 0.05 },  // major surge
    ];

    let drawProgress = 0;
    const drawSpeed = 0.006;
    let fadeAlpha = 1;
    let fading = false;

    // Warp speed light trails
    interface LightTrail {
      angle: number;
      speed: number;
      length: number;
      offset: number;
      color: string;
    }
    const trails: LightTrail[] = [];
    for (let i = 0; i < 40; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 2;
      trails.push({
        angle,
        speed: 0.5 + Math.random() * 2,
        length: 80 + Math.random() * 200,
        offset: Math.random() * 1000,
        color: Math.random() > 0.5
          ? `hsla(${300 + Math.random() * 20}, 100%, 60%, ${0.08 + Math.random() * 0.12})`
          : `hsla(${180 + Math.random() * 20}, 100%, 60%, ${0.08 + Math.random() * 0.12})`,
      });
    }

    // Dollar signs
    interface Dollar {
      x: number;
      y: number;
      speed: number;
      size: number;
      opacity: number;
    }
    const dollars: Dollar[] = [];
    for (let i = 0; i < 10; i++) {
      dollars.push({
        x: Math.random() * 2000,
        y: -Math.random() * 2000,
        speed: 2.5 + Math.random() * 3.5,
        size: 50 + Math.random() * 60,
        opacity: 0.12 + Math.random() * 0.2,
      });
    }

    const animate = (time: number) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // --- Warp speed tunnel lines ---
      const cx = W * 0.5;
      const cy = H * 0.5;
      for (const t of trails) {
        const progress = ((time * t.speed * 0.001 + t.offset) % 1);
        const r1 = progress * Math.max(W, H) * 0.9;
        const r2 = r1 + t.length;
        const x1 = cx + Math.cos(t.angle) * r1;
        const y1 = cy + Math.sin(t.angle) * r1;
        const x2 = cx + Math.cos(t.angle) * r2;
        const y2 = cy + Math.sin(t.angle) * r2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = t.color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // --- Growth Arrow ---
      ctx.save();
      ctx.globalAlpha = fadeAlpha;

      if (!fading) {
        drawProgress = Math.min(1, drawProgress + drawSpeed);
        if (drawProgress >= 1) {
          fading = true;
        }
      } else {
        fadeAlpha -= 0.03;
        if (fadeAlpha <= 0) {
          fadeAlpha = 1;
          fading = false;
          drawProgress = 0;
        }
      }

      const totalSeg = trajectory.length - 1;
      const pointsToDraw = Math.floor(drawProgress * totalSeg) + 1;
      const sub = (drawProgress * totalSeg) % 1;

      // Build path points
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < pointsToDraw && i < trajectory.length; i++) {
        pts.push({ x: trajectory[i].x * W, y: trajectory[i].y * H });
      }
      if (pointsToDraw < trajectory.length && sub > 0) {
        const a = trajectory[pointsToDraw - 1];
        const b = trajectory[pointsToDraw];
        pts.push({
          x: (a.x + (b.x - a.x) * sub) * W,
          y: (a.y + (b.y - a.y) * sub) * H,
        });
      }

      if (pts.length > 1) {
        // Neon glow layers (outer bloom → inner core)
        const layers = [
          { blur: 60, alpha: 0.12, width: 28, color: "0, 255, 100" },
          { blur: 30, alpha: 0.25, width: 16, color: "0, 255, 100" },
          { blur: 12, alpha: 0.5, width: 8, color: "50, 255, 120" },
          { blur: 4, alpha: 0.85, width: 4, color: "120, 255, 160" },
          { blur: 0, alpha: 1, width: 2, color: "200, 255, 220" },
        ];

        for (const l of layers) {
          ctx.save();
          ctx.shadowColor = `rgba(${l.color}, ${l.alpha})`;
          ctx.shadowBlur = l.blur;
          ctx.strokeStyle = `rgba(${l.color}, ${l.alpha})`;
          ctx.lineWidth = l.width;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
          ctx.stroke();
          ctx.restore();
        }

        // Glass tube highlight (semi-transparent inner white)
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.setLineDash([8, 16]);
        ctx.beginPath();
        pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y - 2) : ctx.lineTo(p.x, p.y - 2)));
        ctx.stroke();
        ctx.restore();

        // Glowing tip
        const tip = pts[pts.length - 1];
        const pulse = 0.6 + 0.4 * Math.sin(time * 0.006);
        ctx.save();
        ctx.shadowColor = `rgba(0, 255, 100, ${pulse})`;
        ctx.shadowBlur = 40 + pulse * 30;
        ctx.beginPath();
        ctx.arc(tip.x, tip.y, 6 + pulse * 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 255, 180, ${0.8 + pulse * 0.2})`;
        ctx.fill();
        ctx.restore();

        // Arrowhead at tip
        if (pts.length >= 2 && !fading) {
          const prev = pts[pts.length - 2];
          const angle = Math.atan2(tip.y - prev.y, tip.x - prev.x);
          const aLen = 18;
          ctx.save();
          ctx.shadowColor = "rgba(0, 255, 100, 0.8)";
          ctx.shadowBlur = 20;
          ctx.fillStyle = "rgba(100, 255, 150, 0.9)";
          ctx.beginPath();
          ctx.moveTo(tip.x + Math.cos(angle) * aLen, tip.y + Math.sin(angle) * aLen);
          ctx.lineTo(tip.x + Math.cos(angle + 2.5) * aLen * 0.7, tip.y + Math.sin(angle + 2.5) * aLen * 0.7);
          ctx.lineTo(tip.x + Math.cos(angle - 2.5) * aLen * 0.7, tip.y + Math.sin(angle - 2.5) * aLen * 0.7);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      ctx.restore(); // end fadeAlpha

      // --- Dollar rain ---
      for (const d of dollars) {
        d.y += d.speed;
        if (d.y > H + d.size) {
          d.y = -d.size - Math.random() * 400;
          d.x = Math.random() * W;
        }
        ctx.save();
        // Motion blur trails
        for (let t = 3; t >= 0; t--) {
          const ty = d.y - t * d.speed * 4;
          const ta = d.opacity * (1 - t * 0.28);
          if (ta <= 0) continue;
          ctx.shadowColor = `rgba(0, 255, 80, ${ta * 0.4})`;
          ctx.shadowBlur = 6 + t * 5;
          ctx.fillStyle = `rgba(0, 255, 80, ${ta})`;
          ctx.font = `900 ${d.size}px "Inter", system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("$", d.x, ty);
        }
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
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default LightTunnelBackground;
