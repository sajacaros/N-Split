import React from 'react';
import { Strategy } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, PlayCircle, RefreshCw, Eye, ListOrdered, Clock, Edit, LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StrategyCardProps {
  strategy: Strategy;
  onStart: (id: string) => void;
  onRestart: (id: string) => void;
  onView: (id: string) => void;
}

export function StrategyCard({ strategy, onStart, onRestart, onView }: StrategyCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: Strategy['status']) => {
    switch (status) {
      case 'pending':
        return 'text-blue-600';
      case 'active':
        return 'text-green-600';
      case 'failed':
        return 'text-orange-600';
      case 'completed':
        return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: Strategy['status']) => {
    switch (status) {
      case 'pending':
        return '시작 전';
      case 'active':
        return '진행 중';
      case 'failed':
        return '진행 실패';
      case 'completed':
        return '종료됨';
    }
  };

  const getBorderColor = (status: Strategy['status']) => {
    switch (status) {
      case 'pending':
        return 'border-blue-500';
      case 'active':
        return 'border-green-500';
      case 'failed':
        return 'border-orange-500';
      case 'completed':
        return 'border-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDurationInDays = (startDate: Date, endDate: Date = new Date()) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgress = () => {
    return Math.round((strategy.stage / strategy.totalStages) * 100);
  };

  const handleViewDetails = () => {
    if (strategy.status === 'active' || strategy.status === 'completed') {
      navigate(`/purchase-details/${strategy.id}`);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 ${getBorderColor(strategy.status)} p-6 flex flex-col min-h-[24rem]`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{strategy.stockName}</h3>
          <div className="flex flex-col gap-1">
            <p className="text-gray-500 text-sm">현재가: ₩{strategy.currentPrice.toLocaleString()}</p>
            {strategy.useTwap && (
              <div className="inline-flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-fit">
                <Clock className="w-4 h-4" />
                <span>TWAP 매수</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className={`${getStatusColor(strategy.status)} font-medium`}>
              {getStatusLabel(strategy.status)}
            </span>
            {strategy.status === 'completed' && (
              <button
                onClick={() => onRestart(strategy.id)}
                className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">재시작</span>
              </button>
            )}
          </div>
          {strategy.status === 'completed' && (
            <p className="text-sm text-gray-500 mt-1">
              {strategy.stage}/{strategy.totalStages} 단계 진행
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">설정 금액</span>
          <span className="font-medium">₩{strategy.investmentAmount.toLocaleString()}</span>
        </div>
        {strategy.purchaseAmount && (
          <div className="flex justify-between">
            <span className="text-gray-600">구매 금액</span>
            <span className="font-medium">₩{strategy.purchaseAmount.toLocaleString()}</span>
          </div>
        )}
        {strategy.status !== 'pending' && strategy.totalReturn !== null && (
          <div className="flex justify-between">
            <span className="text-gray-600">총 수익률</span>
            <span className={`font-medium flex items-center gap-1 ${
              strategy.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <ArrowUpRight className="w-4 h-4" />
              {strategy.totalReturn}%
            </span>
          </div>
        )}
      </div>

      {strategy.startDate && (
        <div className="mb-6 text-sm text-gray-600">
          <p>시작일: {formatDate(strategy.startDate)}</p>
          {strategy.status === 'active' && (
            <p>{getDurationInDays(strategy.startDate)}일 투자중</p>
          )}
          {strategy.status === 'completed' && strategy.endDate && (
            <p>종료일: {formatDate(strategy.endDate)}</p>
          )}
        </div>
      )}

      {/* 진행률 표시 - 시작 전 상태도 포함 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>진행률</span>
          <span>{strategy.stage}/{strategy.totalStages} 단계 ({getProgress()}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        {/* 시작 전 상태일 때는 전략 수정 버튼 표시 */}
        {strategy.status === 'pending' && (
          <>
            <button
              onClick={() => onView(strategy.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
            >
              <Edit className="w-4 h-4" />
              전략 수정
            </button>
            <button
              onClick={() => onStart(strategy.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              <PlayCircle className="w-4 h-4" />
              전략 시작
            </button>
          </>
        )}

        {/* 진행 중 상태일 때는 전략 보기와 구매 상세 내역 버튼 */}
        {strategy.status === 'active' && (
          <>
            <button
              onClick={() => onView(strategy.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
            >
              <Eye className="w-4 h-4" />
              전략 보기
            </button>
            <Button className="flex-1" variant="outline" onClick={handleViewDetails}>
              <LineChart className="w-4 h-4 mr-2" />
              구매 상세 내역
            </Button>
          </>
        )}

        {/* 종료됨 상태일 때는 전략 보기와 구매 상세 내역 버튼 */}
        {strategy.status === 'completed' && (
          <>
            <button
              onClick={() => onView(strategy.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
            >
              <Eye className="w-4 h-4" />
              전략 보기
            </button>
            <Button className="flex-1" variant="outline" onClick={handleViewDetails}>
              <LineChart className="w-4 h-4 mr-2" />
              구매 상세 내역
            </Button>
          </>
        )}
      </div>
    </div>
  );
}