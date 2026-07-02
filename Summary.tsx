// File Name: Summary.tsx
import React from 'react';
import './Summary.css';

// ==========================================
// DYNAMIC SVG DONUT CHART
// ==========================================
interface DonutDataPoint {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutDataPoint[];
}

function DonutChart({ data = [] }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 60;
  const strokeWidth = 16;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;

  let accumulatedPercent = 0;

  return (
    <div className="donut-layout">
      <div className="donut-chart-container">
        <svg viewBox="0 0 150 150" width="100%" height="100%">
          <circle cx="75" cy="75" r={innerRadius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
          {data.map((item, index) => {
            const percentage = item.value / total;
            const strokeLength = percentage * circumference;
            const strokeOffset = circumference - strokeLength + (accumulatedPercent * circumference);
            accumulatedPercent -= percentage;

            return (
              <circle
                key={index}
                cx="75"
                cy="75"
                r={innerRadius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                transform="rotate(-90 75 75)"
              />
            );
          })}
        </svg>
      </div>

      <div className="donut-legends">
        {data.map((item, index) => {
          const percentage = Math.round((item.value / total) * 100);
          return (
            <div className="legend-item" key={index}>
              <div className="legend-left">
                <div className="legend-dot" style={{ background: item.color }} />
                <span className="legend-name">{item.name}</span>
              </div>
              <div className="legend-right">
                {percentage}% <span>({item.value})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// DEPARTMENT SUMMARY COMPONENT
// ==========================================
interface SummaryData {
  name: string;
  value: number;
  color: string;
}

interface SummaryProps {
  data: SummaryData[];
}

export function Summary({ data }: SummaryProps) {
  return (
    <div className="glass-card">
      <h2>Department Summary</h2>
      <div style={{ color: '#64748b', fontSize: '11.5px', marginTop: '2px' }}>
        Employees by department
      </div>
      <div style={{ padding: '5px 0' }}>
        <DonutChart data={data} />
      </div>
    </div>
  );
}
