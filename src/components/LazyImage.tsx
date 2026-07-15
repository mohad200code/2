import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  referrerPolicy
}) => {
  const [isIntersected, setIsIntersected] = useState(false);
  const containerRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If the browser doesn't support IntersectionObserver, fallback to instant load
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '150px', // Pre-fetch 150px before entering viewport for an uninterrupted feel
        threshold: 0.01,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <img
      ref={containerRef}
      src={isIntersected ? src : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1 1"></svg>'}
      alt={alt}
      className={`${className} transition-opacity duration-500 ${isIntersected ? 'opacity-100' : 'opacity-20'}`}
      referrerPolicy={referrerPolicy}
    />
  );
};
