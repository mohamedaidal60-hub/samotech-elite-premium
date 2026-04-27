import { Lightbulb, Eye, TrendingUp, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Lightbulb,
    title: "Creativity",
    description: "Bold ideas and original concepts that make your brand impossible to ignore.",
    link: "/workflow",
  },
  {
    icon: Eye,
    title: "Visual Excellence",
    description: "Cinematic production quality that captivates audiences and elevates your brand.",
    link: "/advertisement",
  },
  {
    icon: TrendingUp,
    title: "Marketing Strategy",
    description: "Data-driven campaigns optimized for performance and maximum ROI.",
    link: "/advertisement",
  },
];

const SamoTechEdge = () => {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-scroll-fade">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            The <span className="gradient-text">SamoTech</span> Edge
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A full-service solution bringing together the best of creativity, visuals, and strategy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <Link
              key={f.title}
              to={f.link}
              className="animate-scroll-fade glass-card-glow p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300 block bg-white/[0.03] hover:bg-white/[0.06] border-white/10 shadow-2xl relative z-10"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-bg flex items-center justify-center group-hover:animate-pulse-glow transition-all shadow-lg">
                <f.icon size={28} className="text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{f.description}</p>
              <div className="flex items-center justify-center gap-2 text-sm font-bold gradient-text opacity-0 group-hover:opacity-100 transition-opacity">
                Lire plus <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SamoTechEdge;
