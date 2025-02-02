import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Target, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PurchaseDetailsData, StageDetail } from '../types';
import Layout from '../components/Layout';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ icon, label, value }) => (
  <div>
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
      {icon}
      <span>{label}</span>
    </div>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

interface StageRowProps {
  stage: StageDetail;
}

const StageRow: React.FC<StageRowProps> = ({ stage }) => {
  const isActive = stage.status === 'active';
  const returnValue = isActive ? stage.currentReturn : stage.finalReturn;
  const profitValue = isActive ? stage.currentProfit : stage.finalProfit;
  const evaluationValue = isActive ? stage.currentValue : stage.sellAmount;

  const [expanded, setExpanded] = useState(false);

  const renderHistory = () => {
    return stage.history.map(item => (
      <div key={item.id} className="pl-4 py-1">
        <p className="text-gray-600">{item.status === 'completed' ? '매도 완료' : '진행중'} ({new Date(item.startDate).toLocaleDateString()} ~ {item.endDate ? new Date(item.endDate).toLocaleDateString() : '현재'})</p>
        <p className="text-gray-600">매수금액: ₩{((item.purchasePrice ?? 0) * (item.quantity ?? 0)).toLocaleString()}</p>
        {item.status === 'completed' ? (
          <>
            <p className="text-gray-600">매도금액: ₩{item.sellAmount.toLocaleString()}</p>
            <p className="text-gray-600">수익률: {item.finalReturn}%</p>
            <p className="text-gray-600">수익금: ₩{item.finalProfit.toLocaleString()}</p>
          </>
        ) : (
          <>
            <p className="text-gray-600">현재가치: ₩{item.currentValue.toLocaleString()}</p>
            <p className="text-gray-600">수익률: {item.currentReturn}%</p>
            <p className="text-gray-600">평가손익: ₩{item.currentProfit.toLocaleString()}</p>
          </>
        )}
        <div className="my-1 border-b" />
      </div>
    ));
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <span>{stage.stage}단계</span>
            <button
              className="p-1 hover:bg-accent rounded-full"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </TableCell>
        <TableCell>
          <span className={cn(
            "ml-2 inline-block px-2 py-0.5 rounded-full text-xs",
            stage.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          )}>
            {stage.status === 'active' ? `진행중 (₩${stage.currentValue.toLocaleString()})` : '완료'}
          </span>
        </TableCell>
        <TableCell>₩{stage.purchaseAmount.toLocaleString()}</TableCell>
        <TableCell className={cn(
          returnValue > 0 ? 'text-red-600' : returnValue < 0 ? 'text-blue-600' : 'text-gray-600'
        )}>
          {returnValue}%
        </TableCell>
        <TableCell className={cn(
          profitValue > 0 ? 'text-red-600' : profitValue < 0 ? 'text-blue-600' : 'text-gray-600'
        )}>
          ₩{profitValue?.toLocaleString() || '-'}
        </TableCell>
        <TableCell>₩{stage.sellAmount?.toLocaleString() || '-'}</TableCell>
        <TableCell>{stage.endDate ? new Date(stage.endDate).toLocaleDateString() : '-'}</TableCell>
      </TableRow>
      {expanded && stage.history.map((item, index) => (
        <TableRow key={item.id} className="bg-muted/50">
          <TableCell colSpan={8}>
            <div className="pl-8 py-2 overflow-x-auto">
              <div className="whitespace-nowrap">
                <span className="font-medium mr-4">
                  {index + 1}차 {item.status === 'completed' ? '매도 완료' : '진행중'}
                </span>
                <span className="text-sm text-muted-foreground mr-4">
                  {new Date(item.startDate).toLocaleDateString()} ~ {item.endDate ? new Date(item.endDate).toLocaleDateString() : '현재'}
                </span>
                <span className="text-sm text-muted-foreground mr-4">
                  매수금액: ₩{((item.purchasePrice ?? 0) * (item.quantity ?? 0)).toLocaleString()}
                </span>
                {item.status === 'completed' ? (
                  <>
                    <span className="text-sm text-muted-foreground mr-4">
                      매도금액: ₩{item.sellAmount.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground mr-4">
                      수익률: {item.finalReturn}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      수익금: ₩{item.finalProfit.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-muted-foreground mr-4">
                      수익률: {item.currentReturn}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      평가손익: ₩{item.currentProfit.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

interface PurchaseDetailsPageProps {
  data: PurchaseDetailsData;
}

const PurchaseDetailsPage: React.FC<PurchaseDetailsPageProps> = ({ data }) => {
  const [showCompleted, setShowCompleted] = useState(false);

  const activeStages = data.stages.filter(stage => stage.status === 'active');
  const completedStages = data.stages.filter(stage => stage.status === 'completed');

  const filteredStages = showCompleted
    ? data.stages
    : data.stages.filter(stage => stage.status === 'active');

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">구매 상세 내역</h1>
            <p className="text-gray-600">총 {data.totalStages}단계 중 {data.currentStage}단계 진행 중</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
            />
            <Label>완료된 단계 표시</Label>
          </div>
        </div>

        {/* 상단 요약 정보 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <SummaryItem
                icon={<Target className="w-4 h-4" />}
                label="전략 단계"
                value={`${data.totalStages}단계`}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <SummaryItem
                icon={<Wallet className="w-4 h-4" />}
                label="총 투자 금액"
                value={`₩${data.totalInvestment.toLocaleString()}`}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <SummaryItem
                icon={<TrendingUp className="w-4 h-4" />}
                label="목표 수익률"
                value={`${data.targetReturn}%`}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <SummaryItem
                icon={<TrendingDown className="w-4 h-4" />}
                label="매수 하락률"
                value={`${data.dropRate}%`}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <SummaryItem
                icon={<Target className="w-4 h-4" />}
                label="진행 상태"
                value={`${data.currentStage}단계 진행 중`}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <SummaryItem
                icon={<Wallet className="w-4 h-4" />}
                label="평가 금액"
                value={`₩${data.currentValue.toLocaleString()}`}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <SummaryItem
                icon={<Wallet className="w-4 h-4" />}
                label="매입 금액"
                value={`₩${data.totalPurchaseAmount.toLocaleString()}`}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <SummaryItem
                icon={<TrendingUp className="w-4 h-4" />}
                label="수익률"
                value={`${data.totalReturn >= 0 ? '+' : ''}${data.totalReturn.toFixed(1)}%`}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <SummaryItem
                icon={<Wallet className="w-4 h-4" />}
                label="수익금"
                value={`${data.totalProfit >= 0 ? '+' : '-'}₩${Math.abs(data.totalProfit).toLocaleString()}`}
              />
            </CardContent>
          </Card>
        </div>

        {/* 진행 중인 단계 */}
        <div className="mb-8">
          <h2 className={cn("text-xl font-semibold mb-4", data.status === 'completed' && "text-gray-600")}>
            {data.status === 'completed' ? '진행 내역' : '진행 중인 단계'}
          </h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>단계</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>매수 금액</TableHead>
                  <TableHead>수익률</TableHead>
                  <TableHead>수익금</TableHead>
                  <TableHead>매도 금액</TableHead>
                  <TableHead>매도일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.status === 'completed'
                  ? data.stages.filter(stage => stage.status === 'completed').map(stage => (
                      <StageRow key={stage.stage} stage={stage} />
                    ))
                  : filteredStages.map(stage => (
                      <StageRow key={stage.stage} stage={stage} />
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">총 투자 금액</p>
              <p className="text-xl font-bold">₩{data.totalInvestment.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">총 매수 금액</p>
              <p className="text-xl font-bold">₩{data.totalPurchaseAmount.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">현재 평가 금액</p>
              <p className="text-xl font-bold">₩{data.currentValue.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">총 수익률</p>
              <p className={cn(
                "text-xl font-bold",
                data.totalReturn > 0 ? 'text-red-600' : data.totalReturn < 0 ? 'text-blue-600' : 'text-gray-600'
              )}>
                {data.totalReturn}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">총 수익금</p>
              <p className={cn(
                "text-xl font-bold",
                data.totalProfit > 0 ? 'text-red-600' : data.totalProfit < 0 ? 'text-blue-600' : 'text-gray-600'
              )}>
                ₩{data.totalProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { PurchaseDetailsPage };
export default PurchaseDetailsPage;
