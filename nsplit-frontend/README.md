# N-Split Frontend

N-Split Trading System의 React 기반 웹 인터페이스입니다.

## 기술 스택

- React 18
- Vite
- React Router v6
- Axios
- Tailwind CSS

## 설치

```bash
npm install
```

## 환경 변수

`.env` 파일을 생성하고 다음 값을 설정하세요:

```env
VITE_API_URL=http://localhost:8000
```

## 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5173 접속

## 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

## 주요 기능

### 인증

- Google OAuth 2.0 로그인
- JWT 토큰 기반 인증
- 자동 로그인 유지

### 세션 관리

- 세션 목록 조회 (상태별 필터링)
- 세션 생성
- 세션 상세 조회
- 세션 시작/일시정지

### 실시간 모니터링

- 5초마다 자동 새로고침
- 포지션 상태 실시간 업데이트
- 이벤트 타임라인

## 프로젝트 구조

```
nsplit-frontend/
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   ├── contexts/        # React Context (Auth)
│   ├── pages/           # 페이지 컴포넌트
│   ├── services/        # API 클라이언트
│   ├── App.jsx          # 메인 앱 컴포넌트
│   ├── main.jsx         # 엔트리 포인트
│   └── index.css        # 글로벌 스타일
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 주요 페이지

- `/login` - 로그인 페이지
- `/sessions` - 세션 목록
- `/sessions/new` - 세션 생성
- `/sessions/:id` - 세션 상세
