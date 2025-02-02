/*
  # N-Split 전략 관리 시스템 스키마

  1. New Tables
    - `strategies`
      - `id` (uuid, primary key): 전략 고유 식별자
      - `user_id` (uuid): 사용자 식별자 (Supabase Auth와 연동)
      - `stock_code` (text): 종목 코드
      - `stock_name` (text): 종목명
      - `current_price` (integer): 현재가
      - `investment_amount` (integer): 설정된 투자 금액
      - `purchase_amount` (integer): 실제 매수 금액
      - `total_return` (numeric): 총 수익률
      - `status` (text): 전략 상태 (pending/active/completed/failed)
      - `stage` (integer): 현재 단계
      - `total_stages` (integer): 총 단계 수
      - `start_date` (timestamptz): 시작일
      - `end_date` (timestamptz): 종료일
      - `created_at` (timestamptz): 생성일
      - `updated_at` (timestamptz): 수정일

    - `strategy_settings`
      - `id` (uuid, primary key): 설정 고유 식별자
      - `strategy_id` (uuid): 전략 ID (strategies 테이블 참조)
      - `buy_drop_percentage` (numeric): 매수 하락률
      - `target_return_percentage` (numeric): 목표 수익률
      - `created_at` (timestamptz): 생성일
      - `updated_at` (timestamptz): 수정일

    - `strategy_stages`
      - `id` (uuid, primary key): 단계 고유 식별자
      - `strategy_id` (uuid): 전략 ID (strategies 테이블 참조)
      - `stage_number` (integer): 단계 번호
      - `buy_percentage` (numeric): 매수 비중
      - `target_price` (integer): 목표 매수가
      - `actual_price` (integer): 실제 매수가
      - `status` (text): 단계 상태 (pending/completed)
      - `purchase_date` (timestamptz): 매수일
      - `created_at` (timestamptz): 생성일
      - `updated_at` (timestamptz): 수정일

  2. Security
    - 모든 테이블에 RLS 정책 적용
    - 사용자는 자신의 전략만 접근 가능
*/

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create strategies table
CREATE TABLE IF NOT EXISTS strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  stock_code text NOT NULL,
  stock_name text NOT NULL,
  current_price integer NOT NULL,
  investment_amount integer NOT NULL,
  purchase_amount integer,
  total_return numeric,
  status text NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'failed')),
  stage integer NOT NULL DEFAULT 0,
  total_stages integer NOT NULL,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create strategy_settings table
CREATE TABLE IF NOT EXISTS strategy_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE NOT NULL,
  buy_drop_percentage numeric NOT NULL,
  target_return_percentage numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create strategy_stages table
CREATE TABLE IF NOT EXISTS strategy_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE NOT NULL,
  stage_number integer NOT NULL,
  buy_percentage numeric NOT NULL,
  target_price integer NOT NULL,
  actual_price integer,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  purchase_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(strategy_id, stage_number)
);

-- Enable RLS
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_stages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own strategies"
  ON strategies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own strategies"
  ON strategies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own strategies"
  ON strategies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their strategy settings"
  ON strategy_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM strategies
      WHERE strategies.id = strategy_settings.strategy_id
      AND strategies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their strategy settings"
  ON strategy_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM strategies
      WHERE strategies.id = strategy_settings.strategy_id
      AND strategies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their strategy settings"
  ON strategy_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM strategies
      WHERE strategies.id = strategy_settings.strategy_id
      AND strategies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their strategy stages"
  ON strategy_stages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM strategies
      WHERE strategies.id = strategy_stages.strategy_id
      AND strategies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their strategy stages"
  ON strategy_stages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM strategies
      WHERE strategies.id = strategy_stages.strategy_id
      AND strategies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their strategy stages"
  ON strategy_stages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM strategies
      WHERE strategies.id = strategy_stages.strategy_id
      AND strategies.user_id = auth.uid()
    )
  );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_strategies_updated_at
  BEFORE UPDATE ON strategies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategy_settings_updated_at
  BEFORE UPDATE ON strategy_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategy_stages_updated_at
  BEFORE UPDATE ON strategy_stages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();