import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

interface StageTransaction {
  id: string;
  stageNumber: number;
  purchaseDate: Date;
  averagePrice: number;
  quantity: number;
  totalAmount: number;
  twapTransactions: {
    time: Date;
    price: number;
    quantity: number;
  }[];
}

interface PurchaseDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: {
    id: string;
    stockName: string;
    currentPrice: number;
    useTwap: boolean;
    transactions: StageTransaction[];
  };
}

export function PurchaseDetails({ isOpen, onClose, strategy }: PurchaseDetailsProps) {
  if (!isOpen) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold mb-1">{strategy.stockName}</h2>
              <p className="text-gray-600">현재가: ₩{strategy.currentPrice.toLocaleString()}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {strategy.transactions.map((transaction, index) => (
              <div key={transaction.id} className="border rounded-lg">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg">
                        {transaction.stageNumber}단계
                      </span>
                      {index > 0 && transaction.stageNumber < strategy.transactions[index - 1].stageNumber ? (
                        <div className="flex items-center gap-1 text-red-600 text-sm">
                          <ArrowDownRight className="w-4 h-4" />
                          <span>하락 매수</span>
                        </div>
                      ) : index > 0 && transaction.stageNumber > strategy.transactions[index - 1].stageNumber ? (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <ArrowUpRight className="w-4 h-4" />
                          <span>상승 매도</span>
                        </div>
                      ) : null}
                    </div>
                    <span className="text-gray-600">{formatDate(transaction.purchaseDate)}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">평균 매수가</p>
                      <p className="font-medium">₩{transaction.averagePrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">매수 수량</p>
                      <p className="font-medium">{transaction.quantity.toLocaleString()}주</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">총 매수 금액</p>
                      <p className="font-medium">₩{transaction.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {strategy.useTwap && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">TWAP 거래 내역</span>
                      </div>
                      <div className="space-y-2">
                        {transaction.twapTransactions.map((twap, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg"
                          >
                            <span className="text-gray-600">{formatTime(twap.time)}</span>
                            <div className="flex items-center gap-4">
                              <span>₩{twap.price.toLocaleString()}</span>
                              <span>{twap.quantity.toLocaleString()}주</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}