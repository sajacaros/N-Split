import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

interface StrategySettingsProps {
  stock: any;
  onSettingsChange: (settings: any) => void;
  readOnly?: boolean;
  initialSettings?: any;
}

export function StrategySettings({ 
  stock, 
  onSettingsChange, 
  readOnly = false,
  initialSettings
}: StrategySettingsProps) {
  const [stages, setStages] = useState(initialSettings?.stages || 5);
  const [investmentAmount, setInvestmentAmount] = useState(initialSettings?.investmentAmount || 1000000);
  const [customizeRatio, setCustomizeRatio] = useState(false);
  const [buyPercentages, setBuyPercentages] = useState<number[]>(
    initialSettings?.buyPercentages || Array(5).fill(Math.floor((100 / 5) * 10) / 10)
  );
  const [buyDropPercentage, setBuyDropPercentage] = useState(initialSettings?.buyDropPercentage || 5);
  const [targetReturnPercentage, setTargetReturnPercentage] = useState(initialSettings?.targetReturnPercentage || 7);
  const [useTwap, setUseTwap] = useState(initialSettings?.useTwap || false);

  useEffect(() => {
    if (!readOnly) {
      onSettingsChange({
        stages,
        investmentAmount,
        buyPercentages,
        buyDropPercentage,
        targetReturnPercentage,
        useTwap
      });
    }
  }, []);

  const handleStagesChange = (value: number) => {
    if (readOnly) return;
    setStages(value);
    const equalPercentage = Math.floor((100 / value) * 10) / 10;
    const newBuyPercentages = Array(value).fill(equalPercentage);
    setBuyPercentages(newBuyPercentages);
    
    onSettingsChange({
      stages: value,
      investmentAmount,
      buyPercentages: newBuyPercentages,
      buyDropPercentage,
      targetReturnPercentage,
      useTwap
    });
  };

  const handleBuyPercentageChange = (index: number, value: number) => {
    if (readOnly || !customizeRatio) return;
    const newPercentages = [...buyPercentages];
    newPercentages[index] = Math.floor(value * 10) / 10;
    setBuyPercentages(newPercentages);
    
    onSettingsChange({
      stages,
      investmentAmount,
      buyPercentages: newPercentages,
      buyDropPercentage,
      targetReturnPercentage,
      useTwap
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">기본 설정</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              분할 단계
            </label>
            <select
              value={stages}
              onChange={(e) => handleStagesChange(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
              disabled={readOnly}
            >
              {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n}단계</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              총 투자금액
            </label>
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => {
                if (readOnly) return;
                const value = Number(e.target.value);
                setInvestmentAmount(value);
                onSettingsChange({
                  stages,
                  investmentAmount: value,
                  buyPercentages,
                  buyDropPercentage,
                  targetReturnPercentage,
                  useTwap
                });
              }}
              className="w-full p-2 border border-gray-300 rounded-lg"
              disabled={readOnly}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">매매 조건 설정</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                매수 하락률 (%)
              </label>
              <input
                type="number"
                value={buyDropPercentage}
                onChange={(e) => {
                  if (readOnly) return;
                  const value = Number(e.target.value);
                  setBuyDropPercentage(value);
                  onSettingsChange({
                    stages,
                    investmentAmount,
                    buyPercentages,
                    buyDropPercentage: value,
                    targetReturnPercentage,
                    useTwap
                  });
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
                disabled={readOnly}
              />
              <p className="text-sm text-gray-500 mt-1">2단계부터 적용됩니다</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                목표 수익률 (%)
              </label>
              <input
                type="number"
                value={targetReturnPercentage}
                onChange={(e) => {
                  if (readOnly) return;
                  const value = Number(e.target.value);
                  setTargetReturnPercentage(value);
                  onSettingsChange({
                    stages,
                    investmentAmount,
                    buyPercentages,
                    buyDropPercentage,
                    targetReturnPercentage: value,
                    useTwap
                  });
                }}
                className="w-full p-2 border border-gray-300 rounded-lg"
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useTwap}
                  onChange={(e) => {
                    if (readOnly) return;
                    setUseTwap(e.target.checked);
                    onSettingsChange({
                      stages,
                      investmentAmount,
                      buyPercentages,
                      buyDropPercentage,
                      targetReturnPercentage,
                      useTwap: e.target.checked
                    });
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={readOnly}
                />
                <span className="text-sm font-medium text-gray-700">TWAP 사용</span>
              </label>
              <div className="flex items-center gap-1 text-gray-500">
                <Info className="w-4 h-4" />
                <span className="text-xs">1시간 단위로 평균 가격 매수</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">단계별 매수 비중</h3>
            {!customizeRatio && (
              <p className="text-sm text-gray-600 mt-1">
                단계별 {Math.floor((100 / stages) * 10) / 10}%씩 균등 분배
              </p>
            )}
          </div>
          {!readOnly && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={customizeRatio}
                onChange={(e) => setCustomizeRatio(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">수동 설정</span>
            </label>
          )}
        </div>
        
        {(customizeRatio || readOnly) && (
          <div className="space-y-4">
            {Array.from({ length: stages }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-24 flex-shrink-0">
                  <span className="font-medium">{index + 1}단계</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={buyPercentages[index]}
                      onChange={(e) => handleBuyPercentageChange(index, Number(e.target.value))}
                      step="0.1"
                      min="0"
                      max="100"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      disabled={readOnly}
                    />
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 space-y-1">
          <p>1단계는 현재가에 즉시 매수되며, 2단계부터 설정한 하락률에 따라 매수됩니다.</p>
          <p>매수 비중은 기본적으로 균등하게 분배되며, 수동 설정 시 직접 조정할 수 있습니다.</p>
          <p>목표 수익률에 도달하면 해당 단계의 물량이 매도됩니다.</p>
          {useTwap && (
            <p>TWAP을 사용하여 1시간 동안의 평균 가격으로 매수가 이루어집니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}