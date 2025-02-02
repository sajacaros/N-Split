import { Strategy } from '../types';

// Mock transaction data
export const mockTransactions = {
  '1': [
    {
      id: 't1',
      stageNumber: 1,
      purchaseDate: new Date('2024-03-01T09:00:00'),
      averagePrice: 74500,
      quantity: 5,
      totalAmount: 372500,
      twapTransactions: [
        { time: new Date('2024-03-01T09:00:00'), price: 74600, quantity: 2 },
        { time: new Date('2024-03-01T10:00:00'), price: 74400, quantity: 3 }
      ]
    },
    {
      id: 't2',
      stageNumber: 2,
      purchaseDate: new Date('2024-03-02T09:00:00'),
      averagePrice: 73800,
      quantity: 7,
      totalAmount: 516600,
      twapTransactions: [
        { time: new Date('2024-03-02T09:00:00'), price: 73900, quantity: 3 },
        { time: new Date('2024-03-02T10:00:00'), price: 73700, quantity: 4 }
      ]
    }
  ],
  '2': [
    {
      id: 't3',
      stageNumber: 1,
      purchaseDate: new Date('2024-03-05T09:00:00'),
      averagePrice: 156200,
      quantity: 3,
      totalAmount: 468600,
      twapTransactions: [
        { time: new Date('2024-03-05T09:00:00'), price: 156300, quantity: 1 },
        { time: new Date('2024-03-05T10:00:00'), price: 156100, quantity: 2 }
      ]
    }
  ]
};

// Mock strategies data
export const mockStrategies: Strategy[] = [
  // 시작 전 (2개)
  {
    id: '1',
    stockName: 'NAVER',
    currentPrice: 216500,
    investmentAmount: 2000000,
    purchaseAmount: null,
    totalReturn: null,
    status: 'pending',
    stage: 0,
    totalStages: 3,
    useTwap: true
  },
  {
    id: '2',
    stockName: '카카오',
    currentPrice: 148500,
    investmentAmount: 1500000,
    purchaseAmount: null,
    totalReturn: null,
    status: 'pending',
    stage: 0,
    totalStages: 4,
    useTwap: false
  },
  
  // 진행 중 (3개)
  {
    id: '3',
    stockName: '삼성전자',
    currentPrice: 74800,
    investmentAmount: 1000000,
    purchaseAmount: 780000,
    totalReturn: 15.2,
    status: 'active',
    stage: 2,
    totalStages: 5,
    startDate: new Date('2024-03-01'),
    useTwap: true
  },
  {
    id: '4',
    stockName: 'SK하이닉스',
    currentPrice: 156000,
    investmentAmount: 1800000,
    purchaseAmount: 468600,
    totalReturn: -2.1,
    status: 'active',
    stage: 1,
    totalStages: 6,
    startDate: new Date('2024-03-05'),
    useTwap: true
  },
  {
    id: '5',
    stockName: 'LG에너지솔루션',
    currentPrice: 412000,
    investmentAmount: 3000000,
    purchaseAmount: 824000,
    totalReturn: 5.3,
    status: 'active',
    stage: 2,
    totalStages: 4,
    startDate: new Date('2024-02-28'),
    useTwap: false
  },

  // 종료됨 (5개)
  {
    id: '6',
    stockName: '현대차',
    currentPrice: 258000,
    investmentAmount: 2500000,
    purchaseAmount: 2320000,
    totalReturn: 12.5,
    status: 'completed',
    stage: 5,
    totalStages: 5,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-28'),
    useTwap: true
  },
  {
    id: '7',
    stockName: '포스코퓨처엠',
    currentPrice: 402500,
    investmentAmount: 4000000,
    purchaseAmount: 3850000,
    totalReturn: 18.7,
    status: 'completed',
    stage: 4,
    totalStages: 4,
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-03-01'),
    useTwap: true
  },
  {
    id: '8',
    stockName: '기아',
    currentPrice: 115000,
    investmentAmount: 1200000,
    purchaseAmount: 1150000,
    totalReturn: 8.9,
    status: 'completed',
    stage: 3,
    totalStages: 3,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-10'),
    useTwap: false
  },
  {
    id: '9',
    stockName: '삼성바이오로직스',
    currentPrice: 825000,
    investmentAmount: 5000000,
    purchaseAmount: 4920000,
    totalReturn: 15.3,
    status: 'completed',
    stage: 6,
    totalStages: 6,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-02-25'),
    useTwap: true
  },
  {
    id: '10',
    stockName: 'LG화학',
    currentPrice: 502000,
    investmentAmount: 3000000,
    purchaseAmount: 2950000,
    totalReturn: 21.2,
    status: 'completed',
    stage: 4,
    totalStages: 4,
    startDate: new Date('2024-01-05'),
    endDate: new Date('2025-01-03'),
    useTwap: false
  }
];