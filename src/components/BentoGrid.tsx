import { Megaphone, Code, Settings } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Megaphone,
    title: "Advertisement",
    description: "End-to-end growth engine — from market research and UGC production to campaign launch and lead generation on Meta platforms.",
    className: "md:col-span-2 md:row-span-1",
    link: "/advertisement",
  },
  {
    icon: Code,
    title: "Development & Apps",
    description: "No templates. Custom web & mobile apps, e-commerce engines, showcase sites, and internal systems — all built from scratch.",
    className: "md:col-span-1 md:row-span-2",
    link: "/development",
  },
  {
    icon: Settings,
    title: "Business Automation",
    description: "Custom CRM, ERP, and workflow platforms that transform ideas into scalable digital solutions.",
    className: "md:col-span-2 md:row-span-1",
    link: "/automation",
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
            Three pillars engineered for your success.
          </p>
        </div>

        <div className="grid md:grid-cols-3 md:grid-rows-2 gap-6 max-w-5xl mx-auto">
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
