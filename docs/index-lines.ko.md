> Historical pre-React guide. See [the current React architecture](react-architecture.ko.md).

# index.html 한 줄씩 설명

2026-10-08에 읽은 현재 파일 기준입니다. 원본 코드는 수정하지 않았습니다. 코드 칸에서는 앞쪽 들여쓰기를 생략했습니다.

[전체 안내·수정 예제](code-guide.ko.md) · [HTML](index-lines.ko.md) · [CSS](style-lines.ko.md) · [JavaScript](script-lines.ko.md)

HTML은 게임 Canvas와 화면 위 버튼·팝업의 **틀**을 만듭니다. 정상 Quick View 내용은 js/data.js와 js/templates.js에서 생성합니다. 91줄부터의 noscript 본문은 JavaScript가 실행되지 않을 때만 표시됩니다.

**필수 여부**는 웹페이지라면 언제나 꼭 필요하다는 뜻이 아니라, 현재 프로젝트의 기능·배치·접근성을 유지하는 데 필요한 정도입니다. 선택 기능도 연결된 코드가 있으면 한 줄만 삭제할 수 없습니다. 자세한 기준은 전체 안내에 있습니다.

VS Code에서 원본 파일을 열고 **Ctrl+G**로 줄 번호에 이동하세요. 이 설명서는 **Ctrl+Shift+V**로 Markdown 미리보기를 열면 표로 읽을 수 있습니다. 원본을 포맷하거나 줄을 추가하면 번호가 달라집니다.

## 1–18줄: 문서 설정과 CSS·JavaScript 연결

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 1 | <code>&lt;!doctype html&gt;</code> | HTML5 표준 문서라는 선언. 브라우저가 표준 렌더링 모드를 사용하게 한다. | 문구는 그대로 유지. 삭제하면 브라우저가 비표준 호환 모드로 처리할 수 있다. | 표준 권장 |
| 2 | <code>&lt;html lang=&quot;en&quot;&gt;</code> | HTML 문서의 루트와 주 언어(en=영어). | 사이트 본문 전체를 한국어로 바꿀 때 lang을 ko로 바꾼다. 화면 문구 자체를 번역하는 설정은 아니다. | 구조·접근성 |
| 3 | (빈 줄) | 읽기 쉽게 구분하는 빈 줄. | 삭제하거나 추가해도 화면과 기능은 같고 줄 번호만 바뀐다. | 선택(서식) |
| 4 | <code>&lt;head&gt;</code> | 브라우저 설정과 외부 파일 연결을 담는 head 시작. | 이 안에는 화면 본문 대신 메타 정보와 CSS/JS 연결을 넣는다. | 구조 |
| 5 | <code>&lt;meta charset=&quot;UTF-8&quot;&gt;</code> | 문자 인코딩을 UTF-8로 지정. | 한글과 특수문자가 깨질 수 있으므로 UTF-8을 유지한다. | 표준 권장 |
| 6 | <code>&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width,initial-scale=1,viewport-fit=cover&quot;&gt;</code> | 휴대폰의 실제 화면 너비와 초기 확대 비율을 사용. viewport-fit=cover는 화면 가장자리까지 사용. | 삭제하면 모바일이 넓은 가상 화면을 축소해서 보여 반응형 배치가 달라질 수 있다. | 모바일 중요 |
| 7 | <code>&lt;title&gt;Junyoung Oh &#124; Computer Science &amp;amp; Interactive Systems&lt;/title&gt;</code> | 브라우저 탭과 검색 결과에 쓰이는 제목. &amp;amp;는 &amp; 문자. | 이 텍스트를 바꾸면 탭 제목이 바뀐다. 게임 안의 이름은 별도 렌더러에서 수정한다. | 메타 정보 |
| 8 | <code>&lt;meta name=&quot;description&quot;</code> | 검색 결과 설명용 meta 요소를 시작. 속성이 다음 줄로 이어진다. | 8~9줄은 하나의 요소다. 8줄만 삭제하면 남은 속성이 잘못된 본문으로 처리될 수 있다. | 메타 정보 |
| 9 | <code>content=&quot;Portfolio of Junyoung Oh, a Computer Science student at the University of Wisconsin–Madison working across software development, interactive systems, computer vision, and AI.&quot;&gt;</code> | description의 실제 설명 문장과 meta 요소 끝. | 검색엔진에 제공하는 요약이 바뀐다. 화면 본문은 바뀌지 않는다. | 메타 정보 |
| 10 | <code>&lt;meta name=&quot;theme-color&quot; content=&quot;#03060b&quot;&gt;</code> | 지원하는 모바일 브라우저 UI에 제공할 테마 색. | content의 색을 바꾸면 지원 브라우저의 주소창 등 테마 색이 달라질 수 있다. 게임 배경색 설정은 아니다. | 선택 |
| 11 | <code>&lt;meta property=&quot;og:title&quot; content=&quot;Junyoung Oh &#124; Computer Science &amp; Interactive Systems&quot;&gt;</code> | 링크 공유 미리보기에 제공할 제목. | og:title 값을 바꾸면 해당 정보를 사용하는 공유 서비스의 제목이 바뀔 수 있다. | 선택 |
| 12 | <code>&lt;meta property=&quot;og:description&quot;</code> | 링크 공유 설명 메타 요소 시작. 다음 줄과 함께 한 요소. | 12~13줄을 함께 다룬다. | 선택 |
| 13 | <code>content=&quot;Explore Junyoung Oh’s playable portfolio, or read the complete professional portfolio in Quick View.&quot;&gt;</code> | 공유 미리보기의 설명 문구. | 공유 설명을 바꾼다. 게임이나 Quick View 본문에는 영향 없다. | 선택 |
| 14 | <code>&lt;meta property=&quot;og:type&quot; content=&quot;website&quot;&gt;</code> | 공유 미리보기에서 콘텐츠 종류를 일반 웹사이트로 지정. | website를 다른 값으로 바꾸면 공유 서비스에 전달하는 콘텐츠 종류가 달라진다. | 선택 |
| 15 | <code>&lt;link rel=&quot;icon&quot; href=&quot;assets/favicon.svg&quot; type=&quot;image/svg+xml&quot;&gt;</code> | 탭 아이콘으로 assets/favicon.svg를 연결. | 다른 아이콘 경로로 바꾸면 탭 아이콘이 바뀐다. 파일 경로가 틀리면 아이콘이 표시되지 않는다. | 선택 |
| 16 | <code>&lt;link rel=&quot;stylesheet&quot; href=&quot;style.css&quot;&gt;</code> | style.css의 디자인 규칙을 연결. | href를 바꿀 때 파일명도 맞춘다. 제거하면 DOM 화면 디자인과 게임 HUD 배치가 사라진다. | 현재 화면 중요 |
| 17 | <code>&lt;script type=&quot;module&quot; src=&quot;script.js&quot;&gt;&lt;/script&gt;</code> | script.js를 ES 모듈로 실행. 모듈 내부 import와 DOM 준비 후 실행을 지원. | type=module을 없애면 현재 import 구문이 동작하지 않는다. src가 틀리면 게임 초기화가 안 된다. HTTP 서버로 열어야 한다. | 동작 필수 |
| 18 | <code>&lt;/head&gt;</code> | head 설정 영역 종료. | 닫는 태그와 여는 태그의 구조를 맞춘다. | 구조 |

