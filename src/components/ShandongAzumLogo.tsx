import React from 'react';

interface ShandongAzumLogoProps {
  className?: string;
  showText?: boolean;
  theme?: 'day' | 'night' | 'cyberpunk';
}

export const ShandongAzumLogo: React.FC<ShandongAzumLogoProps> = ({
  className = 'h-12',
  showText = true,
  theme
}) => {
  // If theme is explicitly passed, use it, otherwise fall back to tailwind's dark: mode
  const textClassShan = theme 
    ? (theme === 'day' ? 'text-black' : 'text-white')
    : 'text-black dark:text-white';
    
  const textClassAzum = theme
    ? (theme === 'day' ? 'text-black' : 'text-slate-200')
    : 'text-black dark:text-slate-200';

  return (
    <div className={`inline-flex items-center gap-4 ${className}`}>
      {/* Red SA Emblem */}
      <svg
        viewBox="0 0 240 120"
        className="h-full w-auto select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized Red S and A */}
        {/* S shape loop */}
        <path
          d="M100 25H25C15.6 25 8 32.6 8 42C8 51.4 15.6 59 25 59H75C84.4 59 92 66.6 92 76C92 85.4 84.4 93 75 93H5"
          stroke="#E52E2E"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* A shape connecting diagonal */}
        <path
          d="M80 93L135 25L190 93"
          stroke="#E52E2E"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner crossbar / triangle in A */}
        <path
          d="M152 93H122L137 72L152 93Z"
          fill="#E52E2E"
        />
      </svg>

      {/* Brand Text Section */}
      {showText && (
        <div className="flex flex-col justify-center select-none font-sans">
          {/* Shandong (Shan is dark/light, dong is red) */}
          <div className="text-sm font-serif font-black tracking-wide leading-none flex items-center">
            <span className={textClassShan}>Shan</span>
            <span className="text-[#E52E2E]">dong</span>
          </div>
          {/* AZUM (Large bold serif) */}
          <div className={`text-3xl font-serif font-extrabold tracking-widest leading-none mt-1 uppercase ${textClassAzum}`}>
            Azum
          </div>
          {/* Subtitle */}
          <div className="text-[8px] font-sans font-medium tracking-wider uppercase text-slate-500 mt-1">
            your Solution for global import
          </div>
        </div>
      )}
    </div>
  );
};

