import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

interface StockHistoryChartProps {
  productId: string;
  theme: string;
}

export const StockHistoryChart: React.FC<StockHistoryChartProps> = ({ productId, theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate deterministic 30-day stock fluctuation data based on productId
  const data = useMemo(() => {
    const points = [];
    const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let currentStock = Math.abs(seed % 45) + 20;

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      // Deterministic change seed
      const changeSeed = Math.sin(seed + i * 2.3) * 7 + Math.cos(i * 1.7) * 3;
      currentStock = Math.max(2, Math.min(95, Math.round(currentStock + changeSeed)));
      points.push({ date: formattedDate, stock: currentStock });
    }
    return points;
  }, [productId]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous SVG content to prevent redraw stacking
    containerRef.current.innerHTML = '';

    const width = containerRef.current.clientWidth || 240;
    const height = 90;
    const margin = { top: 12, right: 10, bottom: 20, left: 24 };

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'overflow-visible');

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, 29])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    // Line builder
    const line = d3.line<{ date: string; stock: number }>()
      .x((_, i) => xScale(i))
      .y(d => yScale(d.stock))
      .curve(d3.curveMonotoneX);

    // Area builder
    const area = d3.area<{ date: string; stock: number }>()
      .x((_, i) => xScale(i))
      .y0(height - margin.bottom)
      .y1(d => yScale(d.stock))
      .curve(d3.curveMonotoneX);

    // Area gradient under the line
    const gradientId = `stock-area-grad-${productId}`;
    const defs = svg.append('defs');
    const linearGrad = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    const gradColor = theme === 'cyberpunk' ? '#00f0ff' : '#10b981';

    linearGrad.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', gradColor)
      .attr('stop-opacity', 0.25);

    linearGrad.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', gradColor)
      .attr('stop-opacity', 0);

    // Draw reference line at y=50 (Stock threshold half way mark)
    svg.append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', yScale(50))
      .attr('y2', yScale(50))
      .attr('stroke', theme === 'day' ? '#e2e8f0' : '#1e293b')
      .attr('stroke-dasharray', '2 2')
      .attr('stroke-width', 1);

    // Draw Area
    svg.append('path')
      .datum(data)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', area);

    // Draw Line with premium draw-in transition animation
    const path = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', gradColor)
      .attr('stroke-width', 1.8)
      .attr('d', line);

    try {
      const totalLength = (path.node() as SVGPathElement).getTotalLength();
      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1400)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);
    } catch (e) {
      console.warn("SVG getTotalLength not supported in this environment:", e);
    }

    // Render interactive circles on critical start, middle, and end points
    const criticalIndices = [0, 14, 29];
    svg.selectAll('.critical-dot')
      .data(criticalIndices.map(idx => ({ d: data[idx], idx })))
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.idx))
      .attr('cy', d => yScale(d.d.stock))
      .attr('r', 3)
      .attr('fill', theme === 'cyberpunk' ? '#ec4899' : '#4f46e5')
      .attr('stroke', theme === 'day' ? '#ffffff' : '#020617')
      .attr('stroke-width', 1.2);

    // Axes Layout
    const xAxis = d3.axisBottom(xScale)
      .tickValues([0, 14, 29])
      .tickFormat(i => data[i as number]?.date || '');

    const yAxis = d3.axisLeft(yScale)
      .ticks(3)
      .tickFormat(v => `${v}%`);

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .attr('class', `text-[7px] font-mono ${theme === 'day' ? 'text-slate-500' : 'text-slate-400'}`)
      .call(xAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove());

    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .attr('class', `text-[7px] font-mono ${theme === 'day' ? 'text-slate-500' : 'text-slate-400'}`)
      .call(yAxis)
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').remove());

  }, [data, productId, theme]);

  return (
    <div className="bg-slate-950/90 border border-slate-900 rounded-xl p-2.5 mt-2 transition-all duration-300">
      <div ref={containerRef} className="w-full h-[90px]" />
    </div>
  );
};
