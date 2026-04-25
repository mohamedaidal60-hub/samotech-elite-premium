import { Search, Mic, Film, Palette, Rocket, ArrowRight, TrendingDown, DollarSign, Eye } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState } from "react";
import { Link } from "react-router-dom";
import LightTunnelBackground from "@/components/backgrounds/LightTunnelBackground";

const adSteps = [
  {
    icon: Search,
    title: "Marketing Strategy & Market Research",
    subtitle: "Foundation",
    description: "We analyze your target audience's triggers, pain points, and desires to identify your Unique Selling Proposition. Deep competitor analysis and market mapping lay the strategic foundation for every campaign.",
    details: ["Audience psychographic profiling", "Competitor ad library analysis", "USP identification & positioning", "Platform-specific strategy"],
  },
  {
    icon: Mic,
    title: "Script & Professional Voiceover",
    subtitle: "Messaging",
    description: "Our marketing copywriters draft high-converting ad scripts loaded with strategic keywords. Paired with professional audio engineering, every word is designed to capture attention and drive down your ad costs.",
    details: ["Hook-driven script frameworks", "Strategic keyword integration", "Professional voiceover recording", "Multi-format script variations"],
  },
  {
    icon: Film,
    title: "High-End Production & UGC",
    subtitle: "Creation",
    description: "Professional filming and authentic UGC content shot with cinema-grade equipment — engineered specifically to lower your costs within the Meta algorithm. Scroll-stopping visuals that convert.",
    details: ["Cinema-grade equipment & lighting", "Authentic UGC for algorithm optimization", "Multiple aspect ratios (9:16, 1:1, 16:9)", "Batch content production"],
  },
  {
    icon: Palette,
    title: "Professional Editing & Post-Production",
    subtitle: "Polish",
    description: "Expert color grading, dynamic transitions, and master-level post-production designed to maximize 'watch time'. Every frame is optimized for platform-specific engagement metrics and algorithm performance.",
    details: ["Cinematic color grading", "Dynamic motion graphics", "Watch-time optimization techniques", "Platform-native formatting"],
  },
  {
    icon: Rocket,
    title: "Lead Generation & Campaign Launch",
    subtitle: "Results",
    description: "We expertly launch and A/B test your ads on Facebook and Instagram to deliver high-quality leads. Continuous optimization, audience refinement, and scaling strategies for maximum ROAS.",
    details: ["A/B creative & audience testing", "Lookalike & retargeting audiences", "Real-time bid optimization", "Weekly performance reporting"],
  },
];

const resultMetrics = [
  { icon: TrendingDown, value: "50%", label: "Lower Cost Per Result" },
  { icon: DollarSign, value: "4.8x", label: "Average ROAS" },
  { icon: Eye, value: "3x", label: "Higher Watch Time" },
];

const Advertisement = () => {
  const ref = useScrollReveal<HTMLElement>();
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main ref={ref} className="pt-24 pb-16 relative">
      <LightTunnelBackground />
      <div className="container mx-auto px-6 relative z-10">
        {/* Hero */}
        <div className="text-center mb-24 animate-scroll-fade">
          <span className="inline-block glass-card px-4 py-2 text-xs font-medium tracking-widest uppercase text-muted-foreground mb-6">
            Full-Service Ad Agency
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
            Data-Driven Creativity.
            <br />
            <span className="gradient-text">High-Performance Ads.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Our end-to-end growth engine — from market research to lead generation — engineered to crush your cost-per-result on Meta platforms.
          </p>

          {/* Result Metrics */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {resultMetrics.map((m) => (
              <div key={m.label} className="glass-card-glow px-6 py-4 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <m.icon size={18} className="text-primary-foreground" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-black gradient-text">{m.value}</div>
                  <div className="text-xs text-muted-foreground">{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Step Growth Engine */}
        <section className="mb-32 animate-scroll-fade">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">
            The 5-Step <span className="gradient-text">Growth Engine</span>
          </h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14">
            Every step is designed to maximize ROI and minimize ad spend waste.
          </p>

          <div className="max-w-5xl mx-auto">
            {/* Step Selector — horizontal nav */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {adSteps.map((step, i) => (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeStep === i
                      ? "gradient-bg text-primary-foreground shadow-lg shadow-primary/25"
                      : "glass-card text-muted-foreground hover:text-foreground hover:scale-105"
                  }`}
                >
                  <span className="font-bold">{i + 1}</span>
                  <span className="hidden sm:inline">{step.subtitle}</span>
                </button>
              ))}
            </div>

            {/* Active Step Card */}
            <div className="glass-card-glow rounded-2xl p-8 md:p-12 transition-all">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shrink-0">
                  {(() => {
                    const Icon = adSteps[activeStep].icon;
                    return <Icon size={28} className="text-primary-foreground" />;
                  })()}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold gradient-bg text-primary-foreground px-2.5 py-1 rounded-lg inline-block mb-3">
                    Step {activeStep + 1} of 5
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    {adSteps[activeStep].title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                    {adSteps[activeStep].description}
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {adSteps[activeStep].details.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full gradient-bg shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-border/30">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="glass-card px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:scale-105 transition-all disabled:opacity-30"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
                  disabled={activeStep === 4}
                  className="gradient-bg px-4 py-2 rounded-xl text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all disabled:opacity-30 flex items-center gap-2"
                >
                  Next Step <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {adSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeStep ? "w-8 gradient-bg" : i < activeStep ? "w-4 bg-primary/40" : "w-4 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="animate-scroll-fade text-center">
          <div className="glass-card-glow rounded-2xl p-10 md:p-14 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Lower Your Ad Costs</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Get a custom strategy built around your brand, audience, and goals.
            </p>
            <Link
              to="/contact"
              className="gradient-bg px-8 py-4 rounded-xl text-base font-semibold text-primary-foreground hover:opacity-90 transition-all hover:scale-105 inline-block"
            >
              Request a Free Consultation
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Advertisement;
