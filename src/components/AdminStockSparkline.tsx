import React, { useMemo } from 'react';
import * as d3 from 'd3';

interface AdminStockSparklineProps {
  baseStock: number;
  productId: string;
  theme?: string;
}

export const AdminStockSparkline: React.FC<AdminStockSparklineProps> = ({
  baseStock,
  productId,
  theme,
}) => {
  const data = useMemo(() => {
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Generate simulated 7-day history: index 6 is today (baseStock), 0 to 5 are previous days
    return Array.from({ length: 7 }, (_, i) => {
      const dayOffset = 6 - i; // 6, 5, 4, 3, 2, 1, 0 days ago
      const wave = Math.sin(hash + i) * 4;
      const noise = (hash * (i + 1)) % 5 - 2;
      const stockVal = Math.max(0, Math.round(baseStock + wave + noise));
      return {
        day: `${dayOffset}d ago`,
        stock: i === 6 ? baseStock : stockVal,
      };
    });
  }, [baseStock, productId]);

  const width = 100;
  const height = 24;
  const padding = { top: 2, right: 2, bottom: 2, left: 2 };

  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, 6])
      .range([padding.left, width - padding.right]);
  }, [padding.left, padding.right, width]);

  const yScale = useMemo(() => {
    const stocks = data.map(d => d.stock);
    const minStock = Math.min(...stocks, 0);
    const maxStock = Math.max(...stocks, 10);
    return d3.scaleLinear()
      .domain([minStock, maxStock])
      .range([height - padding.bottom, padding.top]);
  }, [data, padding.bottom, padding.top, height]);

  const linePath = useMemo(() => {
    const lineGenerator = d3.line<{ day: string; stock: number }>()
      .x((_, i) => xScale(i))
      .y(d => yScale(d.stock))
      .curve(d3.curveMonotoneX);
    return lineGenerator(data) || '';
  }, [data, xScale, yScale]);

  const areaPath = useMemo(() => {
    const areaGenerator = d3.area<{ day: string; stock: number }>()
      .x((_, i) => xScale(i))
      .y0(height - padding.bottom)
      .y1(d => yScale(d.stock))
      .curve(d3.curveMonotoneX);
    return areaGenerator(data) || '';
  }, [data, xScale, yScale, height, padding.bottom]);

  const strokeColor = baseStock < 5 ? '#f43f5e' : '#10b981';
  const areaColor = baseStock < 5 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)';

  return (
    <div className="flex items-center gap-2 group/spark">
      <div className="relative" style={{ width, height }} title={`7-day Stock Fluctuations: ${data.map(d => `${d.day}:${d.stock}`).join(', ')}`}>
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <linearGradient id={`admin-spark-area-${productId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Area under line */}
          <path d={areaPath} fill={`url(#admin-spark-area-${productId})`} />

          {/* Sparkline Path */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* End point dot */}
          <circle
            cx={xScale(6)}
            cy={yScale(baseStock)}
            r="2.5"
            fill={strokeColor}
            className="animate-pulse"
          />
        </svg>
      </div>
      <div className="flex flex-col text-[9px] font-mono leading-none text-slate-400 group-hover/spark:text-slate-200 transition-colors">
        <span className="text-[7px] uppercase text-slate-500">7D Range</span>
        <span>{Math.min(...data.map(d => d.stock))} - {Math.max(...data.map(d => d.stock))}</span>
      </div>
    </div>
  );
};
