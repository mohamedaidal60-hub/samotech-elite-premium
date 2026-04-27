import { motion } from "framer-motion";

const LightTunnelBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <svg width="100%" height="100%" className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.rect
            key={i}
            x="0"
            y={i * 10 + "%"}
            width="100%"
            height="1"
            fill="url(#grad1)"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.5, 0] }}
            transition={{ 
              duration: 2 + i, 
              repeat: Infinity, 
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#863bff', stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: '#863bff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#863bff', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LightTunnelBackground;
