import { useEffect, useRef } from "react";

const MatrixBackground = () => {
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

    const fontSize = 14;
    const chars = "01{}[]()<>=;:const let var function return import export async await if else for while class new this => + - * / % & | ^ ~ ! ? . , # @ $ _".split("");
    let columns = Math.floor(canvas.width / fontSize);
    let drops = new Array(columns).fill(0).map(() => Math.random() * -100);

    window.addEventListener("resize", () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * -100);
    });

    const animate = () => {
      ctx.fillStyle = "rgba(10, 8, 18, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * fontSize;
        
        // Gradient from cyan to magenta based on progress
        const progress = (y % canvas.height) / canvas.height;
        const r = Math.floor(0 + (255 - 0) * progress);
        const g = Math.floor(255 + (0 - 255) * progress);
        const b = Math.floor(255 + (255 - 255) * progress);

        const opacity = 0.25 + Math.random() * 0.45;
        ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`;
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(char, i * fontSize, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
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
      style={{ opacity: 0.4 }}
    />
  );
};

export default MatrixBackground;
