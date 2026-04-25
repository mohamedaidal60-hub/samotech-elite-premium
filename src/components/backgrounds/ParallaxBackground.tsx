import { useEffect, useRef } from "react";

const ParallaxBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const shapes = containerRef.current.querySelectorAll<HTMLElement>("[data-speed]");
      shapes.forEach((shape) => {
        const speed = parseFloat(shape.dataset.speed || "0.5");
        shape.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * speed * 0.05}deg)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Large glowing orbs */}
      <div data-speed="-0.15" className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full opacity-20 blur-[100px] bg-primary" />
      <div data-speed="-0.1" className="absolute top-[60%] right-[10%] w-96 h-96 rounded-full opacity-15 blur-[120px] bg-secondary" />
      <div data-speed="-0.2" className="absolute top-[40%] left-[50%] w-64 h-64 rounded-full opacity-10 blur-[100px] gradient-bg" />

      {/* Geometric shapes */}
      <div data-speed="-0.3" className="absolute top-[15%] right-[20%] w-20 h-20 border border-primary/20 rounded-lg rotate-45 animate-float" />
      <div data-speed="-0.5" className="absolute top-[35%] left-[8%] w-16 h-16 border border-secondary/25 rounded-full animate-float" style={{ animationDelay: "2s" }} />
      <div data-speed="-0.2" className="absolute top-[55%] right-[35%] w-12 h-12 gradient-border rounded-xl rotate-12 animate-float" style={{ animationDelay: "1s" }} />
      <div data-speed="-0.4" className="absolute top-[25%] left-[40%] w-24 h-24 gradient-border rounded-2xl rotate-[20deg] animate-float" style={{ animationDelay: "3s" }} />
      <div data-speed="-0.35" className="absolute top-[70%] left-[25%] w-14 h-14 border border-primary/15 rounded-lg rotate-[30deg] animate-float" style={{ animationDelay: "4s" }} />
      <div data-speed="-0.25" className="absolute top-[80%] right-[15%] w-10 h-10 glass-card rotate-45 animate-float" style={{ animationDelay: "1.5s" }} />

      {/* Ribbon-inspired shapes */}
      <div data-speed="-0.45" className="absolute top-[45%] left-[70%] w-32 h-4 rounded-full gradient-bg opacity-20 rotate-[25deg] animate-float" style={{ animationDelay: "2.5s" }} />
      <div data-speed="-0.15" className="absolute top-[20%] left-[60%] w-24 h-3 rounded-full gradient-bg opacity-15 rotate-[-15deg] animate-float" style={{ animationDelay: "3.5s" }} />
      <div data-speed="-0.55" className="absolute top-[75%] left-[55%] w-28 h-3 rounded-full gradient-bg opacity-20 rotate-[40deg] animate-float" style={{ animationDelay: "0.5s" }} />
    </div>
  );
};

export default ParallaxBackground;
