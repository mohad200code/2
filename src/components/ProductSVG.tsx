/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ProductSVGProps {
  type: string;
  color: string;
  className?: string;
}

export const ProductSVG: React.FC<ProductSVGProps> = ({ type, color, className = 'w-full h-full' }) => {
  // Ensure we have a valid color fallback
  const fillColor = color || '#CBD5E1';

  switch (type) {
    case 'tshirt':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          id={`svg-tshirt-${color.replace('#', '')}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* T-shirt main body */}
          <path
            d="M30 15 L38 20 L42 16 C45 18, 55 18, 58 16 L62 20 L70 15 L78 30 L68 35 L68 85 L32 85 L32 35 L22 30 Z"
            fill={fillColor}
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Collar detail */}
          <path
            d="M42 16 C45 22, 55 22, 58 16"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Sleeve cuffs */}
          <path d="M22 30 L26 31.5" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M78 30 L74 31.5" stroke="#1E293B" strokeWidth="1.5" />
          {/* Inner label stitching shadow */}
          <rect x="46" y="22" width="8" height="4" rx="1" fill="#94A3B8" opacity="0.3" />
        </svg>
      );

    case 'shoe':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          id={`svg-shoe-${color.replace('#', '')}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sneaker main upper body */}
          <path
            d="M15 65 C15 50, 20 40, 32 35 L48 20 C52 18, 55 22, 52 28 L48 38 L65 42 L85 55 C90 60, 85 68, 75 68 L15 68 Z"
            fill={fillColor}
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Sole */}
          <path
            d="M12 68 L85 68 C88 68, 88 74, 84 74 L14 74 C11 74, 11 68, 12 68 Z"
            fill="#F1F5F9"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Distinct Sdazum-style swoop overlay */}
          <path
            d="M40 48 Q55 52 65 43 Q58 56 45 54 Z"
            fill="#1E293B"
            opacity="0.9"
            stroke="#F8FAFC"
            strokeWidth="1"
          />
          {/* Shoe laces detail */}
          <path
            d="M48 28 L43 35 M45 30 L39 37 M42 32 L36 39"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Heel counter reinforcement */}
          <path
            d="M15 65 C16 55, 22 55, 23 68"
            stroke="#1E293B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Front toe guard */}
          <path
            d="M80 60 C83 62, 85 65, 85 68"
            stroke="#1E293B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'hoodie':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          id={`svg-hoodie-${color.replace('#', '')}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hoodie main jacket body */}
          <path
            d="M28 24 L38 28 L41 22 C44 24, 56 24, 59 22 L62 28 L72 24 L82 38 L72 44 L72 82 L28 82 L28 44 L18 38 Z"
            fill={fillColor}
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Hood overlay */}
          <path
            d="M41 22 C32 15, 41 4, 50 4 C59 4, 68 15, 59 22 C55 24, 45 24, 41 22 Z"
            fill={fillColor}
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Hood inner shadow/opening */}
          <path
            d="M45 18 C47 16, 53 16, 55 18 C52 23, 48 23, 45 18 Z"
            fill="#1E293B"
            opacity="0.8"
          />
          {/* Kangaroo Pocket */}
          <path
            d="M38 62 L62 62 L58 76 L42 76 Z"
            fill="none"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M38 62 L42 76 M62 62 L58 76" stroke="#1E293B" strokeWidth="1.5" />
          {/* Drawstrings */}
          <path d="M47 22 L45 36 M53 22 L55 34" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          {/* Bottom waistband and sleeve cuffs ribs */}
          <path d="M28 80 L72 80" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );

    case 'shirt':
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          id={`svg-shirt-${color.replace('#', '')}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Denim Shirt body */}
          <path
            d="M28 16 L38 20 L44 14 L50 20 L56 14 L62 20 L72 16 L80 34 L70 38 L70 85 L30 85 L30 38 L20 34 Z"
            fill={fillColor}
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Collar fold wings */}
          <path d="M38 20 L44 14 L46 22 Z" fill="#1E293B" opacity="0.2" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M62 20 L56 14 L54 22 Z" fill="#1E293B" opacity="0.2" stroke="#1E293B" strokeWidth="1.5" />
          {/* Front button placket line */}
          <path d="M50 22 L50 85" stroke="#1E293B" strokeWidth="2" strokeDasharray="3 3" />
          {/* Left chest pocket */}
          <path
            d="M35 38 L43 38 L43 50 L39 54 L35 50 Z"
            fill="none"
            stroke="#1E293B"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Inner shirt contrast panel (white tee peak) */}
          <path d="M46 22 L50 28 L54 22 Z" fill="#F8FAFC" stroke="#1E293B" strokeWidth="1.5" />
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 100 100"
          className={className}
          id={`svg-fallback-${color.replace('#', '')}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="20" y="20" width="60" height="60" rx="8" fill={fillColor} stroke="#1E293B" strokeWidth="2" />
          <circle cx="50" cy="50" r="15" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );
  }
};
