import { Lightbulb, Eye, TrendingUp } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: Lightbulb,
    title: "Creativity",
    description: "Bold ideas and original concepts that make your brand impossible to ignore.",
  },
  {
    icon: Eye,
    title: "Visual Excellence",
    description: "Cinematic production quality that captivates audiences and elevates your brand.",
  },
  {
    icon: TrendingUp,
    title: "Marketing Strategy",
    description: "Data-driven campaigns optimized for performance and maximum ROI.",
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
            <div
              key={f.title}
              className="animate-scroll-fade glass-card-glow p-8 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-bg flex items-center justify-center group-hover:animate-pulse-glow transition-all">
                <f.icon size={28} className="text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SamoTechEdge;
