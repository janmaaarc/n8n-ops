import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import type { Execution } from '../types';

interface ExecutionChartProps {
  executions: Execution[];
  isLoading?: boolean;
}

export const ExecutionChart: React.FC<ExecutionChartProps> = ({ executions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-40 animate-pulse">
        <div className="h-full flex items-end gap-1 px-6">
          {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between px-6 mt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="w-8 h-3 bg-neutral-200 dark:bg-neutral-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const chartData = useMemo(() => {
    const days = 7;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dayExecutions = executions.filter((e) =>
        isSameDay(new Date(e.startedAt), date)
      );
      const success = dayExecutions.filter((e) => e.status === 'success').length;
      const error = dayExecutions.filter((e) => e.status === 'error').length;

      data.push({
        date: format(date, 'MMM d'),
        success,
        error,
        total: success + error,
      });
    }

    return data;
  }, [executions]);

  const hasData = chartData.some((d) => d.total > 0);

  if (!hasData) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
        No execution data for the past 7 days
      </div>
    );
  }

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#fff',
            }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Area
            type="monotone"
            dataKey="success"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#successGradient)"
            name="Success"
          />
          <Area
            type="monotone"
            dataKey="error"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#errorGradient)"
            name="Errors"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
