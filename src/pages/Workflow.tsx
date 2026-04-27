import { Search, Target, PenTool, Palette, Video, BarChart3, Rocket } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { icon: Search, title: "Discovery & Research", description: "Deep dive into your market, competitors, and audience to uncover insights that drive strategy." },
  { icon: Target, title: "Strategy & Planning", description: "Define clear objectives, KPIs, and a roadmap tailored to your brand's unique goals." },
  { icon: PenTool, title: "Concept & Copywriting", description: "Craft compelling narratives and creative concepts that resonate with your target audience." },
  { icon: Palette, title: "Art Direction & Design", description: "Develop stunning visual assets with a cohesive aesthetic that elevates your brand identity." },
  { icon: Video, title: "Production & Execution", description: "Bring concepts to life with professional video, photography, and digital asset creation." },
  { icon: BarChart3, title: "Optimization & Testing", description: "Refine content for platform algorithms, A/B test creatives, and maximize performance." },
  { icon: Rocket, title: "Launch & Scale", description: "Deploy campaigns, monitor results in real-time, and scale what works for exponential growth." },
];

import WorkflowNodesBackground from "@/components/backgrounds/WorkflowNodesBackground";

const Workflow = () => {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <main ref={ref} className="pt-24 pb-16 relative">
      <WorkflowNodesBackground />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 animate-scroll-fade">
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Our <span className="gradient-text">Workflow</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From research to results — how we transform insights into visual narratives that drive growth.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-primary/20" />

          {steps.map((step, i) => (
            <div
              key={step.title}
              className={`animate-scroll-fade relative flex items-start gap-8 mb-16 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                <div className="glow-dot" />
              </div>

              {/* Content */}
              <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                <div className="glass-card-glow p-6 rounded-2xl hover:scale-[1.02] transition-all group">
                  <div className={`w-10 h-10 rounded-xl gradient-bg flex items-center justify-center mb-4 ${i % 2 === 0 ? "md:ml-auto" : ""}`}>
                    <step.icon size={18} className="text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>

              {/* Spacer for alternating */}
              <div className="hidden md:block md:w-[calc(50%-2rem)]" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Workflow;
