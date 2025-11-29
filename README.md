# N-Split Trading System

N-Split은 주식 투자 시 분할 매수/매도 전략을 자동화하는 시스템입니다. 사용자가 설정한 규칙에 따라 가격 하락 시 단계적으로 추가 매수하고, 각 매수 건별로 독립적인 수익률 달성 시 자동 매도합니다.

## 시스템 구조

```
N-Split/
├── nsplit-backend/      # N-Split 메인 서버 (FastAPI)
├── simulator-backend/   # 시뮬레이터 서버 (FastAPI)
└── nsplit-frontend/     # React Frontend
```

## 주요 기능

- **간편한 개발 인증**: 개발 모드에서는 username만으로 즉시 시작
- **세션 관리**: 종목별 자동 매매 설정 및 관리
- **자동 매매**: 5초 간격으로 매수/매도 조건 모니터링 및 자동 실행
- **시뮬레이션 모드**: 가상 주가와 계좌로 안전하게 테스트
- **실시간 모니터링**: 포지션 상태 및 이벤트 타임라인 실시간 업데이트
- **SQLite 기본 지원**: 별도 DB 설치 없이 바로 실행 가능

## 빠른 시작

### 사전 요구사항

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) (Python 패키지 관리자)
- Node.js 18+
- **데이터베이스 불필요** (SQLite 자동 생성)

**uv 설치**
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# pip으로 설치
pip install uv
```

### 1. 데이터베이스 설정

별도 설정 불필요! SQLite 파일이 자동으로 생성됩니다.
- `nsplit-backend/nsplit.db`
- `simulator-backend/simulator.db`

### 2. N-Split Backend 설정

```bash
cd nsplit-backend

# uv로 의존성 설치 (가상환경 자동 생성)
uv sync

# 환경 변수 설정 (선택사항, 기본값으로 실행 가능)
cp .env.example .env

# 서버 실행
uv run uvicorn app.main:app --reload --port 8000
```

### 3. Simulator Backend 설정

```bash
cd simulator-backend

# uv로 의존성 설치 (가상환경 자동 생성)
uv sync

# 환경 변수 설정 (선택사항, 기본값으로 실행 가능)
cp .env.example .env

# 서버 실행
uv run uvicorn app.main:app --reload --port 8001
```

### 4. Frontend 설정

```bash
cd nsplit-frontend

# 패키지 설치
npm install

# 환경 변수 설정 (선택사항, 기본값으로 실행 가능)
cp .env.example .env

# 개발 서버 실행
npm run dev
```

## 사용 방법

### 1. 로그인

**개발 모드 (기본)**
1. 브라우저에서 `http://localhost:5173` 접속
2. Username 입력 (예: `testuser`)
3. 로그인 - 자동으로 계정 생성됨

**API 직접 호출**
```bash
curl -X POST http://localhost:8000/api/auth/dev/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'
```

### 2. 세션 생성

1. "New Session" 버튼 클릭
2. 종목 정보 입력:
   - Stock Code: 종목 코드 (예: 005930)
   - Stock Name: 종목명 (예: 삼성전자)
   - Initial Buy Price: 1단계 매수가 (비워두면 현재가)
   - Amount Per Step: 단계당 투자금
   - Max Steps: 최대 단계수 (1-10)
   - Sell Trigger %: 매도 트리거 퍼센트 (1-20)
   - Buy Trigger %: 매수 트리거 퍼센트 (1-20)
3. "Create Session" 클릭

### 3. 세션 시작

1. 세션 목록에서 세션 클릭
2. "Start" 버튼 클릭
3. 자동 매매 시작 (5초 간격으로 실행)

### 4. 모니터링

- 포지션 테이블에서 각 단계별 매수/매도 상태 확인
- 이벤트 타임라인에서 매매 이력 확인
- 페이지는 5초마다 자동 새로고침

## API 문서

### N-Split Backend

서버 실행 후 `http://localhost:8000/docs` 접속

### Simulator Backend

서버 실행 후 `http://localhost:8001/docs` 접속

## 아키텍처

### N-Split Backend

- **FastAPI**: REST API 서버
- **SQLAlchemy**: ORM
- **SQLite**: 데이터베이스 (개발), PostgreSQL (프로덕션)
- **APScheduler**: 자동 매매 Worker (5초 간격)
- **JWT**: 인증 토큰
- **개발 인증**: Username 기반 간편 로그인
- **uv**: 빠른 Python 패키지 관리

### Simulator Backend

- **FastAPI**: REST API 서버
- **SQLAlchemy**: ORM
- **SQLite**: 데이터베이스 (개발), PostgreSQL (프로덕션)
- **NumPy**: 주가 시뮬레이션
- **APScheduler**: 주가 업데이트 Worker (5초 간격)
- **uv**: 빠른 Python 패키지 관리

### Frontend

- **React 18**: UI 프레임워크
- **React Router v6**: 라우팅
- **Axios**: HTTP 클라이언트
- **Tailwind CSS**: 스타일링
- **Vite**: 빌드 도구

## 개발 로드맵

- [x] Phase 0: 프로젝트 구조 및 환경 설정
- [x] Phase 1: 인증 시스템 (개발 인증, JWT)
- [x] Phase 2: 세션 및 포지션 CRUD API
- [x] Phase 3: 시뮬레이터 Backend
- [x] Phase 4: 자동 매매 Worker
- [x] Phase 5: React Frontend
- [x] Phase 5.5: SQLite 전환 및 개발 환경 최적화
- [ ] Phase 6: 테스트 및 문서화
- [ ] Phase 7: Google OAuth 연동
- [ ] Phase 8: 실제 증권사 API 연동
- [ ] Phase 9: PostgreSQL 마이그레이션
- [ ] Phase 10: 백테스팅 및 고급 기능

## 프로덕션 배포

### PostgreSQL 사용

`.env` 파일에서 DATABASE_URL 변경:
```
DATABASE_URL=postgresql://user:password@localhost:5432/nsplit
```

### Google OAuth 활성화

1. [Google Cloud Console](https://console.cloud.google.com/)에서 OAuth 2.0 Credentials 생성
2. `.env` 파일 설정:
```
DEV_MODE=false
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/callback
```

## 라이선스

MIT License

## 문의

이슈나 질문이 있으시면 GitHub Issues를 이용해 주세요.
