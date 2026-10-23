# React 마이그레이션과 코드 구조

이 작업은 `react` 브랜치에서만 진행했습니다. `main`, `react-migration` 브랜치에는 변경을 적용하지 않았고 원격 푸시나 배포도 하지 않았습니다.

기존 `App.jsx`에서 연습한 `profile.name`, `profile.role`, `profile.tagline` 표시를 전체 포트폴리오 컴포넌트로 확장했습니다. 사실 정보는 계속 `js/data.js`에서 가져옵니다.

## 1. 최종 폴더 구조

```text
index.html                  브라우저가 여는 시작 문서 / noscript 대체 콘텐츠
react-test.html             기존 테스트 주소 유지: 같은 React 앱을 실행
style.css                   기존 디자인을 그대로 재사용
package.json                패키지와 실행 명령
package-lock.json           정확한 설치 버전
vite.config.js              JSX 변환, 빌드, 정적 파일 복사
src/
  main.jsx                  React 시작
  App.jsx                   열린 화면과 전체 연결 관리
  navigation.js             딥링크, 패널 제목, 닫기 규칙
  components/
    GameShell.jsx           Canvas와 게임 UI 조립
    GameHUD.jsx             현재 구역, 진행 표시, 튜토리얼, 상호작용 안내
    MobileControls.jsx      멀티터치 버튼과 모바일 시작 선택창
    Dialog.jsx              네이티브 dialog와 React 상태 연결
    QuickView.jsx           전체 포트폴리오
    InfoPanel.jsx           About / 프로젝트 / 이력서 등의 상세 패널
    Portfolio.jsx           공통 섹션, 프로젝트 카드, 데모
    Terminal.jsx            터미널 명령 입력과 출력 기록
  hooks/
    useGame.js              게임 엔진 생성, React 연결, 정리
    useResume.js            이력서 PDF 존재 확인
js/
  data.js                   포트폴리오 정보의 단일 원본
  game.js                   게임 루프와 React에 전달할 HUD 정보
  debug.js                  진단 정보 생성
  input.js                  키보드와 터치 입력 상태
  player.js, physics.js     캐릭터 운동과 충돌
  camera.js                 카메라 계산
  world.js                  구역, 발판, 키오스크
  interactions.js           상호작용 판정과 재실행 제한
  render-*.js, palette.js   기존 Canvas 그림과 효과
  utils.js                  공통 계산과 게임 모드 상태
assets/                     PDF, 아이콘, SVG, 라이선스
tests/
  game.test.mjs             물리, 카메라, 콘텐츠
  game-lifecycle.test.mjs   HUD 전달과 엔진 자원 정리
  react.test.mjs            JSX 콘텐츠, 내비게이션, 링크 상태
  browser-check.cjs        실제 Chrome 회귀 검사
tools/
  register-jsx.mjs          Node 테스트에 JSX 로더 등록
  jsx-loader.mjs            Vite의 JSX 변환기를 테스트에서 재사용
  check-build.mjs           배포 결과 검사
  preview.cjs              브라우저 검사용 dist 정적 서버
.github/workflows/
  react-checks.yml          react 브랜치의 테스트와 빌드만 실행
dist/                       자동 생성되는 배포 결과, Git 제외
node_modules/               설치된 라이브러리 내부 코드, Git 제외
```

`src/`가 React UI이고 `js/`는 게임 엔진과 데이터입니다. 폴더를 나눈 기준은 언어가 아니라 역할입니다. React 자체도 JavaScript이며 계산 함수를 JSX로 바꿀 필요는 없습니다.

## 2. 추가·수정·삭제한 파일

추가한 것은 `src/components/`, `src/hooks/`, `src/navigation.js`, `vite.config.js`, 새 테스트 두 개, JSX 테스트 로더, 빌드 검사, CI 워크플로와 이 문서입니다.

주요 수정은 다음과 같습니다.

