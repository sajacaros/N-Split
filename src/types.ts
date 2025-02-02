export type StrategyStatus = 'pending' | 'active' | 'completed' | 'failed';

export interface Strategy {
  id: string;
  stockName: string;
  currentPrice: number;
  investmentAmount: number;  // 설정된 투자 금액
  purchaseAmount: number | null;  // 실제 매수 금액
  totalReturn: number | null;
  status: StrategyStatus;
  stage: number;
  totalStages: number;  // 사용자 지정 단계
  startDate?: Date;
  endDate?: Date;
  useTwap: boolean;  // TWAP 사용 여부
}

export interface TwapTransaction {
  time: Date;
  price: number;
  quantity: number;
}

export interface StageTransaction {
  id: string;
  purchaseDate: Date;
  averagePrice: number;
  quantity: number;
  totalAmount: number;
  twapTransactions?: TwapTransaction[];
}

export interface Stage {
  stage: number;
  status: 'pending' | 'active' | 'completed';
  targetReturn: number;  // 매도 목표 수익률
  dropRate?: number;     // 매수 하락률 (다음 단계 매수 트리거)
  purchaseRatio: number;
  expectedPrice: number;
  purchasePrice: number;  // 매수 평균 단가
  quantity: number;       // 주식수
  currentValue?: number;
  currentReturn?: number;
  currentProfit?: number;
  sellAmount?: number;
  finalReturn?: number;
  finalProfit?: number;
  startDate: Date | null;
  endDate?: Date;
  history: StageHistory[];
}

export interface StageHistory {
  id: string;
  status: 'active' | 'completed';
  startDate: Date;
  endDate?: Date;
  quantity: number;       // 주식수
  purchaseAmount: number;  // 매수 단가
  sellAmount?: number;
}

export interface PurchaseDetailsData {
  id: string;
  name: string;
  totalStages: number;
  currentStage: number;
  totalInvestment: number;
  totalPurchaseAmount: number;
  currentValue: number;
  totalReturn: number;
  totalProfit: number;
  targetReturn: number;  // 전략 전체의 목표 수익률
  dropRate: number;      // 전략 전체의 매수 하락률
  stages: Stage[];
  history: StageHistory[];  // 전체 매수/매도 히스토리
}