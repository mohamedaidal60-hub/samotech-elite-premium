import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  connections: number[];
}

const WorkflowNodesBackground = () => {
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

    const nodes: Node[] = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.15, // Slower
        vy: (Math.random() - 0.5) * 0.15, // Slower
        radius: 2 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        connections: [],
      });
    }

    const connectionDist = 200;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.15;
            const t = (Math.sin(time * 0.0005 + nodes[i].phase) + 1) / 2;
            const r = magenta[0] + (cyan[0] - magenta[0]) * t;
            const g = magenta[1] + (cyan[1] - magenta[1]) * t;
            const b = magenta[2] + (cyan[2] - magenta[2]) * t;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const glow = 0.5 + 0.5 * Math.sin(time * 0.002 + node.phase);
        const t = (Math.sin(time * 0.0006 + node.phase) + 1) / 2;
        const r = magenta[0] + (cyan[0] - magenta[0]) * t;
        const g = magenta[1] + (cyan[1] - magenta[1]) * t;
        const b = magenta[2] + (cyan[2] - magenta[2]) * t;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + glow * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.3 + glow * 0.3})`;
        ctx.shadowColor = `rgba(${r},${g},${b},${glow * 0.6})`;
        ctx.shadowBlur = 12 + glow * 8;
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
      style={{ opacity: 0.7 }}
    />
  );
};

export default WorkflowNodesBackground;