| 파일 | 변경 내용 |
|---|---|
| `index.html` | 기존 게임·팝업 마크업 대신 React 루트와 모듈 진입점을 사용. 메타데이터와 noscript 콘텐츠 유지 |
| `src/main.jsx` | CSS import와 개발용 Strict Mode 추가 |
| `src/App.jsx` | 단순 프로필 표시에서 전체 앱의 조립·상태 관리로 확장 |
| `js/game.js` | HUD 직접 조작 제거, 데이터 콜백 추가, 이벤트·관찰자·애니메이션 정리 보강 |
| `js/debug.js` | DOM 수정 대신 React에 진단 데이터 전달 |
| `package.json`, 잠금 파일 | 테스트 명령, Node 버전 조건 등 정리 |
| 기존 테스트 | React 렌더 결과와 제어된 입력을 검사하도록 변경 |
| `tools/preview.cjs` | 소스 폴더 대신 빌드된 `dist/` 제공 |
| `README.md`, 이전 설명 문서 | 실행법 갱신, 이전 문서가 원본 버전 설명임을 표시 |

삭제한 파일의 역할은 모두 새 코드로 이전했습니다.

| 삭제한 파일 | 대체 위치 |
|---|---|
| `script.js` | `main.jsx`, `App.jsx`, `useGame.js` |
| `js/templates.js` | `Portfolio.jsx`의 JSX 컴포넌트 |
| `js/quick-view.js` | `QuickView.jsx` |
| `js/panels.js` | `Dialog.jsx`, `InfoPanel.jsx`, `navigation.js` |
| `js/terminal.js` | `Terminal.jsx` |
| `js/mobile-controls.js` | `MobileControls.jsx` |
| `js/resume.js` | `useResume.js`, `Resume` 컴포넌트 |
| `tools/build.cjs` | Vite |
| `assets/app-3c3b1a2c99fb.js` | 빌드 때 생성되는 `dist/assets/`의 파일 |

기존 CSS, 포트폴리오 데이터, 제공된 PDF와 이미지, 물리·카메라·렌더링 알고리즘은 유지했습니다. 별도의 UI 프레임워크나 테스트 프레임워크를 추가로 설치하지 않았습니다.

## 3. 실행 흐름

```text
index.html
  └─ <script type="module" src="/src/main.jsx">
       └─ createRoot(...).render(<App />)
            ├─ GameShell → Canvas, HUD, MobileControls
            ├─ QuickView → 공통 포트폴리오 섹션
            ├─ InfoPanel → 프로젝트 상세 또는 기타 섹션
            ├─ Terminal
            └─ MobileChoice
```

`index.html`은 문서의 제목·메타데이터와 React가 들어갈 `<div id="react-root">`를 제공합니다. `main.jsx`는 이 요소를 찾아 React를 시작합니다. `App.jsx`는 전체 컴포넌트를 배치하고 현재 열린 화면을 관리합니다.

개발 중에는 Vite가 JSX를 JavaScript로 변환합니다. 배포용 빌드는 브라우저가 실행할 JS와 CSS를 `dist/`에 만듭니다. 브라우저가 소스의 JSX를 그대로 실행하는 구조가 아닙니다.

## 4. 주요 컴포넌트

