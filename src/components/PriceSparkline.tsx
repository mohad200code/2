import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';

interface PriceSparklineProps {
  basePrice: number;
  productId: string;
  theme: string;
}

export const PriceSparkline: React.FC<PriceSparklineProps> = ({
  basePrice,
  productId,
  theme,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    price: number;
    x: number;
    y: number;
  } | null>(null);

  // Generate deterministic 6-month price history based on basePrice and productId
  const data = useMemo(() => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Use simple hash of productId to vary the trend deterministically
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const trendType = hash % 3; // 0: upward, 1: downward, 2: fluctuating
    
    const currentDate = new Date();
    const result = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const label = `${months[date.getMonth()]} ${date.getFullYear().toString().slice(-2)}`;
      
      let factor = 1.0;
      if (trendType === 0) {
        // Upward trend
        factor = 0.82 + (5 - i) * 0.036 + (Math.sin(hash + i) * 0.02);
      } else if (trendType === 1) {
        // Downward trend but settling
        factor = 1.15 - (5 - i) * 0.03 + (Math.cos(hash + i) * 0.02);
      } else {
        // Fluctuating
        factor = 1.0 + (Math.sin(hash + i * 1.5) * 0.08);
      }
      
      // Ensure the latest month matches exactly the current live price
      if (i === 0) {
        factor = 1.0;
      }

      result.push({
        label,
        price: Number((basePrice * factor).toFixed(2)),
      });
    }
    
    return result;
  }, [basePrice, productId]);

  // Width and height of the sparkline overlay
  const width = 240;
  const height = 110;
  const padding = { top: 15, right: 20, bottom: 20, left: 25 };

  // D3 Scales
  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([padding.left, width - padding.right]);
  }, [data.length, padding.left, padding.right, width]);

  const yScale = useMemo(() => {
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    // Give some padding on top/bottom
    const delta = maxPrice - minPrice;
    const yMin = Math.max(0, minPrice - (delta * 0.15 || minPrice * 0.1));
    const yMax = maxPrice + (delta * 0.15 || maxPrice * 0.1);
    
    return d3.scaleLinear()
      .domain([yMin, yMax])
      .range([height - padding.bottom, padding.top]);
  }, [data, padding.bottom, padding.top, height]);

  // D3 Line Generator
  const linePath = useMemo(() => {
    const lineGenerator = d3.line<{ label: string; price: number }>()
      .x((_, i) => xScale(i))
      .y(d => yScale(d.price))
      .curve(d3.curveMonotoneX);
    return lineGenerator(data) || '';
  }, [data, xScale, yScale]);

  // D3 Area Generator for filled gradient under sparkline
  const areaPath = useMemo(() => {
    const areaGenerator = d3.area<{ label: string; price: number }>()
      .x((_, i) => xScale(i))
      .y0(height - padding.bottom)
      .y1(d => yScale(d.price))
      .curve(d3.curveMonotoneX);
    return areaGenerator(data) || '';
  }, [data, xScale, yScale, height, padding.bottom]);

  // Determine colors based on theme
  const colors = useMemo(() => {
    if (theme === 'cyberpunk') {
      return {
        line: '#00f0ff',
        glow: 'rgba(0, 240, 255, 0.4)',
        areaStart: 'rgba(0, 240, 255, 0.25)',
        areaEnd: 'rgba(236, 72, 153, 0.0)',
        dot: '#ec4899',
        text: '#00f0ff',
        grid: 'rgba(0, 240, 255, 0.1)',
      };
    } else if (theme === 'day') {
      return {
        line: '#4f46e5',
        glow: 'rgba(79, 70, 229, 0.2)',
        areaStart: 'rgba(79, 70, 229, 0.15)',
        areaEnd: 'rgba(255, 255, 255, 0)',
        dot: '#4f46e5',
        text: '#4f46e5',
        grid: 'rgba(79, 70, 229, 0.08)',
      };
    } else {
      // night / dark
      return {
        line: '#6366f1',
        glow: 'rgba(99, 102, 241, 0.3)',
        areaStart: 'rgba(99, 102, 241, 0.2)',
        areaEnd: 'rgba(15, 23, 42, 0)',
        dot: '#818cf8',
        text: '#a5b4fc',
        grid: 'rgba(255, 255, 255, 0.05)',
      };
    }
  }, [theme]);

  // Sparkline stats
  const minPrice = useMemo(() => Math.min(...data.map(d => d.price)), [data]);
  const maxPrice = useMemo(() => Math.max(...data.map(d => d.price)), [data]);

  return (
    <div 
      className="sparkline-card-container absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col justify-between p-3 select-none z-20 font-mono text-[9px] rounded-2xl border border-indigo-500/20"
      onClick={(e) => e.stopPropagation()} // Prevent card click trigger
    >
      {/* Title Header */}
      <div className="flex justify-between items-center pb-1 border-b border-white/5">
        <span className="font-extrabold uppercase tracking-widest text-[9px] text-pink-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
          6M Price Sparkline
        </span>
        <div className="flex gap-2 text-[8px] text-slate-400">
          <span>Min: <b className="text-white">${minPrice}</b></span>
          <span>Max: <b className="text-white">${maxPrice}</b></span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex-1 flex items-center justify-center mt-1">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`} 
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={`area-grad-${productId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.areaStart} />
              <stop offset="100%" stopColor={colors.areaEnd} />
            </linearGradient>
            <filter id={`glow-${productId}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <line 
            x1={padding.left} 
            y1={yScale(minPrice)} 
            x2={width - padding.right} 
            y2={yScale(minPrice)} 
            stroke={colors.grid} 
            strokeDasharray="2,2" 
          />
          <line 
            x1={padding.left} 
            y1={yScale(maxPrice)} 
            x2={width - padding.right} 
            y2={yScale(maxPrice)} 
            stroke={colors.grid} 
            strokeDasharray="2,2" 
          />

          {/* Fill Area */}
          <path 
            d={areaPath} 
            fill={`url(#area-grad-${productId})`} 
            style={{
              opacity: 0,
              animation: 'sparkline-area-fade 1.2s cubic-bezier(0.25, 1, 0.5, 1) 0.3s forwards'
            }}
          />

          {/* Line Path */}
          <path 
            d={linePath} 
            fill="none" 
            stroke={colors.line} 
            strokeWidth="2" 
            filter={theme === 'cyberpunk' ? `url(#glow-${productId})` : undefined}
            style={{
              strokeDasharray: 600,
              strokeDashoffset: 600,
              animation: 'sparkline-draw 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards'
            }}
          />

          {/* Interaction Dots and Overlay */}
          {data.map((d, i) => {
            const cx = xScale(i);
            const cy = yScale(d.price);
            const isHovered = hoveredPoint && hoveredPoint.date === d.label;

            return (
              <g key={i}>
                {/* Active hover indicator */}
                {isHovered && (
                  <>
                    <line 
                      x1={cx} 
                      y1={padding.top} 
                      x2={cx} 
                      y2={height - padding.bottom} 
                      stroke={colors.line} 
                      strokeWidth="1" 
                      strokeOpacity="0.4"
                      strokeDasharray="1,1"
                    />
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r="6" 
                      fill="transparent" 
                      stroke={colors.line} 
                      strokeWidth="1"
                      strokeOpacity="0.6"
                    />
                  </>
                )}

                {/* Main dot */}
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={isHovered ? "4" : "2"} 
                  fill={isHovered ? colors.dot : colors.line}
                  className="transition-all duration-150 cursor-crosshair"
                  onMouseEnter={() => setHoveredPoint({ date: d.label, price: d.price, x: cx, y: cy })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* Label tick on X axis */}
                {i % 2 === 0 && (
                  <text
                    x={cx}
                    y={height - 5}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="7"
                    className="opacity-70 font-sans"
                  >
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover values overlay popover */}
        {hoveredPoint ? (
          <div 
            className="absolute p-1.5 bg-slate-900 border border-indigo-500/30 text-[9px] rounded shadow-xl flex flex-col pointer-events-none gap-0.5 z-30"
            style={{
              left: Math.max(5, Math.min(width - 80, hoveredPoint.x - 35)),
              top: Math.max(2, hoveredPoint.y - 42),
            }}
          >
            <span className="text-slate-400 font-sans text-[7px]">{hoveredPoint.date}</span>
            <span className="text-[#00f0ff] font-extrabold font-mono">${hoveredPoint.price}</span>
          </div>
        ) : (
          <div className="absolute bottom-2.5 left-6 text-[7px] text-slate-500 uppercase tracking-widest animate-pulse font-sans">
            Hover points to scan values
          </div>
        )}
      </div>
    </div>
  );
};
