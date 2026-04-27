import { motion } from "framer-motion";

const WorkflowNodesBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Nodes */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={i}
            r="4"
            fill="#863bff"
            animate={{
              cx: [`${10 + i * 12}%`, `${15 + i * 12}%`, `${10 + i * 12}%`],
              cy: [`${20 + (i % 3) * 20}%`, `${25 + (i % 3) * 20}%`, `${20 + (i % 3) * 20}%`],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Lines */}
        <motion.path
          d="M 10% 20% L 22% 40% L 34% 20% L 46% 60% L 58% 40% L 70% 80% L 82% 40%"
          stroke="#863bff"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        />
      </svg>
    </div>
  );
};

export default WorkflowNodesBackground;
