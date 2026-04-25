import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 200, suffix: "+", label: "Clients Served" },
  { value: 4.8, suffix: "x", label: "Average ROAS", decimals: 1 },
  { value: 50, suffix: "%", label: "Lower Ad Costs" },
  { value: 98, suffix: "%", label: "Client Retention" },
];

function AnimatedCounter({ target, suffix, decimals = 0 }: { target: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * target);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-5xl font-black gradient-text mb-2">
        {count.toFixed(decimals)}{suffix}
      </div>
    </div>
  );
}

const Stats = () => (
  <section className="py-20 relative">
    <div className="container mx-auto px-6">
      <div className="glass-card-glow rounded-2xl p-10 md:p-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <AnimatedCounter target={s.value} suffix={s.suffix} decimals={s.decimals} />
              <p className="text-muted-foreground text-sm text-center mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Stats;
