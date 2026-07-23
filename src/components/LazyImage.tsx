import React, { useState, useEffect, useRef } from 'react';
import { getProductImageUrl } from '../mockData';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  theme?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  referrerPolicy,
  theme = 'cyberpunk'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(() => getProductImageUrl(src));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resolved = getProductImageUrl(src);
    setCurrentSrc(resolved);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const containerBg = theme === 'day' 
    ? 'bg-slate-50 border border-slate-100' 
    : theme === 'night' 
      ? 'bg-slate-900 border border-slate-800' 
      : 'bg-slate-950/80 border border-slate-900';

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden rounded-2xl ${containerBg}`}>
      {/* Skeleton Screen while loading */}
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 z-10 flex flex-col justify-between p-4 animate-pulse ${
          theme === 'day' 
            ? 'bg-slate-100' 
            : 'bg-gradient-to-br from-[#0c0f1d] via-[#12162a] to-[#070914]'
        }`}>
          {/* Skeleton Top Accents */}
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 rounded-full bg-slate-800/40" />
            <div className="w-16 h-4 rounded-lg bg-slate-800/40" />
          </div>
          {/* Skeleton Center Graphic Placeholder */}
          <div className="w-16 h-16 rounded-2xl bg-slate-800/20 mx-auto border border-slate-800/40 flex items-center justify-center">
            <div className="w-8 h-8 rounded bg-slate-800/30" />
          </div>
          {/* Skeleton Bottom Accents */}
          <div className="space-y-2">
            <div className="w-2/3 h-3.5 bg-slate-800/40 rounded" />
            <div className="w-1/2 h-2.5 bg-slate-800/20 rounded" />
          </div>
          {/* Shimmer overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      )}

      {/* Actual Image */}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true); // Clear skeleton
        }}
        className={`${className} transition-all duration-500 ease-out ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-md'
        }`}
        referrerPolicy={referrerPolicy}
      />
    </div>
  );
};
