import React from 'react';
import { useParams } from 'react-router-dom';
import { PurchaseDetailsPage } from './PurchaseDetailsPage';
import { mockPurchaseDetailsData } from '../mocks/purchaseDetailsData';

export function PurchaseDetailsPageContainer() {
  const { id } = useParams<{ id: string }>();
  
  // 실제 구현 시에는 API에서 데이터를 가져오도록 수정
  const data = mockPurchaseDetailsData[id || '3'];

  if (!data) {
    return <div>전략을 찾을 수 없습니다.</div>;
  }

  return <PurchaseDetailsPage data={data} />;
}
