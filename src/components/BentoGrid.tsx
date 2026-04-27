import { Megaphone, Code, Settings, Palette, Film, TrendingUp } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Megaphone,
    title: "Advertisement",
    description: "End-to-end growth engine — from market research to lead generation on Meta platforms.",
    className: "md:col-span-2 md:row-span-1",
    link: "/advertisement",
  },
  {
    icon: Code,
    title: "Custom Software",
    description: "Bespoke web & mobile apps, e-commerce engines, and internal systems built from scratch.",
    className: "md:col-span-1 md:row-span-2",
    link: "/development",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Stunning, user-centric designs that elevate your brand identity and conversion rates.",
    className: "md:col-span-1 md:row-span-1",
    link: "/development",
  },
  {
    icon: Settings,
    title: "Automation & ERP",
    description: "Streamline operations with custom CRM and ERP platforms tailored to your workflow.",
    className: "md:col-span-1 md:row-span-1",
    link: "/automation",
  },
  {
    icon: Film,
    title: "UGC & Video",
    description: "Cinema-grade content and authentic UGC engineered to capture attention and lower costs.",
    className: "md:col-span-1 md:row-span-1",
    link: "/advertisement",
  },
  {
    icon: TrendingUp,
    title: "SEO & Growth",
    description: "Data-driven strategies to dominate search results and scale your digital presence.",
    className: "md:col-span-1 md:row-span-1",
    link: "/workflow",
  },
];

const BentoGrid = () => {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-scroll-fade">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Engineered for excellence. Powered by technology.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((s, i) => (
            <Link
              to={s.link}
              key={s.title}
              className={`animate-scroll-fade glass-card-glow p-8 rounded-2xl group hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between ${s.className}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div>
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-5 group-hover:animate-pulse-glow">
                  <s.icon size={22} className="text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
