import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Card from './Card';

interface AnimatedCardProps {
  card: string | null;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onAnimationComplete: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  card, 
  startPosition, 
  endPosition, 
  onAnimationComplete 
}) => {
  return (
    <motion.div
      initial={startPosition}
      animate={endPosition}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        onAnimationComplete();
        if (window.resolveCardAnimation) {
          window.resolveCardAnimation();
          window.resolveCardAnimation = null;
        }
      }}
      style={{ position: 'absolute', zIndex: 1000 }}
    >
      {card != "" ?
        <Card value={card[0]} suit={card[1]} /> :
        <Card hidden/>
      }
    </motion.div>
  );
};

export default AnimatedCard;