- **App**: 게임, Quick View, 상세 패널, 터미널, 모바일 선택창 중 무엇이 활성 상태인지 관리합니다. 단축키·딥링크·공통 열기와 닫기 동작의 연결점입니다.
- **GameShell**: Canvas를 배치하고 게임 연결 훅을 사용합니다. 게임 루프 자체를 React 컴포넌트 안에 다시 구현하지 않습니다.
- **GameHUD / Tutorial / ZoneBanner**: 엔진이 전달한 현재 구역, 방문 구역, 주변 키오스크, 튜토리얼 축소 여부를 JSX로 표시합니다. 구역 도착 애니메이션은 기존 CSS를 재사용합니다.
- **MobileControls / TouchButton**: 각 손가락의 pointer ID를 입력 시스템에 전달합니다. 버튼을 누르는 동안의 `held` 표시도 상태로 관리합니다.
- **Dialog**: React의 `active` 값과 브라우저의 `showModal()` / `close()`를 연결합니다. Escape와 배경 클릭을 닫기 요청으로 바꿉니다. 실제 네이티브 dialog를 사용하므로 포커스 제한과 모달 기능을 유지합니다.
- **QuickView**: 프로젝트, 경험, 기술, 교육, 수상, 이력서, 연락처를 순서대로 구성합니다. 내부 메뉴는 문서 전체 대신 해당 섹션으로 스크롤합니다.
- **InfoPanel**: 선택한 타입과 프로젝트 ID에 따라 제목과 본문을 고릅니다. Quick View에서 연 패널을 닫으면 Quick View로 돌아갑니다.
- **Portfolio의 공통 컴포넌트**: About, Education, Experience, Skills, Resume, ProjectCards, ProjectDetails 등을 공유합니다. Quick View와 상세 패널에 같은 내용을 중복 구현하지 않습니다.
- **StudyDemo / DetectionDemo**: 슬라이더 값과 탐지 오버레이 표시 여부를 상태로 관리합니다. 기존과 동일하게 설명용 샘플이며 실제 AI 추론이나 카메라 접근은 하지 않습니다.
- **Terminal**: 입력값과 출력 목록을 관리합니다. 기존 명령을 유지하며 출력은 최대 60줄로 제한합니다.

## 5. 데이터 흐름과 props

정보는 아래 방향으로 전달됩니다.

```text
js/data.js → Portfolio 컴포넌트 → 화면
App의 overlay 상태 → 각 화면의 active/type/id props
게임 엔진 → onUI(snapshot) → HUD 상태 → GameHUD props
```

`props`는 부모가 자식에게 전달하는 함수의 인자와 비슷합니다. 예를 들어 다음 코드는 이력서 확인 결과를 자식에게 전달합니다.

```jsx
<Resume available={resumeAvailable} />
```

자식은 부모의 상태를 직접 바꾸는 대신 전달받은 함수를 호출합니다.

```jsx
<button onClick={() => onOpen('project', project.id)}>
  Read project details
</button>
```

이 호출을 받은 App이 `overlay`를 변경하면 InfoPanel이 해당 프로젝트를 보여 줍니다. 프로젝트 상세 안에서 수정한 데모 상태는 그 데모 컴포넌트에만 있으므로, 포트폴리오 전체 상태에 섞이지 않습니다.

## 6. useState, useEffect, useRef

### useState: 화면에 영향을 주는 값

- App: 열린 화면과 선택한 프로젝트
- Terminal: 입력값, 출력 기록
- StudyDemo: 공부 가능 시간
- DetectionDemo: 오버레이 ON/OFF
- TouchButton: 눌린 모습
- useResume: PDF 사용 가능 여부
- useGame: HUD 스냅샷과 진단 화면 정보

```jsx
const [hours, setHours] = useState(3);
```

슬라이더 이벤트에서 `setHours(6)`을 호출하면 React가 `hours`를 사용하는 출력과 계획 시간을 다시 계산하여 표시합니다. 요소를 찾아 `textContent`를 각각 바꿀 필요가 없습니다.

### useEffect: 외부 시스템과 연결하기

- useResume은 PDF의 HEAD 요청을 실행하고, 정리 시 요청과 타이머를 취소합니다.
- App은 주소의 hash 변경을 구독하고 해제합니다.
- Terminal은 출력이 바뀌면 출력 영역을 아래로 스크롤합니다.
- MobileControls는 터치 장치 여부 변경을 구독하고 해제합니다.

화면 크기 측정과 모달 표시처럼 브라우저가 그리기 전에 처리해야 하는 부분에는 `useLayoutEffect`를 사용했습니다. `useGame`의 엔진 초기화·모드 연결과 HUD 측정, Dialog의 표시·포커스 처리가 이에 해당합니다. 일반적인 데이터 가져오기는 `useEffect`로 충분합니다.

