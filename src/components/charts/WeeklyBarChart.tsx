import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ThemeScore, CharacterTheme } from '../../types';
import { THEME_DEFINITIONS, THEME_NAMES } from '../../constants/themes';

interface WeeklyBarChartProps {
  scores: ThemeScore[];
  onBarClick?: (theme: CharacterTheme) => void;
  hiddenThemes?: string[];
}

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({
  scores,
  onBarClick,
  hiddenThemes = [],
}) => {
  // Filter out hidden themes and prepare data
  const chartData = scores
    .filter((s) => !hiddenThemes.includes(s.theme))
    .map((score) => ({
      theme: score.theme,
      name: THEME_NAMES[score.theme],
      shortName: THEME_NAMES[score.theme].slice(0, 4),
      score: score.score,
      color: THEME_DEFINITIONS[score.theme].color,
    }));

  const handleClick = (data: any) => {
    if (onBarClick && data?.theme) {
      onBarClick(data.theme);
    }
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="shortName"
            tick={{ fontSize: 10, fill: '#6b7280' }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={50}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            ticks={[0, 2, 4, 6, 8, 10]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white px-4 py-3 rounded-xl shadow-large border border-neutral-100">
                    <p className="font-semibold text-neutral-900">{data.name}</p>
                    <p className="text-neutral-600 mt-1">
                      Score: <span className="font-bold" style={{ color: data.color }}>{data.score}</span>/10
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="score"
            radius={[6, 6, 0, 0]}
            onClick={handleClick}
            cursor="pointer"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className="transition-opacity hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
