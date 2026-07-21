import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface ParallaxCardProps {
  id: string;
  theme: string;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  children: React.ReactNode;
  layoutId?: string;
}

export const ParallaxCard: React.FC<ParallaxCardProps> = ({
  id,
  theme,
  isLoading = false,
  onClick,
  className = '',
  children,
  layoutId,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for normalized mouse positions (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configuration for premium tactile elasticity
  const springConfig = { damping: 22, stiffness: 160, mass: 0.6 };

  // 3D rotation calculations (tilt) - Balanced intensity for smooth, premium 3D tilt without clipping
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  // 2D translation offsets (magnetic pull toward cursor) - Balanced kinetic feel
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-6, 6]), springConfig);

  // Scale spring
  const scale = useSpring(1, springConfig);

  // Holographic reflection shine background tracking
  const shineBackground = useTransform(
    [mouseX, mouseY],
    ([x, y]) => {
      const px = ((x as number) + 0.5) * 100;
      const py = ((y as number) + 0.5) * 100;
      if (theme === 'cyberpunk') {
        return `radial-gradient(circle at ${px}% ${py}%, rgba(0, 240, 255, 0.25) 0%, rgba(236, 72, 153, 0.15) 35%, transparent 70%)`;
      } else if (theme === 'day') {
        return `radial-gradient(circle at ${px}% ${py}%, rgba(99, 102, 241, 0.12) 0%, transparent 60%)`;
      } else {
        return `radial-gradient(circle at ${px}% ${py}%, rgba(129, 140, 248, 0.15) 0%, transparent 65%)`;
      }
    }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);

    // Parallax sub-element image alignment if any element has .parallax-img class
    const img = card.querySelector('.parallax-img');
    if (img) {
      (img as HTMLElement).style.transform = `scale(1.05) translate(${normalizedX * 10}px, ${normalizedY * 10}px)`;
    }
  };

  const handleMouseEnter = () => {
    scale.set(1.02);

    const card = cardRef.current;
    if (card) {
      const img = card.querySelector('.parallax-img');
      if (img) {
        (img as HTMLElement).style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
      }
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        // Subtle haptic single tap for starting connection
        navigator.vibrate(12);
      } catch (err) {
        // ignore haptic errors
      }
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);

    const card = cardRef.current;
    if (card) {
      const img = card.querySelector('.parallax-img');
      if (img) {
        (img as HTMLElement).style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        (img as HTMLElement).style.transform = 'scale(1) translate(0px, 0px)';
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      layoutId={layoutId}
      style={{
        scale,
      }}
      className={`group intense-hover-card all-products-glowing-shadow rounded-3xl p-5 border relative flex flex-col justify-between cursor-pointer transition-shadow duration-300 theme-${theme} ${
        isLoading ? 'is-loading' : ''
      } ${
        theme === 'day'
          ? 'bg-white border-slate-200/80 shadow-sm hover:shadow-xl'
          : theme === 'night'
            ? 'bg-slate-900 border-slate-800 hover:border-slate-700/80 shadow-md hover:shadow-indigo-950/20'
            : 'bg-slate-950/80 border-pink-500/20 hover:border-pink-500/60 shadow-xl'
      } ${className}`}
    >
      {/* Holographic interactive reflection shine layer */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay overflow-hidden"
        style={{
          background: shineBackground,
        }}
      />
      {children}
    </motion.div>
  );
};
