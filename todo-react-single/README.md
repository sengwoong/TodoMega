## Todo Single App - Guide (초보자용)

이 프로젝트는 로그인/할일(Todo)/사용자(Users) 관리 흐름을 학습하기 위한 React 앱입니다. 내부 임시 백엔드(`src/back`)로 동작하므로 서버 없이 실행됩니다. 실서비스 백엔드는 없고, `back` 디렉토리는 데모용이니 구조 이해만 하시면 됩니다.

### 실행
- 개발: `npm start` → `http://localhost:3000`
- 빌드: `npm run build`

### 폴더 구조(핵심만)
- `src/pages`: 화면 구성 (Login, Todos, Users)
- `src/hook`: 공통 훅 (AuthContext, useDebouncedValue)
- `src/server`: React Query 훅 모음 (todos/users용)
- `src/components`: 재사용 컴포넌트 (Button, Modal, ModalPortal)
- `src/back`: 임시 백엔드 API (메모리 저장) ← 학습용이므로 자세히 보지 않아도 됩니다

---

## 관심사별 흐름

### 1) 로그인(Login)
- 파일: `src/pages/Login.js`
- 인증 상태: `src/hook/AuthContext.js`
  - 토큰을 localStorage에 보관(`demo_token`)하고, 앱 시작 시 사용자 동기화
  - `signIn(username, { remember })`, `signOut()` 제공
- UI 흐름:
  1. 아이디 입력 후 로그인 클릭 → `signIn` 호출
  2. 성공 시 이전 페이지 혹은 루트(`/`)로 이동
  3. 네비게이션 바 우측에 사용자 정보/로그아웃 버튼 노출

### 2) 할 일(Todos)
- 화면: `src/pages/Todos.js`
- 데이터 훅: `src/server/todoQueries.js`
  - `useTodosQuery()` 목록 조회
  - `useCreateTodoMutation()` 추가
  - `useUpdateTodoMutation()` 완료 토글
  - `useDeleteTodoMutation()` 삭제
  - `useTodosSearch(params)` 검색(제목/username/완료상태)
- UX 포인트:
  - 상단 입력으로 할일 추가 (작성자 선택 필수)
  - 검색바는 `useDebouncedValue`로 300ms 디바운스
  - 삭제 버튼 클릭 시 모달(포탈)로 “정말 삭제하시겠습니까?” 확인

### 3) 사용자(Users)
- 화면: `src/pages/Users.js`
- 데이터 훅: `src/server/userQueries.js`
  - `useUsersQuery()` 목록 조회
  - `useCreateUserMutation()` 추가
  - `useDeleteUserMutation()` 삭제
- UX 포인트:
  - 사용자 추가 폼 (username 필수, 이름 선택)
  - 각 사용자 삭제 시 모달 확인

---

## UI 컴포넌트

### Modal (포탈 + 컴파운드 컴포넌트)
- 위치: `src/components/Modal.js`, `src/components/ModalPortal.js`
- 사용 예시:
```jsx
<Modal open={open} onClose={onClose}>
  <Modal.Content>
    <Modal.Title>확인</Modal.Title>
    <Modal.Body>정말 삭제하시겠습니까?</Modal.Body>
    <Modal.Actions>
      <Button variant="ghost" onClick={onClose}>취소</Button>
      <Button variant="danger" onClick={onConfirm}>삭제</Button>
    </Modal.Actions>
  </Modal.Content>
</Modal>
```
- 특징: ESC/바깥 클릭 닫기, 포탈로 최상단 렌더, 크기 프리셋 지원(Content의 size prop로 확장 가능)

### Button
- 위치: `src/components/Button.js`
- props: `variant` = `primary | danger | ghost`

---

## 데이터 계층

### React Query 훅 (서버 호출 추상화)
- Todos: `src/server/todoQueries.js`
- Users: `src/server/userQueries.js`
- 페이지는 위 훅만 사용하여 데이터 접근 (API 세부 구현은 몰라도 됨)

### 임시 백엔드 (보지 않아도 됨)
- 위치: `src/back`
- 내용: 메모리 상에서 CRUD 수행, `public/server/*.json`으로 초기 데이터 로딩
- 목적: 서버 없이 전체 흐름을 연습하기 위한 스텁

---

## 중요한 흐름 다시 정리
- 로그인: `Login.js` → `useAuth().signIn()` → 네비에서 사용자 표시/로그아웃
- 투두:
  - 목록/검색: `useTodosQuery` / `useTodosSearch`
  - 추가/토글/삭제: 각 mutation 훅
  - 삭제 시 모달 확인
- 유저:
  - 목록/추가/삭제: 각 훅 사용
  - 삭제 시 모달 확인

---

## 팁
- 검색 입력 지연 처리: `useDebouncedValue` (입력 중 과도한 요청 방지)
- 공통 버튼 스타일: `components/Button`
- 모달은 페이지 로컬 상태로 제어하여 관심사 분리(로그아웃/삭제 각각 페이지에서 관리)

