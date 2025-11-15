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

- **Google OAuth 2.0 인증**: 안전한 사용자 관리
- **세션 관리**: 종목별 자동 매매 설정 및 관리
- **자동 매매**: 5초 간격으로 매수/매도 조건 모니터링 및 자동 실행
- **시뮬레이션 모드**: 가상 주가와 계좌로 안전하게 테스트
- **실시간 모니터링**: 포지션 상태 및 이벤트 타임라인 실시간 업데이트

## 빠른 시작

### 사전 요구사항

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Google OAuth 2.0 Credentials

### 1. 데이터베이스 설정

```bash
# PostgreSQL에 두 개의 데이터베이스 생성
createdb nsplit
createdb simulator
```

### 2. N-Split Backend 설정

```bash
cd nsplit-backend

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 필요한 값 입력

# 서버 실행
uvicorn app.main:app --reload --port 8000
```

### 3. Simulator Backend 설정

```bash
cd simulator-backend

# 가상환경 생성 및 활성화
python -m venv venv
source venv/bin/activate

# 패키지 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 필요한 값 입력

# 서버 실행
uvicorn app.main:app --reload --port 8001
```

### 4. Frontend 설정

```bash
cd nsplit-frontend

# 패키지 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 API URL 입력

# 개발 서버 실행
npm run dev
```

## Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. "APIs & Services" > "Credentials" 이동
4. "Create Credentials" > "OAuth 2.0 Client ID" 선택
5. Application type: Web application
6. Authorized redirect URIs 추가:
   - `http://localhost:5173/auth/callback`
7. Client ID와 Client Secret을 `.env` 파일에 입력

## 사용 방법

### 1. 로그인

1. 브라우저에서 `http://localhost:5173` 접속
2. "Login with Google" 버튼 클릭
3. Google 계정으로 인증

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
- **PostgreSQL**: 데이터베이스
- **APScheduler**: 자동 매매 Worker (5초 간격)
- **JWT**: 인증 토큰

### Simulator Backend

- **FastAPI**: REST API 서버
- **SQLAlchemy**: ORM
- **PostgreSQL**: 데이터베이스
- **NumPy**: 주가 시뮬레이션
- **APScheduler**: 주가 업데이트 Worker (5초 간격)

### Frontend

- **React 18**: UI 프레임워크
- **React Router v6**: 라우팅
- **Axios**: HTTP 클라이언트
- **Tailwind CSS**: 스타일링
- **Vite**: 빌드 도구

## 개발 로드맵

- [x] Phase 0: 프로젝트 구조 및 환경 설정
- [x] Phase 1: 인증 시스템 (Google OAuth, JWT)
- [x] Phase 2: 세션 및 포지션 CRUD API
- [x] Phase 3: 시뮬레이터 Backend
- [x] Phase 4: 자동 매매 Worker
- [x] Phase 5: React Frontend
- [ ] Phase 6: 테스트 및 문서화
- [ ] Phase 7: 실제 증권사 API 연동
- [ ] Phase 8: 백테스팅 및 고급 기능

## 라이선스

MIT License

## 문의

이슈나 질문이 있으시면 GitHub Issues를 이용해 주세요.