## 19–52줄: 게임 화면과 조작 안내

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 19 | (빈 줄) | 읽기 쉽게 구분하는 빈 줄. | 삭제하거나 추가해도 화면과 기능은 같고 줄 번호만 바뀐다. | 선택(서식) |
| 20 | <code>&lt;body&gt;</code> | 사용자 화면 요소를 담는 body 시작. | 화면 요소는 이 안에 둔다. | 구조 |
| 21 | <code>&lt;button class=&quot;skip&quot; data-quick&gt;Open accessible portfolio&lt;/button&gt;</code> | 키보드 사용자가 게임을 거치지 않고 Quick View로 가는 버튼. data-quick은 JS 연결 표식. | 버튼 문구는 바꿔도 된다. data-quick을 제거하면 이 버튼의 Quick View 연결이 끊긴다. | 접근성 권장 |
| 22 | <code>&lt;main id=&quot;game-shell&quot; aria-label=&quot;Interactive portfolio world&quot;&gt;</code> | 게임 화면의 주요 영역. id=game-shell은 전체 화면 CSS와 no-JS 숨김의 대상. | id를 바꾸려면 CSS와 fallback 참조도 수정한다. aria-label은 보조기술용 설명이다. | 화면 구조 |
| 23 | <code>&lt;canvas id=&quot;world&quot; tabindex=&quot;0&quot;</code> | 실제 게임을 그릴 Canvas. id=world는 Game 생성 시 찾는 ID. tabindex=0은 키보드 포커스 허용. | world를 바꾸면 script.js와 CSS 참조도 바꿔야 한다. 없애면 현재 Game 초기화가 실패한다. Canvas 픽셀 크기는 game.js가 설정한다. | 동작 필수 |
| 24 | <code>aria-label=&quot;Junyoung Oh’s side-scrolling portfolio. A or D to move, Space to jump, E to interact, Q to read the complete portfolio.&quot;&gt;Use</code> | Canvas의 접근성 설명과 대체 문장 시작. 앞줄의 태그 속성으로 이어진다. | 설명만 바꿔도 키 바인딩은 바뀌지 않는다. 실제 조작 키는 js/input.js에서 바꾼다. | 접근성 권장 |
| 25 | <code>Quick View to read the complete portfolio without Canvas.&lt;/canvas&gt;</code> | Canvas를 지원하지 않을 때의 대체 문장 마무리와 Canvas 종료. | Canvas 내부 문구를 바꿔도 Canvas에 그리는 게임 글자는 바뀌지 않는다. | 구조·대체 안내 |
| 26 | <code>&lt;header class=&quot;game-hud&quot;&gt;</code> | 게임 위에 놓이는 HUD 헤더 시작. | game-hud 클래스를 바꾸면 HUD CSS 선택자도 수정한다. | 화면 구조 |
| 27 | <code>&lt;div class=&quot;hud-brand&quot;&gt;&lt;span&gt;JY&lt;span class=&quot;blue&quot;&gt;/&lt;/span&gt;LAB&lt;span class=&quot;status-dot&quot;&gt;&lt;/span&gt;&lt;/span&gt;</code> | JY/LAB 브랜드와 장식 점. blue/status-dot 클래스가 색과 점 모양을 담당. | 문구나 장식은 수정 가능. 이 브랜드는 DOM이라 게임 그림과 별도로 바뀐다. | 선택(디자인) |
| 28 | <code>&lt;p id=&quot;current-area&quot;&gt;SYSTEM START&lt;/p&gt;</code> | 현재 구역 이름을 표시할 자리. game.js가 current-area의 내용을 갱신. | SYSTEM START는 초기 문구만 바꾼다. ID를 삭제하면 Game의 구역 갱신 코드가 실패한다. | 현재 연결 필수 |
| 29 | <code>&lt;/div&gt;</code> | 앞에서 연 div 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |
| 30 | <code>&lt;nav id=&quot;zone-progress&quot; aria-label=&quot;World area progress&quot;&gt;&lt;/nav&gt;&lt;button class=&quot;button quick-control&quot;</code> | 구역 진행 표시를 넣는 nav와 Quick View 버튼 시작. | zone-progress의 항목은 game.js가 채운다. ID 변경은 game.js/CSS도 수정해야 한다. | 현재 연결 필수 |
| 31 | <code>data-quick&gt;Quick View &lt;kbd&gt;Q&lt;/kbd&gt;&lt;/button&gt;</code> | Quick View 버튼의 data-quick 표식과 Q 키 안내. | Quick View라는 문구는 바꿀 수 있다. Q 표시만 바꿔도 실제 단축키는 바뀌지 않는다. | 기능 중요 |
| 32 | <code>&lt;/header&gt;</code> | 앞에서 연 header 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |
| 33 | <code>&lt;div id=&quot;tutorial&quot;&gt;</code> | 초기 조작 안내의 컨테이너. | game.js가 tutorial에 minimized 클래스를 붙여 숨긴다. ID 제거는 해당 코드도 함께 수정해야 한다. | 현재 연결 필수 |
| 34 | <code>&lt;p class=&quot;eyebrow&quot;&gt;JUNYOUNG OH / INTERACTIVE PORTFOLIO&lt;/p&gt;</code> | 튜토리얼 위의 작은 브랜드 안내 문구. | 표시 문구만 달라진다. eyebrow는 작은 시스템 라벨 스타일이다. | 선택(문구) |
| 35 | <code>&lt;p class=&quot;tutorial-desktop&quot;&gt;&lt;kbd&gt;A&lt;/kbd&gt;&lt;kbd&gt;D&lt;/kbd&gt; Move &lt;span&gt;·&lt;/span&gt; &lt;kbd&gt;Space&lt;/kbd&gt; Jump &lt;span&gt;·&lt;/span&gt;</code> | 데스크톱 이동·점프 키 안내 첫 부분. kbd는 키보드 키처럼 보이는 마크업. | 안내 문구만 수정된다. 실제 조작은 js/input.js에서 설정한다. | 안내 |
| 36 | <code>&lt;kbd&gt;E&lt;/kbd&gt; Open&lt;/p&gt;</code> | E 키 안내와 데스크톱 안내 문단 종료. | E 표시만 바꾸면 안내와 실제 키가 불일치할 수 있다. | 안내 |
| 37 | <code>&lt;p class=&quot;tutorial-touch&quot;&gt;Move, jump, and open with the controls below.&lt;/p&gt;</code> | 터치 장치용 조작 안내. CSS의 touch-device 조건에서 표시. | 문구 변경은 터치 조작 설명만 바꾼다. 버튼 동작은 mobile-controls.js가 담당한다. | 모바일 안내 |
| 38 | <code>&lt;p class=&quot;muted&quot;&gt;Jump into a labeled block, press E nearby, or click it. Read everything in Quick View.&lt;/p&gt;</code> | 블록 클릭/점프/E와 Quick View 사용 안내. | 이 문구만 바꾸면 게임 규칙은 바뀌지 않는다. | 안내 |
| 39 | <code>&lt;/div&gt;</code> | 앞에서 연 div 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |
| 40 | <code>&lt;p id=&quot;zone-banner&quot; aria-live=&quot;polite&quot;&gt;&lt;/p&gt;</code> | 구역 진입 안내 문구를 넣는 빈 요소. aria-live=polite는 내용을 바꿀 때 보조기술에 알림. | zone-banner ID는 game.js와 연결. 글자는 초기에는 비어 있고 구역 진입 때 채워진다. | 현재 연결 필수·접근성 |
| 41 | <code>&lt;button id=&quot;interaction-prompt&quot; hidden&gt;&lt;span id=&quot;interaction-name&quot;&gt;&lt;/span&gt;&lt;small</code> | 근처 블록을 여는 버튼과 이름 표시 자리. hidden으로 처음에는 숨김. | hidden을 지우면 시작부터 빈 프롬프트가 보일 수 있다. ID들은 Game이 찾아 갱신하므로 연결을 유지한다. | 현재 연결 필수 |
| 42 | <code>id=&quot;interaction-detail&quot;&gt;&lt;/small&gt;&lt;span class=&quot;prompt-desktop&quot;&gt;&lt;kbd&gt;E&lt;/kbd&gt; OPEN &lt;span&gt; / &lt;/span&gt; JUMP TO</code> | 블록 설명 자리와 데스크톱용 E/점프 안내. | interaction-detail은 JS가 채운다. 키 안내를 바꿔도 상호작용 키는 바뀌지 않는다. | 현재 연결 필수 |
| 43 | <code>ACCESS&lt;/span&gt;&lt;span class=&quot;prompt-touch&quot;&gt;TAP TO OPEN&lt;/span&gt;&lt;/button&gt;</code> | 데스크톱 안내를 끝내고 터치용 TAP TO OPEN 안내를 추가. | 프롬프트 클릭은 script.js에서 연결된다. 이 문구는 버튼의 안내만 바꾼다. | 기능 안내 |
| 44 | <code>&lt;div id=&quot;mobile-controls&quot; aria-label=&quot;Touch game controls&quot;&gt;</code> | 터치 이동 버튼들을 감싸는 영역. | mobile-controls ID는 CSS가 터치 장치에서 보이게 한다. 입력 처리 코드는 내부 표식을 사용한다. | 모바일 기능 |
| 45 | <code>&lt;div&gt;&lt;button data-touch=&quot;left&quot; aria-label=&quot;Move left&quot;&gt;←&lt;/button&gt;&lt;button data-touch=&quot;right&quot;</code> | 왼쪽 이동 버튼과 오른쪽 이동 버튼 시작. data-touch가 실제 입력 구분 값. | 화살표 문구는 바꿔도 된다. left/right 값을 바꾸면 input.js가 인식하는 값도 맞춰야 한다. | 모바일 동작 필수 |
| 46 | <code>aria-label=&quot;Move right&quot;&gt;→&lt;/button&gt;&lt;/div&gt;</code> | 오른쪽 이동 버튼의 접근성 이름과 버튼 마무리. | aria-label을 바꾸면 보조기술 안내가 달라진다. 화살표 자체는 조작 로직이 아니다. | 모바일 기능·접근성 |
| 47 | <code>&lt;div&gt;&lt;button data-touch=&quot;jump&quot; aria-label=&quot;Jump&quot;&gt;Jump&lt;/button&gt;&lt;button id=&quot;touch-open&quot; disabled&gt;Open&lt;/button&gt;&lt;/div&gt;</code> | 점프 버튼과 열기 버튼. data-touch=jump는 점프 입력, touch-open은 근접 상호작용. | disabled는 처음에는 열기 불가라는 실제 버튼 상태다. Game이 가까운 대상이 있을 때 해제한다. ID 삭제는 관련 초기화도 수정해야 한다. | 모바일 동작 필수 |
| 48 | <code>&lt;/div&gt;</code> | 앞에서 연 div 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |
| 49 | <code>&lt;div class=&quot;world-footer&quot;&gt;&lt;span&gt;ORIGINAL CANVAS WORLD / NO CAMERA ACCESS&lt;/span&gt;&lt;span&gt;JUNYOUNG LAB · MADISON,</code> | 게임 하단의 장식/안내 문구 시작. | 이 문구는 실제 카메라 권한을 제어하지 않는다. 현재 구현은 카메라 API를 사용하지 않는다. | 선택(문구) |
| 50 | <code>WI&lt;/span&gt;&lt;/div&gt;</code> | 하단 위치 안내 마무리. | WI 문구를 바꿔도 프로필 데이터의 location은 그대로다. | 선택(문구) |
| 51 | <code>&lt;pre id=&quot;debug-panel&quot; hidden aria-label=&quot;Live game diagnostics&quot;&gt;&lt;/pre&gt;</code> | F2 개발 진단 출력을 넣는 pre. 공백과 줄바꿈을 보존하며 처음에는 숨김. | 진단은 선택 기능이지만 현재 debug.js가 이 ID를 사용한다. 요소만 삭제하면 F2 사용 시 실패할 수 있다. | 선택 기능·연결 유지 |
| 52 | <code>&lt;/main&gt;</code> | 앞에서 연 main 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |

## 53–61줄: Quick View 팝업

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 53 | <code>&lt;dialog id=&quot;quick-view&quot; class=&quot;quick-view&quot; aria-labelledby=&quot;quick-title&quot;&gt;</code> | 전체 포트폴리오 Quick View용 네이티브 dialog. 제목 ID를 접근성 이름으로 참조. | quick-view ID와 quick-view.js/panels.js/CSS 연결을 함께 유지한다. 내용은 JS가 나중에 채운다. | 동작 필수 |
| 54 | <code>&lt;header class=&quot;quick-header&quot;&gt;&lt;a class=&quot;brand&quot; href=&quot;#quick-main&quot;&gt;Junyoung Oh&lt;span&gt;.&lt;/span&gt;&lt;/a&gt;</code> | Quick View 헤더의 이름 링크. #quick-main은 포트폴리오 상단으로 이동하는 대상. | 브랜드 문구 변경은 헤더만 바꾼다. 큰 이름 제목은 data.js의 profile.name이 만든다. | 화면·탐색 |
| 55 | <code>&lt;nav aria-label=&quot;Portfolio navigation&quot;&gt;&lt;a href=&quot;#quick-projects&quot;&gt;Work&lt;/a&gt;&lt;a</code> | Quick View의 프로젝트 이동 링크와 다음 링크 시작. | href의 대상은 quick-view.js가 생성하는 section ID와 맞아야 한다. | 탐색 기능 |
| 56 | <code>href=&quot;#quick-experience&quot;&gt;Experience&lt;/a&gt;&lt;a href=&quot;#quick-skills&quot;&gt;Skills&lt;/a&gt;&lt;a href=&quot;#quick-resume&quot;&gt;Resume&lt;/a&gt;&lt;a</code> | Experience/Skills/Resume 내부 이동 링크. | 버튼 이름은 바꿔도 되지만 목적지 ID는 실제 section과 맞춰야 한다. | 탐색 기능 |
| 57 | <code>href=&quot;#quick-contact&quot;&gt;Contact&lt;/a&gt;&lt;/nav&gt;&lt;button class=&quot;button return-button&quot; data-close&gt;Return to game</code> | Contact 링크와 Return to game 버튼 시작. data-close가 dialog 닫기를 연결. | data-close를 삭제하면 클릭으로 닫히는 연결이 사라진다. 네이티브 Escape 닫기는 별도다. | 탐색·닫기 기능 |
| 58 | <code>&lt;span&gt;×&lt;/span&gt;&lt;/button&gt;</code> | 닫기 버튼의 × 장식과 종료. | ×를 다른 글자로 바꿔도 data-close가 유지되면 닫기 기능은 같다. | 선택(문구) |
| 59 | <code>&lt;/header&gt;</code> | 앞에서 연 header 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |
| 60 | <code>&lt;div id=&quot;quick-content&quot;&gt;&lt;!-- Semantic content is generated from js/data.js by js/quick-view.js. --&gt;&lt;/div&gt;</code> | Quick View의 실제 포트폴리오를 넣는 빈 컨테이너. 주석은 생성 위치 설명. | quick-content ID를 바꾸면 quick-view.js도 수정해야 한다. 이 안은 초기화할 때 innerHTML로 채워진다. | 동작 필수 |
| 61 | <code>&lt;/dialog&gt;</code> | 앞에서 연 dialog 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |

## 62–72줄: 상세 정보 팝업

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 62 | <code>&lt;dialog id=&quot;info-panel&quot; class=&quot;info-panel&quot; aria-labelledby=&quot;panel-title&quot;&gt;</code> | 프로젝트/About/Skills 등의 상세 정보를 보여 주는 dialog. | info-panel ID는 panels.js가 찾는다. aria-labelledby는 panel-title과 연결한다. | 동작 필수 |
| 63 | <code>&lt;div class=&quot;dialog-toolbar&quot;&gt;</code> | 상세 패널의 고정 상단 도구 모음 컨테이너. | CSS의 dialog-toolbar를 바꾸면 모양과 sticky 헤더 배치가 달라진다. | 화면 구조 |
| 64 | <code>&lt;p id=&quot;panel-label&quot; class=&quot;eyebrow&quot;&gt;INFORMATION MODULE&lt;/p&gt;</code> | 상세 패널의 모듈/종류 라벨 자리. | 초기 INFORMATION MODULE은 열리는 패널에 따라 JS가 교체한다. ID를 삭제하면 패널 열기 코드가 실패한다. | 현재 연결 필수 |
| 65 | <code>&lt;div class=&quot;panel-tools&quot;&gt;&lt;button class=&quot;text-button&quot; data-quick&gt;Quick View&lt;/button&gt;&lt;button class=&quot;button&quot;</code> | 패널 상단 Quick View 버튼과 닫기 버튼 시작. | data-quick이 Quick View를 열고 data-close가 이 dialog를 닫는다. 클래스는 디자인이다. | 화면 조작 |
| 66 | <code>data-close aria-label=&quot;Close information panel&quot;&gt;Close ×&lt;/button&gt;&lt;/div&gt;</code> | 패널 닫기 버튼의 연결 표식과 접근성 이름. | data-close는 기능, aria-label은 보조기술 설명, Close ×는 보이는 글자다. | 닫기 기능·접근성 |
| 67 | <code>&lt;/div&gt;</code> | 앞에서 연 div 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |
| 68 | <code>&lt;div class=&quot;panel-body&quot;&gt;</code> | 상세 제목과 본문을 묶는 컨테이너. | panel-body 클래스의 CSS를 바꾸면 여백과 글자 크기가 바뀐다. | 화면 구조 |
| 69 | <code>&lt;h2 id=&quot;panel-title&quot; tabindex=&quot;-1&quot;&gt;&lt;/h2&gt;</code> | 상세 패널 제목 자리. tabindex=-1은 JS가 제목으로 포커스를 옮기게 한다. | panel-title ID를 유지한다. -1은 일반 Tab 순서에는 넣지 않되 코드로 focus 가능하다는 뜻이다. | 현재 연결 필수·접근성 |
| 70 | <code>&lt;div id=&quot;panel-content&quot;&gt;&lt;/div&gt;</code> | 프로젝트 등의 상세 HTML을 넣을 컨테이너. | panel-content ID를 바꾸면 panels.js의 조회도 바꿔야 한다. 본문 데이터는 data.js와 templates.js를 수정한다. | 동작 필수 |
| 71 | <code>&lt;/div&gt;</code> | 앞에서 연 div 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |
| 72 | <code>&lt;/dialog&gt;</code> | 앞에서 연 dialog 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |

