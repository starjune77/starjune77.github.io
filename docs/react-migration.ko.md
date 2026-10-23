# React 마이그레이션 안내

작업 브랜치는 `react-migration`이며, 기존 코드는 `main`의 `0e1824c` 커밋에 남아 있습니다. 같은 작업 폴더에서 파일이 바뀌어 보여도 원본 커밋이 삭제되는 것은 아닙니다.

## 실행

```sh
npm ci
npm run dev
```

배포용 빌드는 `npm run build`, 결과 확인은 `npm run preview`입니다. 이제 루트 HTML을 단순 정적 서버로 여는 대신 Vite를 사용합니다. 빌드 결과는 `dist/`에 생성됩니다.

## 파일 이동

| 기존 역할/파일 | 현재 위치 |
|---|---|
| `script.js` 초기화 및 연결 | `src/main.jsx`, `src/App.jsx` |
| `index.html`의 게임 화면 | `src/GameShell.jsx` |
| `index.html`의 대화상자 | `src/App.jsx`, `src/Dialog.jsx` |
| `js/terminal.js` | `src/Terminal.jsx` |
| `js/mobile-controls.js` | `src/App.jsx`의 포인터 이벤트 |
| `js/panels.js` | `src/panel-content.js`, `src/App.jsx`, `src/Dialog.jsx` |
| `js/resume.js` | `src/PortfolioContent.jsx` |
| `tools/build.cjs` | Vite와 `vite.config.js` |

터미널 입력과 출력 기록은 React 상태로 관리합니다. 팝업 전환, 단축키, 모바일 입력은 React 앱과 기존 게임 엔진을 연결합니다. 게임 물리 및 Canvas 렌더링은 기존 `js/` 모듈을 재사용합니다. 프레임마다 React를 다시 렌더링하지 않습니다.

포트폴리오 본문은 기존 `js/templates.js`와 `js/quick-view.js`의 이스케이프 처리된 HTML 생성 함수를 재사용하며 `PortfolioContent` 경계 안에서 표시합니다. 이 경계의 이력서 링크와 데모 컨트롤, 게임 HUD의 세부 DOM 값은 해당 어댑터가 관리합니다. 모든 템플릿을 JSX로 다시 작성한 구조는 아닙니다.

## 원본 보기

브랜치를 바꾸지 않고 기존 파일을 확인할 수 있습니다.

```sh
git show main:js/terminal.js
git show main:script.js
```

브랜치를 전환할 때는 현재 변경을 먼저 커밋하거나 stash해야 합니다. `docs/`의 기존 줄별 설명은 마이그레이션 이전 버전의 기록입니다.

## 검증과 배포

```sh
npm test
npm run test:browser
```

브라우저 검사는 설치된 Chrome/Chromium을 사용합니다. GitHub Pages용 워크플로는 `main`에서만 배포합니다. 병합하기 전에 GitHub 저장소 Settings → Pages의 Source를 GitHub Actions로 설정해야 합니다. 원격 설정 변경 및 실제 배포는 이번 로컬 작업에 포함하지 않았습니다.
