# N-Split Backend

N-Split 메인 서버 - 사용자 인증, 세션 관리, 자동 매매 로직을 담당합니다.

## 기술 스택

- Python 3.12
- FastAPI
- SQLAlchemy 2.0
- PostgreSQL
- Google OAuth 2.0
- JWT
- APScheduler

## 설치

### uv 사용 (권장)

```bash
# uv 설치 (없는 경우)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 패키지 설치 및 가상환경 생성
uv sync

# 환경 변수 설정
cp .env.example .env
```

### pip 사용 (기존 방식)

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
DATABASE_URL=postgresql://user:password@localhost:5432/nsplit
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7
SIMULATOR_API_URL=http://localhost:8001
SIMULATOR_API_KEY=shared-secret-key
```

## 실행

### uv 사용

```bash
uv run uvicorn app.main:app --reload --port 8000
```

### pip 사용

```bash
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

API 문서: http://localhost:8000/docs

## 주요 기능

### 인증 (Auth)

- Google OAuth 2.0 로그인
- JWT 토큰 발급 및 검증
- 사용자 정보 관리

### 세션 (Sessions)

- 세션 생성/조회/수정/삭제 (CRUD)
- 세션 시작/일시정지
- 세션 상태 관리 (ready/running/paused/completed)

### 포지션 (Positions)

- 포지션 조회
- 자동 생성/업데이트 (Worker)

### 자동 매매 Worker

- 5초 간격 실행
- 매수/매도 조건 모니터링
- Simulator API 호출
- 포지션 자동 관리

## 프로젝트 구조

```
nsplit-backend/
├── app/
│   ├── api/v1/          # API 엔드포인트
│   ├── models/          # SQLAlchemy 모델
│   ├── schemas/         # Pydantic 스키마
│   ├── services/        # 외부 서비스 클라이언트
│   ├── workers/         # 백그라운드 워커
│   ├── auth.py          # 인증 유틸리티
│   ├── config.py        # 설정
│   ├── database.py      # DB 연결
│   ├── dependencies.py  # FastAPI 의존성
│   └── main.py          # FastAPI 앱
├── .env.example
├── .python-version
├── pyproject.toml
├── requirements.txt       # 호환성 유지
└── README.md
```

## 데이터베이스 스키마

### users
- 사용자 정보 (Google OAuth)

### sessions
- 세션 설정 및 상태

### positions
- 매수/매도 포지션

### session_events
- 세션 이벤트 타임라인