## 73–83줄: 터미널 팝업

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 73 | <code>&lt;dialog id=&quot;terminal-dialog&quot; class=&quot;terminal-dialog&quot; aria-labelledby=&quot;terminal-title&quot;&gt;</code> | 선택형 터미널 dialog. | 터미널을 없애려면 terminal.js 초기화, Game의 terminal 분기와 입력 분기도 함께 정리해야 한다. 태그만 삭제하면 안 된다. | 선택 기능·연결 유지 |
| 74 | <code>&lt;div class=&quot;dialog-toolbar&quot;&gt;</code> | 터미널 상단 제목/닫기 컨테이너. | dialog-toolbar CSS로 모양을 바꿀 수 있다. | 선택 기능 |
| 75 | <code>&lt;h2 id=&quot;terminal-title&quot; class=&quot;eyebrow&quot;&gt;JUNYOUNG@PORTFOLIO:~&lt;/h2&gt;&lt;button class=&quot;button&quot; data-close</code> | 터미널 제목과 닫기 버튼 시작. | JUNYOUNG@PORTFOLIO:~는 화면 라벨이다. 실제 OS 계정이나 셸을 실행하지 않는다. | 선택 기능·문구 |
| 76 | <code>aria-label=&quot;Close terminal&quot;&gt;Close ×&lt;/button&gt;</code> | 터미널 닫기 표식/접근성 설명. | data-close는 클릭 닫기를 연결한다. | 선택 기능·접근성 |
| 77 | <code>&lt;/div&gt;</code> | 앞에서 연 div 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |
| 78 | <code>&lt;div id=&quot;terminal-output&quot; role=&quot;log&quot; aria-live=&quot;polite&quot;&gt;</code> | 터미널 출력 영역. role=log와 aria-live로 새 출력을 보조기술에 알림. | terminal-output ID는 terminal.js가 사용한다. role/aria-live는 실행 자체보다 접근성을 담당한다. | 선택 기능·연결 유지 |
| 79 | <code>&lt;p&gt;Portfolio console. Type help for commands.&lt;/p&gt;</code> | 최초 터미널 사용 안내. | 문구만 바뀐다. 지원 명령어는 terminal.js에 있다. | 선택(문구) |
| 80 | <code>&lt;/div&gt;</code> | 앞에서 연 div 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |
| 81 | <code>&lt;form id=&quot;terminal-form&quot;&gt;&lt;label for=&quot;terminal-input&quot;&gt;jy:~$&lt;/label&gt;&lt;input id=&quot;terminal-input&quot; autocomplete=&quot;off&quot;</code> | 명령 입력 form/label/input 시작. label for와 input id가 연결된다. | terminal-form/terminal-input ID는 JS와 연결. autocomplete=off는 입력 자동완성 동작에 대한 요청이다. | 선택 기능·연결 유지 |
| 82 | <code>spellcheck=&quot;false&quot; aria-label=&quot;Terminal command&quot;&gt;&lt;/form&gt;</code> | 입력 spellcheck를 끄고 보조기술용 이름을 지정한 뒤 form 종료. | false를 true로 바꾸면 지원 브라우저에서 철자 검사 표시가 생길 수 있다. 명령 실행 로직과는 별개다. | 선택 기능·접근성 |
| 83 | <code>&lt;/dialog&gt;</code> | 앞에서 연 dialog 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |

## 84–90줄: 모바일 첫 선택

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 84 | <code>&lt;dialog id=&quot;mobile-choice&quot; class=&quot;mobile-choice&quot; aria-labelledby=&quot;choice-title&quot;&gt;</code> | 모바일 첫 진입에서 세계/Quick View를 고르는 dialog. | mobile-choice ID는 모바일 초기화가 사용한다. 모바일 기능을 유지하려면 현재 연결을 맞춘다. | 모바일 기능·연결 유지 |
| 85 | <code>&lt;p class=&quot;eyebrow&quot;&gt;JUNYOUNG LAB&lt;/p&gt;</code> | 모바일 선택 화면 브랜드 라벨. | 문구 변경만 가능하며 게임 설정에는 영향 없다. | 선택(문구) |
| 86 | <code>&lt;h2 id=&quot;choice-title&quot;&gt;Choose your&lt;br&gt;way in.&lt;/h2&gt;</code> | 선택 화면의 제목. br은 줄바꿈. | Choose your와 way in.을 바꾸면 이 화면 제목만 바뀐다. choice-title은 dialog 접근성 이름과 연결한다. | 문구·접근성 |
| 87 | <code>&lt;p&gt;Explore a playable digital world, or read the full professional portfolio.&lt;/p&gt;</code> | 두 모드의 차이를 설명하는 문장. | 안내 문구만 달라진다. | 안내 |
| 88 | <code>&lt;div class=&quot;actions&quot;&gt;&lt;button id=&quot;explore-choice&quot; class=&quot;button primary&quot;&gt;Explore world →&lt;/button&gt;&lt;button</code> | Explore world 버튼과 Quick View 버튼 시작. | explore-choice는 선택 창을 닫아 게임을 시작한다. ID 변경은 mobile-controls.js도 함께 수정한다. | 모바일 동작 필수 |
| 89 | <code>id=&quot;quick-choice&quot; class=&quot;button&quot;&gt;Quick View ↗&lt;/button&gt;&lt;/div&gt;</code> | 모바일 Quick View 선택 버튼과 컨테이너 종료. | quick-choice ID는 mobile-controls.js가 클릭 이벤트를 연결한다. | 모바일 동작 필수 |
| 90 | <code>&lt;/dialog&gt;</code> | 앞에서 연 dialog 요소를 닫아 내부 범위를 끝낸다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 현재 HTML 구조 |

## 91–102줄: JavaScript 미사용 화면 설정

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 91 | <code>&lt;noscript&gt;</code> | JavaScript가 실행되지 않을 때 표시할 대체 콘텐츠 시작. | 평소 JS가 켜진 게임 화면에는 이 아래 콘텐츠가 표시되지 않는다. 삭제하면 no-JS 방문자용 포트폴리오가 사라진다. | 대체 콘텐츠 권장 |
| 92 | <code>&lt;style&gt;</code> | no-JS 상황에만 적용하는 짧은 CSS 시작. | JS가 실행될 때 일반 style.css 대신 적용하는 설정이 아니다. | 대체 화면 |
| 93 | <code>#game-shell,</code> | no-JS에서 숨길 게임 메인 영역 선택자 첫 줄. | 이 목록에서 game-shell을 빼면 실행되지 않는 게임 틀이 fallback과 함께 남을 수 있다. | 대체 화면 |
| 94 | <code>.skip,</code> | no-JS에서 숨길 skip 버튼도 선택. | JS 없이 data-quick 클릭이 동작하지 않으므로 버튼을 감춘다. | 대체 화면 |
| 95 | <code>#quick-view {</code> | no-JS에서 숨길 JS 기반 Quick View를 선택하고 규칙 시작. | 93~95줄의 쉼표는 각 대상을 모두 같은 규칙으로 선택한다. | 대체 화면 |
| 96 | <code>display: none</code> | JS 없는 경우 게임/버튼/Quick View를 화면에서 숨김. | none을 block으로 바꾸면 작동하지 않는 UI가 보일 수 있다. | 대체 화면 |
| 97 | <code>}</code> | noscript 안의 CSS 규칙을 닫는다. | 이 중괄호를 지우면 JavaScript 미사용 화면의 숨김·스크롤 규칙이 잘못 해석될 수 있다. | 해당 CSS 문법 |
| 98 | (빈 줄) | 읽기 쉽게 구분하는 빈 줄. | 삭제하거나 추가해도 화면과 기능은 같고 줄 번호만 바뀐다. | 선택(서식) |
| 99 | <code>body {</code> | no-JS 화면에서는 body의 스크롤 설정을 바꾸는 규칙. | body는 전체 문서 영역이다. | 대체 화면 |
| 100 | <code>overflow: auto</code> | no-JS 포트폴리오에서 세로 스크롤 허용. | hidden으로 바꾸면 긴 대체 포트폴리오를 아래까지 읽기 어려워진다. | 대체 화면 중요 |
| 101 | <code>}</code> | noscript 안의 CSS 규칙을 닫는다. | 이 중괄호를 지우면 JavaScript 미사용 화면의 숨김·스크롤 규칙이 잘못 해석될 수 있다. | 해당 CSS 문법 |
| 102 | <code>&lt;/style&gt;</code> | no-JS 전용 CSS 종료. | 열었던 style 태그와 짝을 유지한다. | 구조 |

