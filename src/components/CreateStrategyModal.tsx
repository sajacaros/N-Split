import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SearchStock } from './strategy/SearchStock';
import { StrategySettings } from './strategy/StrategySettings';
import { StrategyConfirmation } from './strategy/StrategyConfirmation';
import { Strategy } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CreateStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStrategy: (strategy: any) => void;
  existingStrategy?: Strategy;
  readOnly?: boolean;
}

type Step = 'search' | 'settings' | 'confirmation';

export function CreateStrategyModal({ 
  isOpen, 
  onClose, 
  onCreateStrategy, 
  existingStrategy,
  readOnly = false 
}: CreateStrategyModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(existingStrategy ? 'settings' : 'search');
  const [selectedStock, setSelectedStock] = useState<any>(
    existingStrategy ? {
      code: 'existing',
      name: existingStrategy.stockName,
      price: existingStrategy.currentPrice,
      change: 0
    } : null
  );
  const [strategySettings, setStrategySettings] = useState<any>(
    existingStrategy ? {
      stages: existingStrategy.totalStages,
      investmentAmount: existingStrategy.investmentAmount,
      buyPercentages: Array(existingStrategy.totalStages).fill(100 / existingStrategy.totalStages),
      buyDropPercentage: 5,
      targetReturnPercentage: 7,
      useTwap: existingStrategy.useTwap
    } : null
  );

  const handleNext = () => {
    switch (currentStep) {
      case 'search':
        setCurrentStep('settings');
        break;
      case 'settings':
        setCurrentStep('confirmation');
        break;
      case 'confirmation':
        if (!readOnly) {
          onCreateStrategy({
            stock: selectedStock,
            settings: strategySettings
          });
        }
        onClose();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'settings':
        if (!existingStrategy) {
          setCurrentStep('search');
        }
        break;
      case 'confirmation':
        setCurrentStep('settings');
        break;
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 'search':
        return (
          <SearchStock
            onSelectStock={(stock) => setSelectedStock(stock)}
            selectedStock={selectedStock}
            readOnly={readOnly || !!existingStrategy}
          />
        );
      case 'settings':
        return (
          <StrategySettings
            stock={selectedStock}
            onSettingsChange={(settings) => setStrategySettings(settings)}
            readOnly={readOnly}
            initialSettings={strategySettings}
          />
        );
      case 'confirmation':
        return (
          <StrategyConfirmation
            stock={selectedStock}
            settings={strategySettings}
          />
        );
    }
  };

  const getTitle = () => {
    if (readOnly) {
      return '전략 상세';
    }
    return existingStrategy 
      ? currentStep === 'confirmation'
        ? '전략 확인'
        : '전략 수정'
      : currentStep === 'search' 
      ? '종목 검색'
      : currentStep === 'settings'
      ? '전략 설정'
      : '전략 확인';
  };

  const getNextButtonText = () => {
    if (currentStep === 'confirmation') {
      return existingStrategy ? '전략 적용' : '전략 생성';
    }
    return '다음';
  };

  const showBackButton = () => {
    if (currentStep === 'search') return false;
    if (existingStrategy) return currentStep === 'confirmation';
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {getStepContent()}
        </div>

        {!readOnly && (
          <DialogFooter className="flex justify-between items-center p-6 border-t bg-muted mt-4">
            <div className="flex gap-2">
              {showBackButton() && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  이전
                </Button>
              )}
            </div>
            <Button
              onClick={handleNext}
              disabled={!selectedStock || (currentStep === 'settings' && !strategySettings)}
            >
              {getNextButtonText()}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}