### useRef: 화면 요소와 엔진을 보관하기

- `canvasRef`: 실제 `<canvas>` 요소
- `shellRef`: HUD 크기를 측정할 게임 화면 요소
- `engineRef`: 현재 게임·입력·게임 상태 인스턴스
- Dialog의 ref: 실제 `<dialog>` 요소
- Terminal의 output ref: 스크롤할 출력 요소

ref를 바꿔도 React가 자동으로 다시 렌더링하지 않습니다. 따라서 매 프레임 바뀌는 엔진 인스턴스 내부 데이터 보관에 적합합니다. 반대로 화면 글자가 바뀌어야 하는 값은 state로 관리합니다.

## 7. Canvas와 React의 연결

`useGame`은 Canvas가 DOM에 생긴 후 아래 일을 수행합니다.

1. 기존 `createState()`, `Game`, `Input`을 생성합니다.
2. 키오스크를 열 때 App의 콜백을 호출하도록 연결합니다.
3. 구역이나 주변 키오스크가 바뀌면 엔진의 `onUI` 콜백을 통해 HUD 상태를 받습니다.
4. App의 모달 상태를 게임 상태에 반영하여 물리와 애니메이션을 일시 정지·재개합니다.
5. React가 HUD를 갱신한 뒤 실제 크기를 측정하여 Canvas의 글자가 HUD와 겹치지 않도록 합니다.

Canvas는 기존처럼 `requestAnimationFrame`과 120Hz 고정 물리 스텝으로 실행됩니다. 플레이어의 매 프레임 좌표를 React state에 넣지 않습니다. HUD는 구역·키오스크·튜토리얼 상태가 바뀔 때만 갱신하고 디버그 표시도 기존 간격으로 제한합니다.

정리 함수는 `game.destroy()`를 호출합니다. 애니메이션 프레임, Canvas·윈도우·문서 이벤트, 미디어 쿼리 구독, ResizeObserver, 게임 상태 구독과 Input 리스너가 해제됩니다. 개발용 Strict Mode가 초기화와 정리를 반복해도 중복 루프나 중복 입력이 남지 않도록 했습니다.

