import React from 'react';

interface StrategyConfirmationProps {
  stock: any;
  settings: any;
}

export function StrategyConfirmation({ stock, settings }: StrategyConfirmationProps) {
  const calculateStageAmount = (percentage: number) => {
    return (settings.investmentAmount * (percentage / 100)).toLocaleString();
  };

  const calculateBuyPrice = (index: number) => {
    if (index === 0) return stock.price.toLocaleString();
    
    // 이전 단계의 가격을 기준으로 하락률을 계산
    let price = stock.price;
    for (let i = 0; i < index; i++) {
      price = price * (1 - settings.buyDropPercentage / 100);
    }
    return Math.round(price).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">선택한 종목</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">종목명</p>
            <p className="font-medium">{stock.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">현재가</p>
            <p className="font-medium">₩{stock.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">전략 설정 내용</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">분할 단계</p>
              <p className="font-medium">{settings.stages}단계</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">총 투자금액</p>
              <p className="font-medium">₩{settings.investmentAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">매수 하락률</p>
              <p className="font-medium">{settings.buyDropPercentage}%</p>
              <p className="text-xs text-gray-500">2단계부터 적용</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">목표 수익률</p>
              <p className="font-medium">{settings.targetReturnPercentage}%</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">단계별 매수 계획</h4>
            <div className="space-y-3">
              {settings.buyPercentages.map((buyPercentage: number, index: number) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{index + 1}단계</span>
                    <span className="text-sm text-gray-500">
                      ₩{calculateStageAmount(buyPercentage)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">매수 비중: </span>
                      <span className="font-medium">{buyPercentage}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">매수가: </span>
                      <span className="font-medium">₩{calculateBuyPrice(index)}</span>
                      {index > 0 && (
                        <span className="text-gray-500 text-xs ml-1">(-{settings.buyDropPercentage}%)</span>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-600">목표 수익률: </span>
                      <span className="font-medium">{settings.targetReturnPercentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}