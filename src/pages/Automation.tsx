import { Settings, Workflow, Plug, BarChart3, Cog, Database, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import MatrixBackground from "@/components/backgrounds/MatrixBackground";

const features = [
  {
    icon: Workflow,
    title: "Workflow Optimization",
    description: "Map, analyze, and streamline your existing business processes. We identify bottlenecks and eliminate manual inefficiencies with intelligent automation.",
  },
  {
    icon: Plug,
    title: "API Integrations",
    description: "Connect your tools, platforms, and data sources into a unified ecosystem. Custom API development that makes your systems talk to each other seamlessly.",
  },
  {
    icon: Database,
    title: "Custom Internal Automation",
    description: "Bespoke automation systems built around your exact needs — from data pipelines to automated reporting, inventory triggers, and notification workflows.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Automated dashboards and real-time reporting that give you complete visibility into your operations without manual data gathering.",
  },
];

const capabilities = [
  "CRM Pipelines",
  "Workflow Automation",
  "Data Pipelines",
  "Custom APIs",
  "ERP Integration",
  "Internal Dashboards",
  "Automated Reporting",
  "Email Automation",
  "Inventory Systems",
  "Notification Workflows",
];

const Automation = () => {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <main ref={ref} className="pt-24 pb-16 relative">
      <MatrixBackground />
      <div className="container mx-auto px-6 relative z-10">
        {/* Hero */}
        <div className="text-center mb-24 animate-scroll-fade">
          <span className="inline-block glass-card px-4 py-2 text-xs font-medium tracking-widest uppercase text-muted-foreground mb-6">
            Business Process Automation
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
            Streamline Your Success
            <br />
            <span className="gradient-text">with Intelligent Workflows.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            We transform manual ideas into scalable digital systems — the invisible backbone of a modern business.
          </p>

          <div className="inline-flex items-center gap-3 glass-card-glow px-6 py-3 rounded-2xl">
            <Cog size={20} className="text-primary animate-spin" style={{ animationDuration: "8s" }} />
            <span className="text-sm font-medium text-foreground">Technology at the Service of Your Success</span>
          </div>
        </div>

        {/* Feature Grid */}
        <section className="mb-32 animate-scroll-fade">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="glass-card-glow p-8 rounded-2xl hover:scale-[1.02] transition-all group"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-5 group-hover:animate-pulse-glow">
                  <f.icon size={22} className="text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="mb-32 animate-scroll-fade">
          <div className="glass-card-glow rounded-2xl p-10 md:p-14 max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-bg flex items-center justify-center mb-6">
              <Settings size={28} className="text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What We <span className="gradient-text">Automate</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              From CRM pipelines to ERP integrations — we build the invisible infrastructure that lets you scale without limits.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {capabilities.map((item) => (
                <span key={item} className="glass-card px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:scale-105 transition-all">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="animate-scroll-fade text-center">
          <div className="glass-card-glow rounded-2xl p-10 md:p-14 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Automate & Scale</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Tell us about your workflows and we'll design a system that runs itself.
            </p>
            <Link
              to="/contact"
              className="gradient-bg px-8 py-4 rounded-xl text-base font-semibold text-primary-foreground hover:opacity-90 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Automation;