React 공식 문서에서도 외부 시스템 연결과 정리를 Effect의 역할로 설명합니다: [useEffect](https://react.dev/reference/react/useEffect).

## 8. 원래 JavaScript를 유지한 이유

`player.js`, `physics.js`, `camera.js`, `world.js`, `interactions.js`, `render-*.js`, `palette.js`는 게임 계산 또는 Canvas 그리기를 담당합니다. DOM UI 컴포넌트로 바꾸어 얻는 이점이 적고, 잘 작동하던 알고리즘을 다시 작성하면 물리나 그래픽이 달라질 위험이 있습니다.

`input.js`도 키보드와 여러 pointer ID를 하나의 입력 상태로 만드는 역할을 유지합니다. 실제 모바일 버튼 이벤트의 등록은 React로 옮겼습니다.

`game.js`는 물리·렌더링을 유지하면서 UI 직접 수정만 없앴습니다. `debug.js`도 진단 문자열과 라벨 데이터를 만드는 함수로 남기고 표시 자체는 React가 담당합니다.

## 9. 기존 방식과의 차이

기존에는 HTML 문자열을 만들고 `innerHTML`로 넣은 다음 버튼 이벤트를 붙였습니다. 화면 상태가 바뀔 때마다 특정 요소를 찾아 수정했습니다.

지금은 JSX로 화면을 정의하고 state와 props로 표시 내용을 정합니다. 본문에 `dangerouslySetInnerHTML`을 사용하지 않습니다. React가 데이터의 텍스트를 이스케이프하여 렌더링합니다.

네이티브 dialog 열기, Canvas 크기·그림, 스크롤과 HUD 크기 측정처럼 브라우저 API가 필요한 동작에는 ref와 Effect를 사용합니다. React 사용이 모든 브라우저 API 호출을 없애는 뜻은 아닙니다.

## 10. 실행·검사·유지보수

```sh
npm ci                 # 처음 받거나 의존성이 바뀌었을 때
npm run dev            # 개발 서버
npm run build          # dist 생성
npm run preview        # 빌드 결과 확인
npm test               # 단위·React·엔진 정리 테스트
npm run test:build     # 빌드와 산출물 검사
npm run test:browser   # 빌드 후 실제 Chrome 검사
```

Chrome 자동 탐색이 안 되면 `CHROME_PATH`에 실행 파일 경로를 지정합니다. 이미 실행 중인 개발 서버를 검사하려면 PowerShell에서 아래처럼 실행합니다.

```powershell
$env:BROWSER_BASE_URL = 'http://127.0.0.1:5174'
node tests/browser-check.cjs
Remove-Item Env:BROWSER_BASE_URL
```

일상적인 수정 위치는 다음과 같습니다.

| 바꿀 내용 | 수정 위치 |
|---|---|
| 이름, 자기소개, 프로젝트, 연락처 | `js/data.js` |
| 공통 본문 구성과 프로젝트 카드 | `Portfolio.jsx` |
| 전체 포트폴리오 섹션 순서 | `QuickView.jsx` |
| 상세 패널 내용과 제목 | `InfoPanel.jsx`, `navigation.js` |
| 터미널 명령과 출력 | `Terminal.jsx` |
| 이동·점프 수치 | `js/player.js` |
| 구역·발판·키오스크 위치 | `js/world.js` |
| Canvas 그래픽 | 해당 `js/render-*.js` |
| 색상·크기·배치 | `style.css`, Canvas 색상은 `js/palette.js`도 확인 |

`node_modules/`와 `dist/`는 직접 편집하지 않습니다. `dist/`를 수정해도 다음 빌드에서 덮어씁니다.

GitHub Pages에는 소스 폴더가 아니라 빌드된 `dist/` 내용을 배포해야 합니다. 쿼리·해시 기반 링크를 사용하므로 별도 서버 라우터는 필요 없습니다. 배포를 허용할 때 Pages 설정과 배포 워크플로를 연결하면 됩니다. 현재 추가한 워크플로는 검사만 하며 배포하지 않습니다. [Vite 정적 배포 안내](https://vite.dev/guide/static-deploy.html).

## 11. 검증 결과와 범위

- 단위·React·생명주기 테스트 19개 통과.
- Vite 프로덕션 빌드와 빌드 산출물 검사 통과.
- 개발 서버와 preview 서버의 시작, 시작 페이지·기존 테스트 주소·이력서 PDF의 HTTP 200 응답 확인.
- 프로덕션 및 개발 모드 Chrome 검사에서 이동·점프·달리기·상호작용·중첩 팝업·터미널·데모·모바일 멀티터치·딥링크·모션 감소·Canvas 미지원 대체 화면을 확인.
- 8개 구역에서 HUD와 Canvas 라벨 배치를 검사하고, 데스크톱·모바일·가로 화면을 포함한 10개 화면 조건에서 겹침 검사 통과.
- Quick View와 패널의 검사 대상 텍스트에 대해 기존 WCAG AA 대비 검사 통과.
- 터미널 포커스·최대 60줄·clear, PDF 성공/404 응답, JavaScript 비활성 대체 콘텐츠와 기존 테스트 페이지 주소도 검사.

검사는 로컬 환경과 Chrome의 화면·터치 에뮬레이션에서 수행했습니다. 실제 iPhone/Safari 또는 모든 스크린리더에서 직접 검사한 것은 아닙니다. GitHub Pages 원격 배포는 수행하지 않았으므로 원격 배포 성공까지 확인했다고 볼 수는 없습니다.

포트폴리오 사실 정보와 제공된 자산은 변경하지 않았습니다. 기존에 비어 있던 프로젝트 저장소 URL은 추측해서 추가하지 않았습니다.
