import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchStockProps {
  onSelectStock: (stock: any) => void;
  selectedStock: any;
  readOnly?: boolean;
}

// Mock data for demonstration
const mockStocks = [
  { code: '005930', name: '삼성전자', price: 74800, change: 2.3 },
  { code: '035420', name: 'NAVER', price: 216500, change: -1.2 },
  { code: '000660', name: 'SK하이닉스', price: 156000, change: 1.5 },
  { code: '373220', name: 'LG에너지솔루션', price: 412000, change: 0.8 }
];

export function SearchStock({ onSelectStock, selectedStock, readOnly = false }: SearchStockProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = mockStocks.filter(
    stock => stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {!readOnly && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="종목명을 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="space-y-4">
        {(readOnly ? [selectedStock] : filteredStocks).map((stock) => (
          <div
            key={stock.code}
            onClick={() => !readOnly && onSelectStock(stock)}
            className={`p-4 rounded-lg border ${
              !readOnly ? 'cursor-pointer transition-colors' : ''
            } ${
              selectedStock?.code === stock.code
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            } ${!readOnly && 'hover:border-blue-300'}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{stock.name}</h3>
                <p className="text-sm text-gray-500">{stock.code}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">₩{stock.price.toLocaleString()}</p>
                <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}