## 103–178줄: JavaScript 미사용 대체 포트폴리오와 문서 끝

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 103 | <code>&lt;main class=&quot;portfolio fallback&quot;&gt;</code> | no-JS용 전통 포트폴리오 메인 컨테이너. | portfolio는 공통 여백 스타일, fallback은 위쪽 여백 추가다. | 대체 화면 |
| 104 | <code>&lt;h1&gt;Junyoung Oh&lt;/h1&gt;</code> | JS 없는 포트폴리오의 이름 제목. | 이 이름만 바꾸면 no-JS 화면만 바뀐다. 실제 Quick View 이름은 data.js를 수정한다. | 대체 콘텐츠 |
| 105 | <code>&lt;p&gt;Computer Science Student · University of Wisconsin–Madison&lt;/p&gt;</code> | no-JS 역할/학교 문구. | 이 대체 화면 문구만 바뀐다. data.js와 사실이 일치하도록 유지한다. | 대체 콘텐츠 |
| 106 | <code>&lt;p&gt;Computer Science · Interactive Systems · AI&lt;/p&gt;</code> | no-JS 관심 분야 한 줄. | 이 대체 문구만 달라진다. | 대체 콘텐츠 |
| 107 | <code>&lt;p&gt;I build software people can experience.&lt;/p&gt;</code> | no-JS 슬로건 한 줄. | JS 기반 슬로건은 data.js의 profile.tagline에서 수정한다. | 대체 콘텐츠 |
| 108 | <code>&lt;section&gt;</code> | JavaScript 미사용 대체 본문의 주제별 section을 시작한다. | 안의 제목·문단을 바꾸면 JavaScript를 사용하지 않을 때 보이는 그 섹션이 달라진다. 정상 Quick View 내용은 data.js에서 별도로 만든다. | 대체 콘텐츠 구조 |
| 109 | <code>&lt;h2&gt;About&lt;/h2&gt;</code> | no-JS About 구역 제목. | 대체 화면의 제목만 바뀐다. | 대체 콘텐츠 |
| 110 | <code>&lt;p&gt;A freshman and Bachelor of Science student intending to major in Computer Science, interested in software</code> | no-JS 자기소개 문장의 시작. | 이 문단은 110~112줄에 걸친 한 문단이다. 실제 소개와 사실을 맞춘다. | 대체 콘텐츠 |
| 111 | <code>engineering, interactive systems, game technology, applied AI, computer vision, and human-centered software.</code> | 앞줄의 자기소개 문장 이어짐. | 줄바꿈은 일반 HTML에서 대부분 공백으로 합쳐진다. 새 문단은 별도 p 태그를 사용한다. | 대체 콘텐츠 |
| 112 | <code>&lt;/p&gt;</code> | 앞에서 연 p 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 113 | <code>&lt;p&gt;Madison, Wisconsin · CS 300 — Programming II (Java) · LIKELION Wisconsin — Member&lt;/p&gt;</code> | no-JS 위치/수업/동아리 정보. | Quick View 데이터는 data.js와 별도로 맞춰야 한다. | 대체 콘텐츠 |
| 114 | <code>&lt;/section&gt;</code> | 앞에서 연 section 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 115 | <code>&lt;section&gt;</code> | JavaScript 미사용 대체 본문의 주제별 section을 시작한다. | 안의 제목·문단을 바꾸면 JavaScript를 사용하지 않을 때 보이는 그 섹션이 달라진다. 정상 Quick View 내용은 data.js에서 별도로 만든다. | 대체 콘텐츠 구조 |
| 116 | <code>&lt;h2&gt;Projects&lt;/h2&gt;</code> | no-JS 프로젝트 구역 제목. | 표시 제목만 달라진다. | 대체 콘텐츠 |
| 117 | <code>&lt;article&gt;</code> | JavaScript 미사용 대체 본문의 프로젝트 한 항목을 시작한다. | 닫는 article까지 함께 제거하면 대체 화면에서 그 프로젝트가 빠진다. 정상 프로젝트 데이터는 data.js에서 관리한다. | 대체 콘텐츠 구조 |
| 118 | <code>&lt;h3&gt;MorrowLab&lt;/h3&gt;</code> | no-JS MorrowLab 제목. | 실제 Quick View/패널 프로젝트 이름은 data.js에서 수정한다. | 대체 콘텐츠 |
| 119 | <code>&lt;p&gt;Core Developer · Badger BuildFest · UW–Madison · September 26–27, 2026&lt;/p&gt;</code> | no-JS MorrowLab 역할과 행사 날짜/학교. | 제공한 사실에 맞게 수정한다. 게임 진행 날짜가 아니다. | 대체 콘텐츠 |
| 120 | <code>&lt;p&gt;A React/TypeScript study application combining activity tracking and self-evaluation to support next-day</code> | no-JS MorrowLab 설명 문단 시작. | 120~122줄은 하나의 설명 문단이다. | 대체 콘텐츠 |
| 121 | <code>study schedules. Integrated MediaPipe-based object detection and face tracking with on-device camera</code> | MorrowLab의 MediaPipe/얼굴 추적 설명 이어짐. | 설명 문구 변경만 된다. 이 코드가 실제 카메라 처리를 실행하지 않는다. | 대체 콘텐츠 |
| 122 | <code>processing to identify phone use and time away.&lt;/p&gt;</code> | on-device 처리와 관찰 대상 설명, 문단 끝. | 실제 모델 동작 설정이 아니라 프로젝트 소개 문장이다. | 대체 콘텐츠 |
| 123 | <code>&lt;/article&gt;</code> | 앞에서 연 article 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 124 | <code>&lt;article&gt;</code> | JavaScript 미사용 대체 본문의 프로젝트 한 항목을 시작한다. | 닫는 article까지 함께 제거하면 대체 화면에서 그 프로젝트가 빠진다. 정상 프로젝트 데이터는 data.js에서 관리한다. | 대체 콘텐츠 구조 |
| 125 | <code>&lt;h3&gt;Student Morning Information Dashboard&lt;/h3&gt;</code> | no-JS Morning Dashboard 프로젝트 제목. | 대체 화면 제목만 달라진다. | 대체 콘텐츠 |
| 126 | <code>&lt;p&gt;SOURCE Programming Club · Jamsil High School&lt;/p&gt;</code> | Morning Dashboard의 동아리/학교 정보. | 실제 이력과 같은 내용으로 유지한다. | 대체 콘텐츠 |
| 127 | <code>&lt;p&gt;Weather and stock API integrations, HTML/CSS and JavaScript contributions, reusable modules, GitHub</code> | Dashboard 작업 설명 시작. | API를 호출하는 코드가 아니라 프로젝트 소개 문장이다. | 대체 콘텐츠 |
| 128 | <code>collaboration, and peer code reviews.&lt;/p&gt;</code> | Dashboard 설명 마무리. | 소개 문구만 달라진다. | 대체 콘텐츠 |
| 129 | <code>&lt;/article&gt;</code> | 앞에서 연 article 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 130 | <code>&lt;article&gt;</code> | JavaScript 미사용 대체 본문의 프로젝트 한 항목을 시작한다. | 닫는 article까지 함께 제거하면 대체 화면에서 그 프로젝트가 빠진다. 정상 프로젝트 데이터는 data.js에서 관리한다. | 대체 콘텐츠 구조 |
| 131 | <code>&lt;h3&gt;Cybersecurity Learning Game&lt;/h3&gt;</code> | no-JS Cybersecurity Learning Game 제목. | 대체 화면 제목만 달라진다. | 대체 콘텐츠 |
| 132 | <code>&lt;p&gt;Seoul Women’s University · Information Security Gifted Program&lt;/p&gt;</code> | 해당 게임의 교육 프로그램 맥락. | 실제 이력과 같은 내용으로 유지한다. | 대체 콘텐츠 |
| 133 | <code>&lt;p&gt;A Python learning game introducing cybersecurity concepts through interactive questions.&lt;/p&gt;</code> | Python 보안 개념 학습 게임 설명. | 이 HTML이 Python 프로그램을 실행하는 것은 아니다. | 대체 콘텐츠 |
| 134 | <code>&lt;/article&gt;</code> | 앞에서 연 article 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 135 | <code>&lt;article&gt;</code> | JavaScript 미사용 대체 본문의 프로젝트 한 항목을 시작한다. | 닫는 article까지 함께 제거하면 대체 화면에서 그 프로젝트가 빠진다. 정상 프로젝트 데이터는 data.js에서 관리한다. | 대체 콘텐츠 구조 |
| 136 | <code>&lt;h3&gt;Object Detection Prototype&lt;/h3&gt;</code> | no-JS Object Detection Prototype 제목. | 대체 화면 제목만 달라진다. | 대체 콘텐츠 |
| 137 | <code>&lt;p&gt;The Academies by Harvard Student Agencies&lt;/p&gt;</code> | Object Detection의 프로그램 맥락. | 실제 이력과 같은 내용으로 유지한다. | 대체 콘텐츠 |
| 138 | <code>&lt;p&gt;YOLO object detection in Python and exploration of machine learning models with NumPy and PyTorch.&lt;/p&gt;</code> | YOLO/Python/NumPy/PyTorch 프로젝트 설명. | 이 문장은 실제 YOLO 추론을 실행하지 않는다. | 대체 콘텐츠 |
| 139 | <code>&lt;/article&gt;</code> | 앞에서 연 article 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 140 | <code>&lt;/section&gt;</code> | 앞에서 연 section 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 141 | <code>&lt;section&gt;</code> | JavaScript 미사용 대체 본문의 주제별 section을 시작한다. | 안의 제목·문단을 바꾸면 JavaScript를 사용하지 않을 때 보이는 그 섹션이 달라진다. 정상 Quick View 내용은 data.js에서 별도로 만든다. | 대체 콘텐츠 구조 |
| 142 | <code>&lt;h2&gt;Experience&lt;/h2&gt;</code> | no-JS Experience 구역 제목. | 대체 화면 제목만 달라진다. | 대체 콘텐츠 |
| 143 | <code>&lt;h3&gt;FIRST Robotics — TechnoKats&lt;/h3&gt;</code> | no-JS 로보틱스 경험 제목. | 본문과 실제 데이터의 사실을 맞춘다. | 대체 콘텐츠 |
| 144 | <code>&lt;p&gt;Mechanical and Software Member · Kokomo High School · 2024–2026. Contributed CAD drivetrain designs and Java</code> | 로보틱스 역할/학교/연도/기여 문장 시작. | 144~145줄은 한 문단이다. | 대체 콘텐츠 |
| 145 | <code>robot control code.&lt;/p&gt;</code> | Java 로봇 제어 기여 설명과 문단 끝. | 설명 문구만 바뀐다. | 대체 콘텐츠 |
| 146 | <code>&lt;h3&gt;Student Council&lt;/h3&gt;</code> | no-JS 학생회 경험 제목. | 제목 문구만 바뀐다. | 대체 콘텐츠 |
| 147 | <code>&lt;p&gt;Publicity and Club Affairs · Jamsil High School / Pungsung Middle School · 2022–2024. Coordinated event</code> | 학생회 역할/학교/연도 소개 시작. | 147~149줄은 하나의 문단이다. | 대체 콘텐츠 |
| 148 | <code>publicity and scheduling, centralized contacts for more than 30 clubs, and developed and operated a</code> | 행사 조율과 동아리 연락처 정리 설명 이어짐. | 30곳 이상의 동아리는 제공된 이력 설명이다. 게임 측정값이 아니다. | 대체 콘텐츠 |
| 149 | <code>student-run vending machine project.&lt;/p&gt;</code> | 학생 운영 자판기 프로젝트 설명과 문단 끝. | 실제 이력과 같은 내용으로 유지한다. | 대체 콘텐츠 |
| 150 | <code>&lt;/section&gt;</code> | 앞에서 연 section 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 151 | <code>&lt;section&gt;</code> | JavaScript 미사용 대체 본문의 주제별 section을 시작한다. | 안의 제목·문단을 바꾸면 JavaScript를 사용하지 않을 때 보이는 그 섹션이 달라진다. 정상 Quick View 내용은 data.js에서 별도로 만든다. | 대체 콘텐츠 구조 |
| 152 | <code>&lt;h2&gt;Skills&lt;/h2&gt;</code> | no-JS Skills 제목. | 제목 문구만 바뀐다. | 대체 콘텐츠 |
| 153 | <code>&lt;p&gt;JavaScript, TypeScript, Python, Java, HTML, CSS&lt;/p&gt;</code> | no-JS 프로그래밍 언어 목록. | 언어 문구를 바꾸면 대체 화면만 달라진다. 일반 화면은 data.js의 skills를 수정한다. | 대체 콘텐츠 |
| 154 | <code>&lt;p&gt;React, MediaPipe, YOLO, NumPy, PyTorch, API Integration, Git, GitHub&lt;/p&gt;</code> | no-JS 기술 목록. | 목록 문구만 바뀐다. 여기 쓰인 라이브러리가 이 사이트에 실제로 설치되는 것은 아니다. | 대체 콘텐츠 |
| 155 | <code>&lt;/section&gt;</code> | 앞에서 연 section 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 156 | <code>&lt;section&gt;</code> | JavaScript 미사용 대체 본문의 주제별 section을 시작한다. | 안의 제목·문단을 바꾸면 JavaScript를 사용하지 않을 때 보이는 그 섹션이 달라진다. 정상 Quick View 내용은 data.js에서 별도로 만든다. | 대체 콘텐츠 구조 |
| 157 | <code>&lt;h2&gt;Education&lt;/h2&gt;</code> | no-JS Education 제목. | 제목 문구만 바뀐다. | 대체 콘텐츠 |
| 158 | <code>&lt;p&gt;University of Wisconsin–Madison · Fall 2026 — Present&lt;br&gt;Bachelor of Science student · Intended major:</code> | 학교/재학 기간/학위/전공 정보 시작. br은 실제 줄바꿈. | 날짜는 제공된 교육 이력이다. 자동 현재 날짜 계산이 아니다. | 대체 콘텐츠 |
| 159 | <code>Computer Science&lt;/p&gt;</code> | 예정 전공 설명과 문단 끝. | 현재 사실과 같은 내용으로 유지한다. | 대체 콘텐츠 |
| 160 | <code>&lt;/section&gt;</code> | 앞에서 연 section 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 161 | <code>&lt;section&gt;</code> | JavaScript 미사용 대체 본문의 주제별 section을 시작한다. | 안의 제목·문단을 바꾸면 JavaScript를 사용하지 않을 때 보이는 그 섹션이 달라진다. 정상 Quick View 내용은 data.js에서 별도로 만든다. | 대체 콘텐츠 구조 |
| 162 | <code>&lt;h2&gt;Honors&lt;/h2&gt;</code> | no-JS Honors 제목. | 제목 문구만 바뀐다. | 대체 콘텐츠 |
| 163 | <code>&lt;p&gt;Programming Subject Excellence Award · National Honor Society&lt;/p&gt;</code> | 제공된 두 수상/활동 항목. | 대체 화면만 바뀐다. 일반 화면의 honors는 data.js에 있다. | 대체 콘텐츠 |
| 164 | <code>&lt;/section&gt;</code> | 앞에서 연 section 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 165 | <code>&lt;section&gt;</code> | JavaScript 미사용 대체 본문의 주제별 section을 시작한다. | 안의 제목·문단을 바꾸면 JavaScript를 사용하지 않을 때 보이는 그 섹션이 달라진다. 정상 Quick View 내용은 data.js에서 별도로 만든다. | 대체 콘텐츠 구조 |
| 166 | <code>&lt;h2&gt;Resume&lt;/h2&gt;</code> | no-JS Resume 제목. | 제목 문구만 바뀐다. | 대체 콘텐츠 |
| 167 | <code>&lt;p&gt;Resume PDF pending. Enable JavaScript for interactive portfolio features and resume availability checks.&lt;/p&gt;</code> | JS 없는 경우 PDF 확인/기능 사용 안내. | 실제 PDF 유무를 검사하는 코드는 resume.js다. PDF를 추가했다면 이 정적 대체 안내도 따로 최신화한다. | 대체 안내 |
| 168 | <code>&lt;/section&gt;</code> | 앞에서 연 section 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 169 | <code>&lt;section&gt;</code> | JavaScript 미사용 대체 본문의 주제별 section을 시작한다. | 안의 제목·문단을 바꾸면 JavaScript를 사용하지 않을 때 보이는 그 섹션이 달라진다. 정상 Quick View 내용은 data.js에서 별도로 만든다. | 대체 콘텐츠 구조 |
| 170 | <code>&lt;h2&gt;Contact&lt;/h2&gt;</code> | no-JS Contact 제목. | 제목 문구만 바뀐다. | 대체 콘텐츠 |
| 171 | <code>&lt;div class=&quot;actions&quot;&gt;&lt;a class=&quot;button&quot; href=&quot;mailto:starjune07@gmail.com&quot;&gt;Email me&lt;/a&gt;&lt;a class=&quot;button&quot;</code> | 메일 앱을 여는 mailto 링크와 GitHub 링크 시작. | 메일 주소를 바꾸면 수신 주소가 바뀐다. 이 사이트에서 직접 메일을 전송하는 폼은 아니다. | 연락 링크 |
| 172 | <code>href=&quot;https://github.com/starjune77&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;GitHub&lt;/a&gt;&lt;/div&gt;</code> | GitHub 주소와 새 탭 열기/안전 연결 설정. | href는 목적지, target=_blank는 새 탭. noopener는 새 페이지와 원래 페이지의 opener 연결을 끊도록 명시한다. | 연락 링크 |
| 173 | <code>&lt;/section&gt;</code> | 앞에서 연 section 요소를 닫아 내부 범위를 끝낸다. JavaScript 미사용 대체 본문의 구조다. | 문구를 바꾸는 줄이 아니다. 태그를 없애거나 순서를 바꾸면 브라우저의 자동 보정으로 중첩·배치가 달라질 수 있다. 요소를 삭제하려면 여는 태그·내용·닫는 태그를 함께 판단한다. | 대체 본문 구조 |
| 174 | <code>&lt;/main&gt;</code> | no-JS 포트폴리오 main 종료. | 대체 문서의 구조를 마무리한다. | 구조 |
| 175 | <code>&lt;/noscript&gt;</code> | noscript 대체 콘텐츠 종료. | JS 비활성 시에만 보여 주는 범위를 마무리한다. | 구조 |
| 176 | <code>&lt;/body&gt;</code> | 페이지 body 종료. | 본문의 범위를 끝낸다. | 구조 |
| 177 | (빈 줄) | 읽기 쉽게 구분하는 빈 줄. | 삭제하거나 추가해도 화면과 기능은 같고 줄 번호만 바뀐다. | 선택(서식) |
| 178 | <code>&lt;/html&gt;</code> | HTML 루트 종료. | 문서 구조를 마무리한다. | 구조 |

총 178줄을 빈 줄과 닫는 괄호/태그까지 모두 포함했습니다.
