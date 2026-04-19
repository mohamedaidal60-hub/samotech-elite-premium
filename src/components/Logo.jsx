import React from 'react';
import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
      <div style={{ position: 'relative', width: '40px', height: '40px' }}>
        {/* Animated outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid var(--color-primary)',
            borderRadius: '12px',
            opacity: 0.5
          }}
        />
        {/* Animated inner square */}
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            inset: '8px',
            background: 'var(--color-primary)',
            borderRadius: '6px',
            boxShadow: '0 0 15px var(--color-secondary)'
          }}
        />
        {/* Global network dots */}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            width: '8px',
            height: '8px',
            background: 'var(--color-secondary)',
            borderRadius: '50%'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ 
          fontSize: '1.4rem', 
          fontWeight: 900, 
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, var(--color-dark) 0%, var(--color-primary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          GROWTH
        </span>
        <span style={{ 
          fontSize: '1.4rem', 
          fontWeight: 300, 
          letterSpacing: '2px',
          color: 'var(--color-secondary)'
        }}>
          PARTNERS
        </span>
      </div>
    </div>
  );
}
