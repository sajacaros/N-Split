# 📊 N-Split 주식 자동매매 시스템 PRD (MVP v3.0)

## 📑 목차
1. [제품 개요](#1-제품-개요)
2. [아키텍처 설계](#2-아키텍처-설계)
3. [핵심 시나리오](#3-핵심-시나리오)
4. [기능 요구사항](#4-기능-요구사항)
5. [데이터 모델](#5-데이터-모델)
6. [API 명세](#6-api-명세)
7. [기술 스택](#7-기술-스택)
8. [개발 우선순위](#8-개발-우선순위)
9. [성공 지표](#9-성공-지표)
10. [향후 계획](#10-향후-계획)

---

## 1. 제품 개요

### 1.1 제품 소개

N-Split은 주식 투자 시 분할 매수/매도 전략을 자동화하는 시스템입니다. 사용자가 설정한 규칙에 따라 가격 하락 시 단계적으로 추가 매수하고, 각 매수 건별로 독립적인 수익률 달성 시 자동 매도합니다.

### 1.2 핵심 가치

- **리스크 분산**: N단계로 분할하여 평균 매수가 개선
- **자동화**: 24시간 가격 모니터링 및 자동 매매
- **독립 관리**: 각 매수 단계를 독립적으로 관리
- **시뮬레이션**: 실제 거래 전 가상 환경에서 테스트
- **개인정보 보호**: Google 인증을 통한 안전한 사용자 관리
- **확장성**: 실제 증권사 API로 쉽게 전환 가능한 구조

### 1.3 MVP 범위

**포함**:
- Google OAuth 2.0 인증
- 세션 생성 및 관리 (CRUD)
- 시뮬레이션 모드 자동 매매
- 단계별 포지션 독립 관리
- 사용자별 데이터 격리
- **시뮬레이터 독립 서버** (향후 실제 증권사 API로 전환 용이)

**제외**:
- 실제 증권사 API 연동
- 백테스팅 도구
- 고급 차트 및 분석
- 다중 전략 동시 실행

---

## 2. 아키텍처 설계

### 2.1 시스템 구조

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                    (React + React Router)                   │
└───────────────────┬─────────────────────────────────────────┘
                    │ HTTPS/REST
                    │ JWT Authentication
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    N-Split Backend                          │
│                      (FastAPI)                              │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Auth Module │  │Session Module│  │ Position Module  │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Auto Trading Worker (Background)             │  │
│  │  - 매수/매도 트리거 모니터링 (5초 간격)               │  │
│  │  - Simulator API 호출                                │  │
│  │  - 포지션 자동 생성/업데이트                          │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────┬─────────────────────────────────────────┘
                    │ HTTP/REST
                    │ API Key Authentication
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                   Simulator Backend                         │
│                      (FastAPI)                              │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │Price Engine  │  │ Order Engine │  │ Account Module  │  │
│  │(랜덤워크/추세)│  │  (즉시체결)   │  │   (잔고관리)     │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌──────────────────────┐
│  N-Split DB     │         │   Simulator DB       │
│  (PostgreSQL)   │         │   (PostgreSQL)       │
│                 │         │                      │
│ - users         │         │ - sim_accounts       │
│ - sessions      │         │ - sim_orders         │
│ - positions     │         │ - sim_price_history  │
│ - session_events│         │ - sim_stocks         │
└─────────────────┘         └──────────────────────┘
```

### 2.2 프로젝트 구조

```
workspace/
│
├── nsplit-backend/                    # N-Split 메인 서버
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── auth.py               # Google OAuth, JWT
│   │   │   ├── sessions.py           # 세션 CRUD
│   │   │   └── positions.py          # 포지션 조회
│   │   ├── models/                   # SQLAlchemy Models
│   │   ├── schemas/                  # Pydantic Schemas
│   │   ├── services/
│   │   │   └── simulator_client.py   # Simulator API 호출
│   │   └── workers/
│   │       └── auto_trading_worker.py
│   ├── .env
│   └── requirements.txt
│
├── simulator-backend/                 # 시뮬레이터 독립 서버
│   ├── app/
│   │   ├── api/
│   │   │   ├── price.py              # 현재가 조회
│   │   │   ├── order.py              # 매수/매도 주문
│   │   │   └── account.py            # 계좌 조회/관리
│   │   ├── engine/
│   │   │   ├── price_simulator.py    # 주가 시뮬레이션
│   │   │   └── order_executor.py     # 주문 체결
│   │   ├── models/                   # SQLAlchemy Models
│   │   └── schemas/                  # Pydantic Schemas
│   ├── .env
│   └── requirements.txt
│
└── nsplit-frontend/                   # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── auth/
    │   │   └── session/
    │   ├── pages/
    │   ├── services/
    │   │   └── api.js                # Axios 기반 API 클라이언트
    │   └── contexts/
    ├── .env
    └── package.json
```

### 2.3 서버 간 통신

#### Frontend ↔ N-Split Backend
- **프로토콜**: HTTPS/REST
- **인증**: JWT Bearer Token
- **포맷**: JSON

#### N-Split Backend ↔ Simulator Backend
- **프로토콜**: HTTP/REST
- **인증**: API Key (Header: `X-Simulator-API-Key`)
- **포맷**: JSON
- **재시도**: 실패 시 3회 재시도 (Exponential Backoff)
- **타임아웃**: 5초

### 2.4 데이터 흐름

**자동 매수 프로세스:**
1. Auto Trading Worker가 5초마다 running 세션 스캔
2. Simulator API로 현재가 조회
3. 매수 조건 충족 시 Simulator API로 매수 주문
4. 주문 체결 결과로 Position 생성
5. Session Event 로깅

**자동 매도 프로세스:**
1. Worker가 holding 포지션 스캔
2. 매도 조건 충족 시 Simulator API로 매도 주문
3. Position 업데이트 (status: sold, 수익 계산)
4. 모든 포지션 매도 시 세션 completed로 변경

---

## 3. 핵심 시나리오

### 3.1 사용자 프로필

**김철수 (30대 직장인)**
- 주식 투자 경험 2년
- 매수/매도 타이밍 자주 놓침
- 자동화 도구 필요
- 개인정보 보안 중시
- 실전 투자 전 시뮬레이션 테스트 원함

### 3.2 주요 시나리오

#### 3.2.1 최초 로그인
1. "Google로 로그인" 버튼 클릭
2. Google 계정 선택 및 권한 승인
3. N-Split 서버에 자동 회원가입
4. JWT 토큰 발급 및 로컬스토리지 저장
5. Simulator 서버에 가상 계좌 자동 생성 (초기 잔고 10,000,000원)
6. 세션 목록 페이지로 이동

#### 3.2.2 세션 생성 및 자동 매매

**설정 예시:**
- 종목: 삼성전자 (005930)
- 1단계 매수가: 70,000원
- 단계당 투자금: 1,000,000원
- 최대 단계: 5단계
- 매도 트리거: +5%
- 매수 트리거: -3%

**계산된 매수가:**
- 1단계: 70,000원
- 2단계: 67,900원 (70,000 × 0.97)
- 3단계: 65,863원 (67,900 × 0.97)
- 4단계: 63,887원 (65,863 × 0.97)
- 5단계: 61,971원 (63,887 × 0.97)

**자동 매매 타임라인:**

```
시간    현재가      이벤트                      포지션 상태               비고
──────────────────────────────────────────────────────────────────────────
10:00   70,000원    1단계 매수 (14주)           1단계: holding           초기 매수
10:15   67,900원    2단계 매수 (14주)           1,2단계: holding         추가 매수
10:30   65,863원    3단계 매수 (15주)           1,2,3단계: holding       추가 매수
10:45   69,156원    3단계 매도 (+5% 달성)       1,2단계: holding         부분 익절
11:00   65,863원    3단계 재매수 (15주)         1,2,3단계: holding       반복 매수
11:15   69,156원    3단계 재매도 (+5% 달성)     1,2단계: holding         반복 익절
11:30   71,295원    2단계 매도 (+5% 달성)       1단계: holding           추가 익절
11:45   73,500원    1단계 매도 (+5% 달성)       없음                     전체 정리
──────────────────────────────────────────────────────────────────────────
세션 상태: completed
총 수익: 약 150,000원 (매도 3회 반복으로 누적 수익)
```

#### 3.2.3 세션 관리
- **일시정지**: running → paused (자동 매매 중단)
- **재시작**: paused → running (자동 매매 재개)
- **삭제**: ready 상태에서만 가능

---

## 4. 기능 요구사항

### 4.1 N-Split Backend

#### 4.1.1 인증 시스템

**Google OAuth 2.0**
- Scope: openid, email, profile
- 인증 플로우: 로그인 URL → Google 인증 → 콜백 → JWT 발급
- JWT: HS256, 7일 만료, Payload(user_id, email, exp)
- 데이터 격리: user_id로 필터링, 403 Forbidden

#### 4.1.2 세션 관리

**세션 생성 필드:**
- stock_code: 종목 코드 (6자리)
- stock_name: 종목명
- initial_buy_price: 1단계 매수가 (null = 현재가)
- amount_per_step: 단계당 투자금
- max_steps: 최대 단계수 (1~10)
- sell_trigger_pct: 매도 트리거 % (1~20)
- buy_trigger_pct: 매수 트리거 % (1~20)

**세션 상태:**

| 상태 | 설명 | 전환 | 수정 | 삭제 |
|------|------|------|------|------|
| ready | 대기중 | → running | ✅ | ✅ |
| running | 실행중 | → paused, completed | ❌ | ❌ |
| paused | 일시정지 | → running | ❌ | ❌ |
| completed | 완료 | - | ❌ | ❌ |

**기능:**
- CRUD (Create, Read, Update, Delete)
- 상태 전환 (start, pause)
- 필터링 (status, stock_code)

#### 4.1.3 포지션 관리

**포지션 정보:**
- step_number: 단계 번호
- buy_price: 매수가
- quantity: 수량
- buy_time: 매수 시각
- sell_target_price: 매도 목표가
- sell_price: 매도가 (nullable)
- sell_time: 매도 시각 (nullable)
- realized_profit: 실현 손익 (nullable)
- status: holding/sold

**기능:**
- 세션별 포지션 조회
- 개별 포지션 상세 조회
- 자동 생성/업데이트 (Worker)

#### 4.1.4 자동 매매 Worker

**동작:**
- 5초 간격 실행
- running 세션만 대상

**매수 로직:**
1. 다음 단계 매수가 계산
2. 현재가 ≤ 매수가 확인
3. 해당 단계 holding 포지션 없음 확인
4. 하위 단계 holding 포지션 없음 확인
5. 매수 주문 → Position 생성

**매도 로직:**
1. holding 포지션 순회
2. 현재가 ≥ 매도 목표가 확인
3. 매도 주문 → Position 업데이트 (sold)
4. 모든 포지션 sold → 세션 completed

#### 4.1.5 Simulator Client

**API 호출:**
- get_current_price(): 현재가 조회
- place_buy_order(): 매수 주문
- place_sell_order(): 매도 주문
- get_account_balance(): 잔고 조회

**에러 처리:**
- 3회 재시도 (Exponential Backoff)
- 타임아웃 5초
- 실패 시 세션 일시정지 + 에러 로깅

### 4.2 Simulator Backend

#### 4.2.1 Price Engine

**시뮬레이션 모드:**
- Random Walk: 무작위 변동
- Trend: 상승/하락/횡보
- Custom: 사용자 정의 패턴

**주가 생성:**
- 변동폭: ±3% (설정 가능)
- 업데이트: 5초 간격
- 히스토리 저장 (차트용)

#### 4.2.2 Order Engine

**체결 방식:**
- 즉시 체결 (시뮬레이션)
- 지정가 주문만
- 체결가 = 주문가

**매수:**
1. 잔고 확인
2. 잔고 차감
3. 보유 주식 증가
4. 주문 내역 저장

**매도:**
1. 보유 주식 확인
2. 보유 주식 감소
3. 잔고 증가
4. 수익 계산
5. 주문 내역 저장

#### 4.2.3 Account Module

**가상 계좌:**
- 초기 잔고: 10,000,000원
- 사용자별 독립 계좌
- 현금 + 보유 주식 = 총 자산

**기능:**
- 계좌 조회
- 계좌 초기화
- 거래 내역 조회

#### 4.2.4 API 인증

- API Key: N-Split Backend만 접근
- Header: X-Simulator-API-Key
- 키 불일치 시 401 Unauthorized

---

## 5. 데이터 모델

### 5.1 ERD

```
N-Split DB:
users (1) ────< (N) sessions
                     |
                     +────< (N) positions
                     |
                     +────< (N) session_events

Simulator DB:
sim_accounts (1) ────< (N) sim_orders
      |
      +────< (N) sim_stocks

sim_price_history (독립 테이블)
```

### 5.2 N-Split Database

#### users
- id (UUID, PK)
- google_id (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- name (VARCHAR)
- profile_picture_url (TEXT)
- created_at, last_login_at (TIMESTAMP)

#### sessions
- id (UUID, PK)
- user_id (UUID, FK)
- stock_code, stock_name (VARCHAR)
- initial_buy_price (DECIMAL)
- amount_per_step (DECIMAL)
- max_steps (INTEGER)
- sell_trigger_pct, buy_trigger_pct (DECIMAL)
- status (VARCHAR: ready/running/paused/completed)
- current_step (INTEGER)
- first_buy_price (DECIMAL)
- created_at, started_at, completed_at (TIMESTAMP)

**인덱스:**
- (user_id, status)
- (status)

#### positions
- id (UUID, PK)
- session_id (UUID, FK)
- step_number (INTEGER)
- buy_price, quantity (DECIMAL)
- buy_time (TIMESTAMP)
- sell_target_price (DECIMAL)
- sell_price (DECIMAL, nullable)
- sell_time (TIMESTAMP, nullable)
- realized_profit (DECIMAL, nullable)
- status (VARCHAR: holding/sold)

**인덱스:**
- (session_id, status)
- (session_id, step_number, status)

#### session_events
- id (UUID, PK)
- session_id (UUID, FK)
- event_type (VARCHAR: buy/sell/start/pause/resume/complete/error)
- position_id (UUID, nullable)
- price, quantity (DECIMAL, nullable)
- message (TEXT, nullable)
- created_at (TIMESTAMP)

### 5.3 Simulator Database

#### sim_accounts
- id (UUID, PK)
- user_id (UUID, UNIQUE) - N-Split users.id 참조
- cash (DECIMAL, DEFAULT 10000000)
- created_at, updated_at (TIMESTAMP)

#### sim_orders
- id (UUID, PK)
- account_id (UUID, FK)
- stock_code (VARCHAR)
- order_type (VARCHAR: buy/sell)
- price, quantity (DECIMAL)
- status (VARCHAR: filled)
- executed_at (TIMESTAMP)

#### sim_stocks
- id (UUID, PK)
- account_id (UUID, FK)
- stock_code (VARCHAR)
- quantity (DECIMAL)
- avg_buy_price (DECIMAL)
- updated_at (TIMESTAMP)

**Unique:** (account_id, stock_code)

#### sim_price_history
- id (UUID, PK)
- stock_code (VARCHAR)
- price (DECIMAL)
- timestamp (TIMESTAMP)

**인덱스:** (stock_code, timestamp)

---

## 6. API 명세

### 6.1 N-Split Backend

**Base URL**: `http://localhost:8000/api`

#### Auth API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /auth/google/url | Google 로그인 URL | N/A |
| POST | /auth/google/callback | 콜백 처리, JWT 발급 | N/A |
| GET | /auth/me | 현재 사용자 정보 | Required |
| POST | /auth/logout | 로그아웃 | Required |

#### Session API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | /sessions | 세션 생성 | Required |
| GET | /sessions | 세션 목록 (필터: status) | Required |
| GET | /sessions/{id} | 세션 상세 (포지션 포함) | Required |
| PATCH | /sessions/{id} | 세션 수정 (ready만) | Required |
| DELETE | /sessions/{id} | 세션 삭제 (ready만) | Required |
| POST | /sessions/{id}/start | 시작/재시작 | Required |
| POST | /sessions/{id}/pause | 일시정지 | Required |

#### Position API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /positions/session/{session_id} | 세션별 포지션 목록 | Required |
| GET | /positions/{id} | 포지션 상세 | Required |

#### Event API

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /sessions/{id}/events | 세션 이벤트 (타임라인) | Required |

### 6.2 Simulator Backend

**Base URL**: `http://localhost:8001/api`  
**인증**: Header: `X-Simulator-API-Key`

#### Price API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /price/{stock_code} | 현재가 조회 |
| GET | /price/{stock_code}/history | 가격 이력 |

#### Order API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /order/buy | 매수 주문 |
| POST | /order/sell | 매도 주문 |
| GET | /order/{order_id} | 주문 조회 |
| GET | /order/account/{user_id} | 주문 내역 |

#### Account API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /account/{user_id} | 계좌 조회 |
| POST | /account/{user_id}/reset | 계좌 초기화 |

#### Config API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /config/simulation | 시뮬레이션 설정 |
| GET | /config/simulation | 설정 조회 |

---

## 7. 기술 스택

### 7.1 Backend

**공통:**
- Python 3.11+
- FastAPI
- PostgreSQL 15+
- SQLAlchemy 2.0
- Alembic
- Pydantic v2

**N-Split 전용:**
- Google OAuth 2.0
- PyJWT
- httpx (Simulator 통신)
- APScheduler (Worker)

**Simulator 전용:**
- numpy (주가 시뮬레이션)

### 7.2 Frontend

- React 18
- Vite
- React Router v6
- Axios
- Context API
- Tailwind CSS

### 7.3 환경 변수

**N-Split Backend (.env):**
```
DATABASE_URL=postgresql://user:pass@localhost:5432/nsplit
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
JWT_SECRET_KEY=...
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7
SIMULATOR_API_URL=http://localhost:8001
SIMULATOR_API_KEY=shared-secret
```

**Simulator Backend (.env):**
```
DATABASE_URL=postgresql://user:pass@localhost:5432/simulator
API_KEY=shared-secret
DEFAULT_INITIAL_CASH=10000000
PRICE_UPDATE_INTERVAL=5
DEFAULT_VOLATILITY=3.0
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
```

---

## 8. 개발 우선순위

### Phase 0: 환경 설정 (1주)
- PostgreSQL 설치 (nsplit, simulator DB)
- 프로젝트 구조 생성 (3개)
- .env 파일 구성
- Google OAuth 설정

### Phase 1: 인증 시스템 (1주)
- users 테이블
- Google OAuth API
- JWT 미들웨어
- Frontend 로그인 페이지
- ProtectedRoute
- 가상 계좌 자동 생성

### Phase 2: 기본 CRUD (1주)
- sessions, positions, session_events 테이블
- Session CRUD API
- Position 조회 API
- Frontend 세션 목록/생성/상세
- 세션 상태 관리

### Phase 3: 시뮬레이터 (1주)
- Simulator DB 테이블
- Price Engine
- Order Engine
- Account API
- API Key 인증
- Simulator Client (N-Split)

### Phase 4: 자동 매매 (2주)
- Auto Trading Worker
- 매수/매도 트리거 로직
- 포지션 자동 생성/업데이트
- 세션 상태 자동 전환
- 이벤트 로깅
- 통합 테스트

### Phase 5: 실시간 UI (1주)
- 실시간 가격 업데이트 (Polling)
- 포지션 자동 리프레시
- 타임라인 컴포넌트
- 에러 메시지 표시
- 반응형 디자인

### Phase 6: 테스트 및 최적화 (1주)
- 단위 테스트
- 통합 테스트
- 성능 테스트
- 보안 테스트
- 문서화

**총 예상 기간**: 7주

---

## 9. 성공 지표

### 기능
- Phase 0~6 완료율 100%
- Google OAuth 성공률 > 99%
- 자동 매매 정확도 100%

### 성능
- API 응답 < 200ms (95%)
- 자동 매매 반응 < 10초
- 동시 10명 × 10세션 지원

### 안정성
- 24시간 무중단 운영
- 에러율 < 1%
- 데이터 손실 0건

### 보안
- JWT 보안
- 데이터 격리 위반 0건
- SQL Injection 0건

---

## 10. 향후 계획

### Phase 7: 실제 증권사 API (4주)
- 한국투자증권 API 연동
- 실전/모의 모드 분리
- 실시간 시세
- 실제 주문 체결

### Phase 8: 고급 기능 (8주)
- 백테스팅
- 전략 최적화
- 다중 전략
- 수익률 차트
- 알림 확장

### Phase 9: 성능 개선 (2주)
- Redis 캐싱
- WebSocket
- DB 최적화

### Phase 10: 모바일 앱 (8주)
- React Native
- 푸시 알림
- 생체 인증

---

## 부록

### A. 용어 정의

- **세션**: 종목별 자동 매매 단위
- **단계**: 분할 매수의 각 회차
- **포지션**: 각 단계별 매수 건
- **트리거**: 자동 매매 조건
- **반복 매매**: 동일 단계 매도 후 재매수
- **시뮬레이터**: 가상 주가 및 체결 시뮬레이션 서버

### B. 계산 공식

**N단계 매수가:**
```
N단계 매수가 = 1단계 매수가 × (1 - buy_trigger_pct/100)^(N-1)
```

**매도 목표가:**
```
매도가 = 매수가 × (1 + sell_trigger_pct/100)
```

**수량:**
```
수량 = 단계당 투자금 / 매수가 (소수점 버림)
```

**실현 손익:**
```
실현 손익 = (매도가 - 매수가) × 수량
수익률 = (매도가 - 매수가) / 매수가 × 100
```

### C. 상태 전환 다이어그램

```
[생성] → [ready] → [running] ←→ [paused]
                       ↓
                  [completed]

삭제 가능: ready ✅
삭제 불가: running, paused, completed ❌
```

### D. 아키텍처 의사결정

**시뮬레이터 분리 이유:**
1. 관심사 분리
2. 재사용성
3. 확장성 (실제 증권사 API 전환)
4. 독립 개발/배포
5. 성능 스케일링

**단점 및 해결:**
- 네트워크 레이턴시 → 5초 스캔으로 최소화
- 트랜잭션 복잡도 → 재시도 및 일시정지
- 디버깅 복잡도 → 상세 이벤트 로깅

---

**문서 버전**: 3.0  
**최종 수정**: 2025-11-15
