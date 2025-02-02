import React, { useState } from 'react';
import { Strategy, StrategyStatus } from '../types';
import { StatusFilter } from './StatusFilter';
import { StrategyCard } from './StrategyCard';
import { LineChart, Wallet, PlusCircle, TrendingUp, CalendarDays, Calendar, Coins } from 'lucide-react';
import { CreateStrategyModal } from './CreateStrategyModal';
import { PurchaseDetails } from './strategy/PurchaseDetails';
import { mockStrategies, mockTransactions } from '../mocks/strategyData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from './Layout';

export function Dashboard() {
  const [strategies, setStrategies] = useState<Strategy[]>(mockStrategies);
  const [currentStatus, setCurrentStatus] = useState<StrategyStatus | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'details' | 'strategy'>('details');

  const filteredStrategies = strategies.filter(strategy => {
    if (currentStatus !== 'all' && strategy.status !== currentStatus) return false;
    if (currentStatus === 'completed' && selectedYear !== 'all') {
      return strategy.endDate?.getFullYear() === selectedYear;
    }
    return true;
  });

  const getCounts = () => {
    const counts = strategies.reduce(
      (acc, strategy) => {
        acc[strategy.status]++;
        acc.all++;
        return acc;
      },
      { all: 0, pending: 0, active: 0, completed: 0 }
    );
    return counts;
  };

  const handleStart = (id: string) => {
    setStrategies(prevStrategies => 
      prevStrategies.map(strategy => 
        strategy.id === id
          ? { ...strategy, status: 'active' as StrategyStatus, startDate: new Date(), stage: 1 }
          : strategy
      )
    );
  };

  const handleRestart = (id: string) => {
    const strategyToRestart = strategies.find(s => s.id === id);
    if (!strategyToRestart) return;

    const newStrategy: Strategy = {
      ...strategyToRestart,
      id: crypto.randomUUID(),
      status: 'pending',
      stage: 0,
      purchaseAmount: null,
      totalReturn: null,
      startDate: undefined,
      endDate: undefined
    };

    setStrategies(prev => [...prev, newStrategy]);
  };

  const handleView = (id: string) => {
    const strategy = strategies.find(s => s.id === id);
    if (!strategy) return;

    setSelectedStrategyId(id);
    if (strategy.status === 'active') {
      setViewMode('details');
    } else {
      setViewMode('strategy');
    }
  };

  const handleCreateStrategy = (strategyData: any) => {
    const newStrategy: Strategy = {
      id: crypto.randomUUID(),
      stockName: strategyData.stock.name,
      currentPrice: strategyData.stock.price,
      investmentAmount: strategyData.settings.investmentAmount,
      purchaseAmount: null,
      totalReturn: null,
      status: 'pending',
      stage: 0,
      totalStages: strategyData.settings.stages,
      useTwap: strategyData.settings.useTwap
    };

    setStrategies(prev => [...prev, newStrategy]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateStrategy = (strategyData: any) => {
    setStrategies(prevStrategies =>
      prevStrategies.map(strategy =>
        strategy.id === selectedStrategyId
          ? {
              ...strategy,
              stockName: strategyData.stock.name,
              currentPrice: strategyData.stock.price,
              investmentAmount: strategyData.settings.investmentAmount,
              totalStages: strategyData.settings.stages,
              useTwap: strategyData.settings.useTwap
            }
          : strategy
      )
    );
    setSelectedStrategyId(null);
  };

  const activeStrategies = strategies.filter(s => s.status === 'active');
  const completedStrategies = strategies.filter(s => s.status === 'completed');
  
  const totalPurchaseAmount = activeStrategies.reduce((sum, strategy) => 
    sum + (strategy.purchaseAmount || 0), 0
  );
  
  const totalCompletedAmount = completedStrategies.reduce((sum, strategy) => 
    sum + (strategy.purchaseAmount || 0), 0
  );
  
  const avgCompletedReturn = completedStrategies.reduce((sum, strategy) => 
    sum + (strategy.totalReturn || 0), 0
  ) / (completedStrategies.length || 1);

  const totalProfit = completedStrategies.reduce((sum, strategy) => {
    const profit = strategy.purchaseAmount ? 
      (strategy.purchaseAmount * (strategy.totalReturn || 0)) / 100 : 0;
    return sum + profit;
  }, 0);

  const activeProfit = activeStrategies.reduce((sum, strategy) => {
    const currentReturn = strategy.currentReturn || 0;
    const profit = strategy.purchaseAmount ? 
      (strategy.purchaseAmount * currentReturn) / 100 : 0;
    return sum + profit;
  }, 0);

  const availableYears = Array.from(
    new Set(
      completedStrategies
        .filter(s => s.endDate)
        .map(s => s.endDate!.getFullYear())
    )
  ).sort((a, b) => b - a);

  const selectedStrategy = selectedStrategyId 
    ? {
        ...strategies.find(s => s.id === selectedStrategyId)!,
        transactions: mockTransactions[selectedStrategyId] || []
      }
    : null;

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">N-Split 대시보드</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle className="w-5 h-5 mr-2" />
            전략 개설
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>진행중인 전략</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Wallet className="w-4 h-4" />
                    <span>총 투자금액</span>
                  </div>
                  <p className="text-lg font-semibold">₩{totalPurchaseAmount.toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <CalendarDays className="w-4 h-4" />
                    <span>진행중인 전략</span>
                  </div>
                  <p className="text-lg font-semibold">{activeStrategies.length}개</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>평균 진행률</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {(activeStrategies.reduce((sum, s) => sum + ((s.stage || 0) / (s.totalStages || 1)), 0) / 
                      (activeStrategies.length || 1) * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Coins className="w-4 h-4" />
                    <span>현재 수익금</span>
                  </div>
                  <p className={`text-lg font-semibold ${activeProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {activeProfit >= 0 ? '+' : '-'}₩{Math.abs(activeProfit).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <LineChart className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>확정 성과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Wallet className="w-4 h-4" />
                      <span>총 투자금액</span>
                    </div>
                    <p className="text-lg font-semibold">₩{totalCompletedAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <CalendarDays className="w-4 h-4" />
                      <span>완료된 전략</span>
                    </div>
                    <p className="text-lg font-semibold">{completedStrategies.length}개</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Coins className="w-4 h-4" />
                      <span>총 수익금</span>
                    </div>
                    <p className={`text-lg font-semibold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalProfit >= 0 ? '+' : '-'}₩{Math.abs(totalProfit).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>평균 수익률</span>
                    </div>
                    <p className={`text-lg font-semibold ${avgCompletedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {avgCompletedReturn >= 0 ? '+' : '-'}{Math.abs(avgCompletedReturn).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <StatusFilter
            currentStatus={currentStatus}
            onStatusChange={setCurrentStatus}
            counts={getCounts()}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            availableYears={availableYears}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrategies.map(strategy => (
            <StrategyCard
              key={strategy.id}
              strategy={strategy}
              onStart={handleStart}
              onRestart={handleRestart}
              onView={handleView}
            />
          ))}
        </div>

        <CreateStrategyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateStrategy={handleCreateStrategy}
        />

        {selectedStrategy && viewMode === 'details' && (
          <PurchaseDetails
            isOpen={!!selectedStrategyId}
            onClose={() => setSelectedStrategyId(null)}
            strategy={selectedStrategy}
          />
        )}

        {selectedStrategy && viewMode === 'strategy' && (
          <CreateStrategyModal
            isOpen={!!selectedStrategyId}
            onClose={() => setSelectedStrategyId(null)}
            onCreateStrategy={handleUpdateStrategy}
            existingStrategy={selectedStrategy}
            readOnly={selectedStrategy.status !== 'pending'}
          />
        )}
      </div>
    </Layout>
  );
}