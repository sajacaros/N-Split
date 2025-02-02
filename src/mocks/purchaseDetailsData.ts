import { PurchaseDetailsData } from "../types";

export const mockPurchaseDetailsData: Record<string, PurchaseDetailsData> = {
  // 진행 중인 전략들
  '3': {
    id: '3',
    name: '삼성전자 5단계 분할매수',
    totalStages: 5,
    currentStage: 2,
    totalInvestment: 1000000,
    totalPurchaseAmount: 889100,
    currentValue: 1024313,  // 15.2% 상승 (전략 데이터와 일치)
    totalReturn: 15.2,
    totalProfit: 135213,
    targetReturn: 15,
    dropRate: 5,
    stages: [
      {
        stage: 1,
        status: 'active',  // 첫 단계는 항상 진행중
        targetReturn: 15,
        dropRate: 5,
        purchaseRatio: 20,
        purchasePrice: 372500,
        currentValue: 429125,  // 15.2% 상승
        currentReturn: 15.2,
        currentProfit: 56625,
        startDate: new Date('2024-03-01'),
        history: [
          {
            id: '3-1-1',
            status: 'completed', // 첫 번째 시도 (완료)
            startDate: new Date('2024-02-15'),
            endDate: new Date('2024-02-20'),
            quantity: 5,
            purchaseAmount: 372500,
            sellAmount: 428375, // 15% 수익으로 매도
          },
          {
            id: '3-1-2',
            status: 'active',  // 두 번째 시도 (진행중)
            startDate: new Date('2024-03-01'),
            quantity: 5,
            purchaseAmount: 372500,
          }
        ]
      },
      {
        stage: 2,
        status: 'active',  // 1단계가 진행중이므로 2단계도 진행 가능
        targetReturn: 12,
        dropRate: 5,
        purchaseRatio: 20,
        purchaseAmount: 516600,
        currentValue: 595188,  // 15.2% 상승
        currentReturn: 15.2,
        currentProfit: 78588,
        startDate: new Date('2024-03-02'),
        history: [
          {
            id: '3-2-1',
            status: 'completed',  // 첫 번째 시도 (완료)
            startDate: new Date('2024-02-20'),
            endDate: new Date('2024-02-25'),
            quantity: 7,
            purchaseAmount: 516600,
            sellAmount: 578592,  // 12% 수익으로 매도
            finalReturn: 12,
            finalProfit: 61992
          },
          {
            id: '3-2-2',
            status: 'active',  // 두 번째 시도 (진행중)
            startDate: new Date('2024-03-02'),
            quantity: 7,
            purchaseAmount: 516600,
            currentValue: 595188,
            currentReturn: 15.2,
            currentProfit: 78588
          }
        ]
      },
      {
        stage: 3,
        status: 'pending',  // 아직 매수 시점에 도달하지 않음
        targetReturn: 10,
        dropRate: 5,
        purchaseRatio: 20,
        expectedPrice: 70110,  // 현재가에서 5% 하락한 가격
        startDate: null,
        history: []
      },
      {
        stage: 4,
        status: 'pending',
        targetReturn: 8,
        dropRate: 5,
        purchaseRatio: 20,
        expectedPrice: 66605,
        startDate: null,
        history: []
      },
      {
        stage: 5,
        status: 'pending',
        targetReturn: 5,
        purchaseRatio: 20,
        expectedPrice: 63275,
        startDate: null,
        history: []
      }
    ]
  },
  '4': {
    id: '4',
    name: 'SK하이닉스 6단계 분할매수',
    totalStages: 6,
    currentStage: 1,
    totalInvestment: 1800000,
    totalPurchaseAmount: 468600,
    currentValue: 458775,  // -2.1% 하락 (전략 데이터와 일치)
    totalReturn: -2.1,
    totalProfit: -9825,
    targetReturn: 15,
    dropRate: 4,
    stages: [
      {
        stage: 1,
        status: 'active',  // 첫 단계는 항상 진행중
        targetReturn: 15,
        dropRate: 4,
        purchaseRatio: 16.67,
        purchaseAmount: 468600,
        currentValue: 458775,
        currentReturn: -2.1,
        currentProfit: -9825,
        startDate: new Date('2024-03-05'),
        history: [
          {
            id: '4-1-1',
            status: 'active',  // 첫 번째 시도 (아직 진행중)
            startDate: new Date('2024-03-05'),
            quantity: 3,
            purchaseAmount: 468600,
            currentValue: 458775,
            currentReturn: -2.1,
            currentProfit: -9825
          }
        ]
      },
      {
        stage: 2,
        status: 'pending',  // 1단계가 아직 목표 수익률에 도달하지 않음
        targetReturn: 12,
        dropRate: 4,
        purchaseRatio: 16.67,
        expectedPrice: 149952,  // 현재가에서 4% 하락한 가격
        startDate: null,
        history: []
      },
      {
        stage: 3,
        status: 'pending',
        targetReturn: 10,
        dropRate: 4,
        purchaseRatio: 16.67,
        expectedPrice: 143954,
        startDate: null,
        history: []
      },
      {
        stage: 4,
        status: 'pending',
        targetReturn: 8,
        dropRate: 4,
        purchaseRatio: 16.67,
        expectedPrice: 138196,
        startDate: null,
        history: []
      },
      {
        stage: 5,
        status: 'pending',
        targetReturn: 6,
        dropRate: 4,
        purchaseRatio: 16.67,
        expectedPrice: 132668,
        startDate: null,
        history: []
      },
      {
        stage: 6,
        status: 'pending',
        targetReturn: 4,
        purchaseRatio: 16.67,
        expectedPrice: 127361,
        startDate: null,
        history: []
      }
    ]
  },
  '5': {
    id: '5',
    name: 'LG에너지솔루션 4단계 분할매수',
    totalStages: 4,
    currentStage: 2,
    totalInvestment: 3000000,
    totalPurchaseAmount: 824000,
    currentValue: 867672,  // 5.3% 상승 (전략 데이터와 일치)
    totalReturn: 5.3,
    totalProfit: 43672,
    targetReturn: 15,
    dropRate: 6,
    stages: [
      {
        stage: 1,
        status: 'completed',
        targetReturn: 15,
        dropRate: 6,
        purchaseRatio: 25,
        purchaseAmount: 412000,
        currentValue: 433836,
        currentReturn: 5.3,
        currentProfit: 21836,
        startDate: new Date('2024-02-28'),
        history: [
          {
            id: '5-1',
            status: 'completed',
            startDate: new Date('2024-02-28'),
            quantity: 1,
            purchaseAmount: 412000,
            currentValue: 433836,
            currentReturn: 5.3,
            currentProfit: 21836,
          }
        ]
      },
      {
        stage: 2,
        status: 'active',
        targetReturn: 12,
        dropRate: 6,
        purchaseRatio: 25,
        purchaseAmount: 412000,
        currentValue: 433836,
        currentReturn: 5.3,
        currentProfit: 21836,
        startDate: new Date('2024-03-01'),
        history: [
          {
            id: '5-2',
            status: 'active',
            startDate: new Date('2024-03-01'),
            quantity: 1,
            purchaseAmount: 412000,
            currentValue: 433836,
            currentReturn: 5.3,
            currentProfit: 21836,
          }
        ]
      },
      {
        stage: 3,
        status: 'pending',
        targetReturn: 10,
        dropRate: 6,
        purchaseRatio: 25,
        expectedPrice: 387280,
        startDate: null,
        history: []
      },
      {
        stage: 4,
        status: 'pending',
        targetReturn: 8,
        dropRate: 6,
        purchaseRatio: 25,
        expectedPrice: 364043,
        startDate: null,
        history: []
      }
    ]
  },

  // 완료된 전략들
  '6': {
    id: '6',
    name: '현대차 4단계 분할매수',
    totalStages: 4,
    currentStage: 1,
    totalInvestment: 1200000,
    totalPurchaseAmount: 456000,
    currentValue: 524400,  // 15% 수익으로 종료
    totalReturn: 15,
    totalProfit: 68400,
    targetReturn: 15,
    dropRate: 5,
    status: 'completed',  // 전략 전체 종료
    completedDate: new Date('2024-01-15'),
    stages: [
      {
        stage: 1,
        status: 'completed',
        targetReturn: 15,
        dropRate: 5,
        purchaseRatio: 25,
        purchaseAmount: 456000,
        startDate: new Date('2023-12-01'),
        history: [
          {
            id: '6-1-1',
            status: 'completed',
            startDate: new Date('2023-12-01'),
            endDate: new Date('2023-12-20'),
            quantity: 2,
            purchaseAmount: 380000,
            sellAmount: 399000,  // 5% 수익으로 첫 매도
            finalReturn: 5,
            finalProfit: 19000
          }
        ]
      },
      {
        stage: 2,
        status: 'pending',
        targetReturn: 12,
        dropRate: 5,
        purchaseRatio: 25,
        startDate: null,
        history: []
      },
      {
        stage: 3,
        status: 'pending',
        targetReturn: 10,
        dropRate: 5,
        purchaseRatio: 25,
        startDate: null,
        history: []
      },
      {
        stage: 4,
        status: 'pending',
        targetReturn: 8,
        purchaseRatio: 25,
        startDate: null,
        history: []
      }
    ]
  },
  '7': {
    id: '7',
    name: 'POSCO홀딩스 3단계 분할매수',
    totalStages: 3,
    currentStage: 1,
    totalInvestment: 900000,
    totalPurchaseAmount: 384000,
    currentValue: 441600,  // 15% 수익으로 종료
    totalReturn: 15,
    totalProfit: 57600,
    targetReturn: 15,
    dropRate: 6,
    status: 'completed',  // 전략 전체 종료
    completedDate: new Date('2024-02-01'),
    stages: [
      {
        stage: 1,
        status: 'completed',
        targetReturn: 15,
        dropRate: 6,
        purchaseRatio: 33.33,
        purchaseAmount: 384000,
        startDate: new Date('2023-11-15'),
        history: [
          {
            id: '7-1-1',
            status: 'completed',
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-02-01'),
            quantity: 1,
            purchaseAmount: 384000,
            sellAmount: 441600,  // 15% 수익으로 최종 매도
            finalReturn: 15,
            finalProfit: 57600
          }
        ]
      },
      {
        stage: 2,
        status: 'pending',
        targetReturn: 12,
        dropRate: 6,
        purchaseRatio: 33.33,
        startDate: null,
        history: [
          {
            id: '7-2-1',
            status: 'completed',
            startDate: new Date('2024-01-16'),
            endDate: new Date('2025-01-25'),
            quantity: 1,
            purchaseAmount: 480000,
            sellAmount: 456000,  // -5% 손실로 첫 매도
            finalReturn: -5,
            finalProfit: -24000
          }
        ]
      },
      {
        stage: 3,
        status: 'pending',
        targetReturn: 10,
        purchaseRatio: 33.33,
        startDate: null,
        history: []
      }
    ]
  },
  '8': {
    id: '8',
    name: '카카오 5단계 분할매수',
    totalStages: 5,
    currentStage: 1,
    totalInvestment: 1500000,
    totalPurchaseAmount: 420000,
    currentValue: 483000,  // 15% 수익으로 종료
    totalReturn: 15,
    totalProfit: 63000,
    targetReturn: 15,
    dropRate: 4,
    status: 'completed',  // 전략 전체 종료
    completedDate: new Date('2024-01-20'),
    stages: [
      {
        stage: 1,
        status: 'completed',
        targetReturn: 15,
        dropRate: 4,
        purchaseRatio: 20,
        purchaseAmount: 420000,
        startDate: new Date('2023-12-15'),
        history: [
          {
            id: '8-1-1',
            status: 'completed',
            startDate: new Date('2023-12-15'),
            endDate: new Date('2023-12-25'),
            quantity: 8,
            purchaseAmount: 420000,
            sellAmount: 436800,  // 4% 수익으로 첫 매도
            finalReturn: 4,
            finalProfit: 16800
          },
          {
            id: '8-1-2',
            status: 'completed',
            startDate: new Date('2024-01-10'),
            endDate: new Date('2024-01-20'),
            quantity: 8,
            purchaseAmount: 420000,
            sellAmount: 483000,  // 15% 수익으로 최종 매도
            finalReturn: 15,
            finalProfit: 63000
          }
        ]
      },
      {
        stage: 2,
        status: 'pending',
        targetReturn: 12,
        dropRate: 4,
        purchaseRatio: 20,
        startDate: null,
        history: []
      },
      {
        stage: 3,
        status: 'pending',
        targetReturn: 10,
        dropRate: 4,
        purchaseRatio: 20,
        startDate: null,
        history: []
      },
      {
        stage: 4,
        status: 'pending',
        targetReturn: 8,
        dropRate: 4,
        purchaseRatio: 20,
        startDate: null,
        history: []
      },
      {
        stage: 5,
        status: 'pending',
        targetReturn: 6,
        purchaseRatio: 20,
        startDate: null,
        history: []
      }
    ]
  },
  '9': {
    id: '9',
    name: '네이버 4단계 분할매수',
    totalStages: 4,
    currentStage: 1,
    totalInvestment: 1000000,
    totalPurchaseAmount: 312500,
    currentValue: 359375,  // 15% 수익으로 종료
    totalReturn: 15,
    totalProfit: 46875,
    targetReturn: 15,
    dropRate: 5,
    status: 'completed',  // 전략 전체 종료
    completedDate: new Date('2024-01-25'),
    stages: [
      {
        stage: 1,
        status: 'completed',
        targetReturn: 15,
        dropRate: 5,
        purchaseRatio: 25,
        purchaseAmount: 312500,
        startDate: new Date('2023-12-10'),
        history: [
          {
            id: '9-1-1',
            status: 'completed',
            startDate: new Date('2023-12-10'),
            endDate: new Date('2023-12-30'),
            quantity: 1,
            purchaseAmount: 250000,
            sellAmount: 237500,  // -5% 손실로 첫 매도
            finalReturn: -5,
            finalProfit: -12500
          },
          {
            id: '9-1-2',
            status: 'completed',
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-01-25'),
            quantity: 1,
            purchaseAmount: 312500,
            sellAmount: 359375,  // 15% 수익으로 최종 매도
            finalReturn: 15,
            finalProfit: 46875
          }
        ]
      },
      {
        stage: 2,
        status: 'pending',
        targetReturn: 12,
        dropRate: 5,
        purchaseRatio: 25,
        startDate: null,
        history: []
      },
      {
        stage: 3,
        status: 'pending',
        targetReturn: 10,
        dropRate: 5,
        purchaseRatio: 25,
        startDate: null,
        history: []
      },
      {
        stage: 4,
        status: 'pending',
        targetReturn: 8,
        purchaseRatio: 25,
        startDate: null,
        history: []
      }
    ]
  },
  '10': {
    id: '10',
    name: '삼성바이오로직스 3단계 분할매수',
    totalStages: 3,
    currentStage: 1,
    totalInvestment: 2000000,
    totalPurchaseAmount: 816000,
    currentValue: 938400,  // 15% 수익으로 종료
    totalReturn: 15,
    totalProfit: 122400,
    targetReturn: 15,
    dropRate: 6,
    status: 'completed',  // 전략 전체 종료
    completedDate: new Date('2024-01-10'),
    stages: [
      {
        stage: 1,
        status: 'completed',
        targetReturn: 15,
        dropRate: 6,
        purchaseRatio: 33.33,
        purchaseAmount: 816000,
        startDate: new Date('2023-11-20'),
        history: [
          {
            id: '10-1-1',
            status: 'completed',
            startDate: new Date('2023-11-20'),
            endDate: new Date('2023-12-10'),
            quantity: 1,
            purchaseAmount: 816000,
            sellAmount: 857000,  // 5% 수익으로 첫 매도
            finalReturn: 5,
            finalProfit: 41000
          },
          {
            id: '10-1-2',
            status: 'completed',
            startDate: new Date('2023-12-20'),
            endDate: new Date('2024-01-10'),
            quantity: 1,
            purchaseAmount: 816000,
            sellAmount: 938400,  // 15% 수익으로 최종 매도
            finalReturn: 15,
            finalProfit: 122400
          }
        ]
      },
      {
        stage: 2,
        status: 'pending',
        targetReturn: 12,
        dropRate: 6,
        purchaseRatio: 33.33,
        startDate: null,
        history: []
      },
      {
        stage: 3,
        status: 'pending',
        targetReturn: 10,
        purchaseRatio: 33.33,
        startDate: null,
        history: []
      }
    ]
  },
};
