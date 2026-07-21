import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';

interface InventorySparklineProps {
  baseStock: number;
  productId: string;
  theme: string;
}

export const InventorySparkline: React.FC<InventorySparklineProps> = ({
  baseStock,
  productId,
  theme,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    stock: number;
    x: number;
    y: number;
  } | null>(null);

  // Generate deterministic 6-month stock history based on baseStock
  const data = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const result = [];
    
    for (let i = 5; i >= 0; i--) {
      const offset = Math.sin(hash + i) * 15 + (hash % 10) - 5;
      const val = Math.max(4, Math.min(100, Math.round(baseStock + offset)));
      
      result.push({
        label: months[5 - i],
        stock: i === 0 ? baseStock : val,
      });
    }
    return result;
  }, [baseStock, productId]);

  const width = 240;
  const height = 110;
  const padding = { top: 15, right: 20, bottom: 20, left: 25 };

  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([padding.left, width - padding.right]);
  }, [data.length, padding.left, padding.right, width]);

  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, 100])
      .range([height - padding.bottom, padding.top]);
  }, [padding.bottom, padding.top, height]);

  const linePath = useMemo(() => {
    const lineGenerator = d3.line<{ label: string; stock: number }>()
      .x((_, i) => xScale(i))
      .y(d => yScale(d.stock))
      .curve(d3.curveMonotoneX);
    return lineGenerator(data) || '';
  }, [data, xScale, yScale]);

  const areaPath = useMemo(() => {
    const areaGenerator = d3.area<{ label: string; stock: number }>()
      .x((_, i) => xScale(i))
      .y0(height - padding.bottom)
      .y1(d => yScale(d.stock))
      .curve(d3.curveMonotoneX);
    return areaGenerator(data) || '';
  }, [data, xScale, yScale, height, padding.bottom]);

  const colors = useMemo(() => {
    if (theme === 'cyberpunk') {
      return {
        line: '#ec4899',
        glow: 'rgba(236, 72, 153, 0.4)',
        areaStart: 'rgba(236, 72, 153, 0.25)',
        areaEnd: 'rgba(0, 240, 255, 0.0)',
        dot: '#00f0ff',
        text: '#ec4899',
        grid: 'rgba(236, 72, 153, 0.1)',
      };
    } else if (theme === 'day') {
      return {
        line: '#db2777',
        glow: 'rgba(219, 39, 119, 0.2)',
        areaStart: 'rgba(219, 39, 119, 0.15)',
        areaEnd: 'rgba(255, 255, 255, 0)',
        dot: '#db2777',
        text: '#db2777',
        grid: 'rgba(219, 39, 119, 0.08)',
      };
    } else {
      return {
        line: '#f43f5e',
        glow: 'rgba(244, 63, 94, 0.3)',
        areaStart: 'rgba(244, 63, 94, 0.2)',
        areaEnd: 'rgba(15, 23, 42, 0)',
        dot: '#fb7185',
        text: '#fecdd3',
        grid: 'rgba(255, 255, 255, 0.05)',
      };
    }
  }, [theme]);

  return (
    <div 
      className="sparkline-card-container absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col justify-between p-3 select-none z-20 font-mono text-[9px] rounded-2xl border border-pink-500/20"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center pb-1 border-b border-white/5">
        <span className="font-extrabold uppercase tracking-widest text-[9px] text-cyan-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
          6M Stock Trend Sparkline
        </span>
        <span className="text-[8px] text-slate-400">Range: <b>0 - 100 units</b></span>
      </div>

      <div className="relative flex-1 flex items-center justify-center mt-1">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`} 
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={`area-grad-inv-${productId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.areaStart} />
              <stop offset="100%" stopColor={colors.areaEnd} />
            </linearGradient>
            <filter id={`glow-inv-${productId}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1={padding.left} y1={yScale(20)} x2={width - padding.right} y2={yScale(20)} stroke={colors.grid} strokeDasharray="2,2" />
          <line x1={padding.left} y1={yScale(80)} x2={width - padding.right} y2={yScale(80)} stroke={colors.grid} strokeDasharray="2,2" />

          {/* Fill Area */}
          <path 
            d={areaPath} 
            fill={`url(#area-grad-inv-${productId})`} 
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
            filter={theme === 'cyberpunk' ? `url(#glow-inv-${productId})` : undefined}
            style={{
              strokeDasharray: 600,
              strokeDashoffset: 600,
              animation: 'sparkline-draw 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards'
            }}
          />

          {/* Interaction Dots */}
          {data.map((d, i) => {
            const cx = xScale(i);
            const cy = yScale(d.stock);
            const isHovered = hoveredPoint && hoveredPoint.date === d.label;

            return (
              <g key={i}>
                {isHovered && (
                  <>
                    <line x1={cx} y1={padding.top} x2={cx} y2={height - padding.bottom} stroke={colors.line} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="1,1" />
                    <circle cx={cx} cy={cy} r="6" fill="transparent" stroke={colors.line} strokeWidth="1" strokeOpacity="0.6" />
                  </>
                )}

                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={isHovered ? "4" : "2"} 
                  fill={isHovered ? colors.dot : colors.line}
                  className="transition-all duration-150 cursor-crosshair"
                  onMouseEnter={() => setHoveredPoint({ date: d.label, stock: d.stock, x: cx, y: cy })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {i % 2 === 0 && (
                  <text x={cx} y={height - 5} textAnchor="middle" fill="#94a3b8" fontSize="7" className="opacity-70 font-sans">
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {hoveredPoint ? (
          <div 
            className="absolute p-1.5 bg-slate-900 border border-pink-500/30 text-[9px] rounded shadow-xl flex flex-col pointer-events-none gap-0.5 z-30"
            style={{
              left: Math.max(5, Math.min(width - 80, hoveredPoint.x - 35)),
              top: Math.max(2, hoveredPoint.y - 42),
            }}
          >
            <span className="text-slate-400 font-sans text-[7px]">{hoveredPoint.date}</span>
            <span className="text-pink-400 font-extrabold font-mono">{hoveredPoint.stock} units</span>
          </div>
        ) : (
          <div className="absolute bottom-2.5 left-6 text-[7px] text-slate-500 uppercase tracking-widest animate-pulse font-sans">
            Hover points to scan stocks
          </div>
        )}
      </div>
    </div>
  );
};
