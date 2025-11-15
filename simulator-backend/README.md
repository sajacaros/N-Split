# Simulator Backend

주가 시뮬레이션 및 가상 주문 체결을 담당하는 독립 서버입니다.

## 기술 스택

- Python 3.11+
- FastAPI
- SQLAlchemy 2.0
- PostgreSQL
- NumPy
- APScheduler

## 설치

```bash
# 가상환경 생성
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
```

## 환경 변수

`.env` 파일에 다음 값들을 설정하세요:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/simulator
API_KEY=shared-secret-key
DEFAULT_INITIAL_CASH=10000000
PRICE_UPDATE_INTERVAL=5
DEFAULT_VOLATILITY=3.0
```

## 실행

```bash
uvicorn app.main:app --reload --port 8001
```

API 문서: http://localhost:8001/docs

## 주요 기능

### Price Engine

- Random Walk 기반 주가 시뮬레이션
- 5초 간격 가격 업데이트
- 가격 이력 저장

### Order Engine

- 즉시 체결 방식
- 매수/매도 주문 처리
- 잔고 및 보유 주식 관리

### Account Module

- 가상 계좌 관리
- 초기 잔고: 10,000,000원
- 계좌 조회 및 초기화

## API 인증

모든 API 요청에는 Header에 API Key가 필요합니다:

```
X-Simulator-API-Key: your-api-key
```

## 프로젝트 구조

```
simulator-backend/
├── app/
│   ├── api/             # API 엔드포인트
│   ├── engine/          # 시뮬레이션 엔진
│   ├── models/          # SQLAlchemy 모델
│   ├── schemas/         # Pydantic 스키마
│   ├── workers/         # 백그라운드 워커
│   ├── config.py        # 설정
│   ├── database.py      # DB 연결
│   ├── dependencies.py  # FastAPI 의존성
│   └── main.py          # FastAPI 앱
├── .env.example
├── requirements.txt
└── README.md
```

## 데이터베이스 스키마

### sim_accounts
- 가상 계좌 정보

### sim_orders
- 주문 체결 내역

### sim_stocks
- 보유 주식 정보

### sim_price_history
- 주가 이력
