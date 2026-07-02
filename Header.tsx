// File Name: Header.tsx
import React from 'react';
import { Employee } from '../types';
import { useKpiCalculator } from '../hooks/useKpiCalculator';
import { 
  FaUsers, FaArrowDown, FaUserPlus, FaShieldAlt 
} from 'react-icons/fa';
import './Header.css';

// Custom Full-Width Sparkline Component matching mockup
interface SparklineProps {
  data: number[];
  color: string;
  showArea?: boolean;
}

function Sparkline({ data = [], color = "#3b82f6", showArea = true }: SparklineProps) {
  if (data.length < 2) return null;
  const width = 100;
  const height = 30;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, index) => {
    const x = (index * width) / (data.length - 1);
    const y = height - 2 - ((val - min) * (height - 4)) / range;
    return { x, y };
  });

  const pointsStr = points.map(p => `${p.x},${p.y}`).join(" ");
  const fillStr = `${points[0].x},${height} ${pointsStr} ${points[points.length - 1].x},${height}`;
  
  const gradId = `spark-grad-${color.replace("#", "")}`;

  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox={`0 0 ${width} ${height}`} 
      preserveAspectRatio="none" 
      style={{ display: 'block', overflow: 'visible' }}
    >
      {showArea && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon points={fillStr} fill={`url(#${gradId})`} />
        </>
      )}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pointsStr}
      />
    </svg>
  );
}

function MiniPieChart({ percentage, color }: { percentage: number; color: string }) {
  const radius = 14;
  const cx = 50;
  const cy = 18;
  const rHalf = radius / 2;
  const circ = 2 * Math.PI * rHalf;
  const strokeDasharray = `${(percentage / 100) * circ} ${circ}`;
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 36" style={{ display: 'block', overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={radius} fill="#f1f5f9" />
      <circle
        cx={cx}
        cy={cy}
        r={rHalf}
        fill="transparent"
        stroke={color}
        strokeWidth={radius}
        strokeDasharray={strokeDasharray}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </svg>
  );
}

function MiniDonutChart({ percentage, color }: { percentage: number; color: string }) {
  const radius = 14;
  const cx = 50;
  const cy = 18;
  const strokeWidth = 5;
  const innerRadius = radius - strokeWidth / 2;
  const circ = 2 * Math.PI * innerRadius;
  const strokeDasharray = `${(percentage / 100) * circ} ${circ}`;
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 36" style={{ display: 'block', overflow: 'visible' }}>
      <circle cx={cx} cy={cy} r={innerRadius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
      <circle
        cx={cx}
        cy={cy}
        r={innerRadius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        transform={`rotate(-90 ${cx} ${cy})`}
        strokeLinecap="round"
      />
    </svg>
  );
}

interface HeaderProps {
  title: string;
  description: string;
  employees: Employee[];
}

export function Header({ title, description, employees }: HeaderProps) {
  const { totalEmployees, attritionRate, hiringRate, skillCoverage } = useKpiCalculator(employees);

  const kpiData = [
    {
      id: 1,
      title: "Employees",
      value: totalEmployees.toLocaleString(),
      growth: "↑ 5.2%",
      color: "#2563eb",
      bgColor: "#eff6ff",
      trendColor: "#10b981",
      icon: <FaUsers />,
      chart: <Sparkline data={[16, 17, 17, 18, 19, totalEmployees]} color="#2563eb" showArea={false} />
    },
    {
      id: 2,
      title: "Attrition",
      value: `${attritionRate}%`,
      growth: "↓ 1.3%",
      color: "#ef4444",
      bgColor: "#fef2f2",
      trendColor: "#10b981",
      icon: <FaArrowDown style={{ transform: 'rotate(-45deg)' }} />,
      chart: <Sparkline data={[12, 11, 10, 11, 10, attritionRate]} color="#ef4444" showArea={true} />
    },
    {
      id: 3,
      title: "Hiring Rate",
      value: `${hiringRate}%`,
      growth: "↑ 0.8%",
      color: "#10b981",
      bgColor: "#ecfdf5",
      trendColor: "#10b981",
      icon: <FaUserPlus />,
      chart: <MiniPieChart percentage={hiringRate} color="#10b981" />
    },
    {
      id: 4,
      title: "Skill Coverage",
      value: `${skillCoverage}%`,
      growth: "↑ 3.1%",
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
      trendColor: "#10b981",
      icon: <FaShieldAlt />,
      chart: <MiniDonutChart percentage={skillCoverage} color="#8b5cf6" />
    }
  ];

  return (
    <>
      <header className="header" style={{ marginBottom: '15px' }}>
        <div className="header-left">
          <div>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: '20px' }}>
        {kpiData.map((kpi) => (
          <div className="kpi-card" key={kpi.id}>
            <div className="kpi-top-row">
              <div className="kpi-icon-circle" style={{ background: kpi.bgColor, color: kpi.color }}>
                {kpi.icon}
              </div>
              <div className="kpi-title-val">
                <span>{kpi.title}</span>
                <h2>{kpi.value}</h2>
              </div>
            </div>
            <div className="kpi-trend-row" style={{ color: kpi.trendColor }}>
              {kpi.growth} <span>from last month</span>
            </div>
            <div className="kpi-sparkline-box">
              {kpi.chart}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
