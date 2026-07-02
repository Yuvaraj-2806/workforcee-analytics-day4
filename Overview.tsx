// File Name: Overview.tsx
import React, { useState } from 'react';
import './Overview.css';

// ==========================================
// DYNAMIC SVG AREA CHART (Spline curve)
// ==========================================
interface AreaDataPoint {
  name: string;
  value: number;
}

interface AreaChartProps {
  data: AreaDataPoint[];
  height?: number;
  color?: string;
  strokeWidth?: number;
}

function AreaChart({ data = [], height = 220, color = "#2563eb", strokeWidth = 3 }: AreaChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 500;
  const paddingX = 40;
  const paddingY = 40;

  if (!data || data.length === 0) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Data Available</div>;

  const yTicks = [900, 1000, 1100, 1200, 1300];
  const minVal = 900;
  const maxVal = 1300;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY - 30;

  const points = data.map((d, index) => {
    const x = paddingX + (index * chartWidth) / (data.length - 1 || 1);
    const y = height - 30 - ((d.value - minVal) * chartHeight) / (maxVal - minVal || 1);
    return { x, y, name: d.name, value: d.value };
  });

  // Calculate curved path using Bezier curves
  let pathD = "";
  let areaD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const dx = p1.x - p0.x;
      const cp1x = p0.x + dx / 3;
      const cp1y = p0.y;
      const cp2x = p0.x + (2 * dx) / 3;
      const cp2y = p1.y;
      pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    areaD = `${pathD} L ${points[points.length - 1].x} ${height - 30} L ${points[0].x} ${height - 30} Z`;
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const activeIndex = hoveredIndex !== null ? hoveredIndex : points.length - 1;
  const activePoint = points[activeIndex];
  const colStepWidth = chartWidth / (data.length - 1 || 1);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`area-grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Axis Gridlines & Labels */}
        {yTicks.map((tickVal, i) => {
          const ratio = (tickVal - minVal) / (maxVal - minVal);
          const y = height - 30 - ratio * chartHeight;
          return (
            <g key={i} opacity="0.4">
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
              <text x={paddingX - 10} y={y + 3} fill="#64748b" fontSize="9" fontWeight="500" textAnchor="end">
                {formatNumber(tickVal)}
              </text>
            </g>
          );
        })}

        {/* X Axis Labels */}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={height - 8} fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="500">
            {p.name}
          </text>
        ))}

        {/* Area Fill */}
        {areaD && <path d={areaD} fill={`url(#area-grad-${color.replace("#", "")})`} style={{ transition: 'all 0.3s ease' }} />}

        {/* Vertical Guide Line */}
        {hoveredIndex !== null && (
          <line
            x1={points[hoveredIndex].x}
            y1={paddingY - 10}
            x2={points[hoveredIndex].x}
            y2={height - 30}
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
            style={{ transition: 'x1 0.1s ease, x2 0.1s ease' }}
          />
        )}

        {/* Stroke Line */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'all 0.3s ease' }}
          />
        )}

        {/* Draw Line Nodes */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={activeIndex === i ? "6.5" : "4.5"}
              fill={color}
              stroke="white"
              strokeWidth="2"
              style={{ transition: 'all 0.15s ease' }}
            />
          </g>
        ))}

        {/* Tooltip Overlay Bubble */}
        {activePoint && (
          <g transform={`translate(${activePoint.x}, ${activePoint.y - 12})`} style={{ transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
            <path
              d="M -22 -18 h 44 a 4 4 0 0 1 4 4 v 10 a 4 4 0 0 1 -4 4 h -18 l -4 4 l -4 -4 h -18 a 4 4 0 0 1 -4 -4 v -10 a 4 4 0 0 1 4 -4 z"
              fill={color}
              filter="drop-shadow(0 2px 4px rgba(15, 23, 42, 0.15))"
            />
            <text x="0" y="-8" fill="white" fontSize="9.5" fontWeight="700" textAnchor="middle">
              {formatNumber(activePoint.value)}
            </text>
          </g>
        )}

        {/* Invisible Hitbox Columns for Hover Detection */}
        {points.map((p, i) => (
          <rect
            key={`hitbox-${i}`}
            x={p.x - colStepWidth / 2}
            y={paddingY - 10}
            width={colStepWidth}
            height={chartHeight + 20}
            fill="transparent"
            style={{ cursor: 'pointer', pointerEvents: 'all' }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </svg>
    </div>
  );
}

// ==========================================
// WORKFORCE OVERVIEW COMPONENT
// ==========================================
interface GrowthTrendPoint {
  name: string;
  value: number;
}

interface OverviewProps {
  data: GrowthTrendPoint[];
}

export function Overview({ data }: OverviewProps) {
  return (
    <div className="glass-card">
      <div className="card-header-flex">
        <div>
          <h2>Workforce Overview</h2>
          <div style={{ color: '#64748b', fontSize: '11.5px', marginTop: '2px' }}>
            Employee count trend over the last 6 months
          </div>
        </div>
        <select className="chart-select" defaultValue="last-6-months" aria-label="Select date range">
          <option value="last-6-months">Last 6 Months</option>
          <option value="year-to-date">Year to Date</option>
        </select>
      </div>
      <div style={{ width: '100%', marginTop: '10px' }}>
        <AreaChart data={data} height={190} color="#2563eb" />
      </div>
    </div>
  );
}
