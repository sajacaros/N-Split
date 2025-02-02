import React from 'react';
import { StrategyStatus } from '../types';

interface StatusFilterProps {
  currentStatus: StrategyStatus | 'all';
  onStatusChange: (status: StrategyStatus | 'all') => void;
  counts: { [key in StrategyStatus | 'all']: number };
  selectedYear: number | 'all';
  onYearChange: (year: number | 'all') => void;
  availableYears: number[];
}

export function StatusFilter({ 
  currentStatus, 
  onStatusChange, 
  counts,
  selectedYear,
  onYearChange,
  availableYears
}: StatusFilterProps) {
  const statuses: Array<{ value: StrategyStatus | 'all'; label: string }> = [
    { value: 'all', label: '전체 보기' },
    { value: 'pending', label: '시작 전' },
    { value: 'active', label: '진행 중' },
    { value: 'completed', label: '종료됨' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {statuses.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onStatusChange(value)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              currentStatus === value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {label}
            <span className="bg-opacity-20 bg-gray-900 px-2 py-0.5 rounded-full text-sm">
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      {currentStatus === 'completed' && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">연도:</span>
          <div className="flex gap-2">
            <button
              onClick={() => onYearChange('all')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                selectedYear === 'all'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              모두 보기
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => onYearChange(year)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  selectedYear === year
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {year}년
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}