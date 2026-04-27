import { Smartphone, Globe, Server, HardDrive, Ban, Code2, Shield, Zap } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import MatrixBackground from "@/components/backgrounds/MatrixBackground";

const devCategories = [
  {
    icon: Smartphone,
    title: "Web & Mobile Applications",
    description: "Custom-built applications designed for performance and scale. Native-quality experiences across all devices with modern architectures and blazing-fast load times.",
    items: ["Cross-platform mobile apps", "Progressive web apps", "Custom dashboards & portals", "API-first architecture"],
  },
  {
    icon: Globe,
    title: "Showcase & E-Commerce Websites",
    description: "Modern, secure, and fully custom website architectures. No templates — every pixel is purpose-built for your brand's conversion goals.",
    items: ["Custom storefronts", "Product catalogs & checkout", "Payment gateway integration", "Vitrine / showcase sites"],
  },
  {
    icon: Server,
    title: "Custom Internal Systems (ERP / CRM)",
    description: "Tailored tools to manage your business operations. Built around your exact workflows — not the other way around.",
    items: ["Custom ERP platforms", "CRM & sales pipelines", "Inventory management", "Reporting & analytics dashboards"],
  },
  {
    icon: HardDrive,
    title: "Infrastructure & Setup",
    description: "Complete technical foundation for your digital presence. We handle the invisible essentials so you can focus on SamoTech.",
    items: ["Cloud hosting & deployment", "Domain name registration", "Professional email (you@yourcompany.com)", "SSL certificates & security"],
  },
];

const principles = [
  { icon: Code2, title: "Custom Code", desc: "Every line written from scratch" },
  { icon: Shield, title: "Enterprise Security", desc: "Built-in from day one" },
  { icon: Zap, title: "Peak Performance", desc: "Optimized for speed & scale" },
];

const technologies = [
  "React", "Node.js", "TypeScript", "Python", "Go", "PostgreSQL", 
  "AWS", "Docker", "Next.js", "Vue", "Swift", "Kotlin", "GraphQL", "MongoDB", "PHP", "Laravel"
];

const Development = () => {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <main ref={ref} className="pt-24 pb-16 relative">
      <MatrixBackground />
      <div className="container mx-auto px-6 relative z-10">
        {/* Hero */}
        <div className="text-center mb-24 animate-scroll-fade">
          <span className="inline-block glass-card px-4 py-2 text-xs font-medium tracking-widest uppercase text-muted-foreground mb-6">
            Custom Engineering
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
            Custom Engineering.
            <br />
            <span className="gradient-text">No Templates. No Limits.</span>
          </h1>

          {/* Disclaimer */}
          <div className="inline-flex items-center gap-3 glass-card-glow px-6 py-3 rounded-2xl mb-8">
            <Ban size={22} className="text-primary" />
            <span className="text-base font-bold text-foreground">
              We build from scratch — No Shopify, No WooCommerce.
            </span>
          </div>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Every line of code is custom-built — architected for performance, security, and scale. Your vision, our engineering.
          </p>

          {/* Principles */}
          <div className="flex flex-wrap justify-center gap-6">
            {principles.map((p) => (
              <div key={p.title} className="glass-card px-5 py-3 rounded-xl flex items-center gap-3">
                <p.icon size={18} className="text-primary" />
                <div className="text-left">
                  <div className="text-sm font-bold text-foreground">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <section className="mb-32 animate-scroll-fade">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {devCategories.map((cat, i) => (
              <div
                key={cat.title}
                className="glass-card-glow p-8 rounded-2xl hover:scale-[1.02] transition-all group"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0 group-hover:animate-pulse-glow">
                    <cat.icon size={22} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{cat.description}</p>
                    <ul className="space-y-1.5">
                      {cat.items.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full gradient-bg shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Marquee */}
        <section className="mb-32 animate-scroll-fade overflow-hidden py-10">
          <div className="text-center mb-10">
            <h3 className="text-lg md:text-xl font-bold text-muted-foreground uppercase tracking-widest">Technologies & Langages</h3>
          </div>
          <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
            
            <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused]">
              {[...technologies, ...technologies, ...technologies, ...technologies].map((tech, i) => (
                <div key={i} className="mx-3 glass-card px-6 py-3 rounded-xl flex items-center justify-center">
                  <span className="font-bold text-foreground text-base whitespace-nowrap">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="animate-scroll-fade text-center">
          <div className="glass-card-glow rounded-2xl p-10 md:p-14 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Let's Build <span className="gradient-text">Something Great</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Tell us about your project and we'll architect a custom solution from scratch.
            </p>
            <Link
              to="/contact"
              className="gradient-bg px-8 py-4 rounded-xl text-base font-semibold text-primary-foreground hover:opacity-90 transition-all hover:scale-105 inline-block"
            >
              Start Your Project
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Development;
