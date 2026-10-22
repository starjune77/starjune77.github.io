# script.js 한 줄씩 설명

2026-10-08에 읽은 현재 파일 기준입니다. 원본 코드는 수정하지 않았습니다. 코드 칸에서는 앞쪽 들여쓰기를 생략했습니다.

[전체 안내·수정 예제](code-guide.ko.md) · [HTML](index-lines.ko.md) · [CSS](style-lines.ko.md) · [JavaScript](script-lines.ko.md)

script.js는 여러 모듈을 **연결하고 시작**합니다. 캐릭터 이동 공식을 직접 계산하는 파일은 js/player.js이고, Canvas 그림은 js/render-world.js와 Player.draw()가 담당합니다.

**필수 여부**는 웹페이지라면 언제나 꼭 필요하다는 뜻이 아니라, 현재 프로젝트의 기능·배치·접근성을 유지하는 데 필요한 정도입니다. 선택 기능도 연결된 코드가 있으면 한 줄만 삭제할 수 없습니다. 자세한 기준은 전체 안내에 있습니다.

VS Code에서 원본 파일을 열고 **Ctrl+G**로 줄 번호에 이동하세요. 이 설명서는 **Ctrl+Shift+V**로 Markdown 미리보기를 열면 표로 읽을 수 있습니다. 원본을 포맷하거나 줄을 추가하면 번호가 달라집니다.

## 1–10줄: 필요한 모듈 불러오기

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 1 | <code>import {createState} from './js/utils.js';</code> | 모듈에서 createState 함수를 가져온다. | 경로 또는 export 이름을 틀리면 모듈 로딩이 실패해 전체 초기화가 멈춘다. | 동작 필수 |
| 2 | <code>import {Game} from './js/game.js';</code> | Canvas 게임 엔진 클래스 Game을 가져온다. | Game을 없애면 아래 new Game 생성도 함께 대체해야 한다. | 게임 필수 |
| 3 | <code>import {Input} from './js/input.js';</code> | 중앙 키보드/터치 입력 상태 클래스 Input을 가져온다. | 키 설정은 이 import가 아니라 js/input.js 내부에서 바꾼다. | 게임 입력 필수 |
| 4 | <code>import {setupOverlays,setupPanels} from './js/panels.js';</code> | dialog 관리와 상세 패널 생성 함수를 가져온다. | 함수 이름/경로는 panels.js의 export와 일치해야 한다. | 현재 동작 필수 |
| 5 | <code>import {setupQuickView} from './js/quick-view.js';</code> | 전체 Quick View 초기화 함수를 가져온다. | 현재 사이트의 두 번째 모드를 만들기 위한 의존성이다. | Quick View 필수 |
| 6 | <code>import {setupResume} from './js/resume.js';</code> | PDF 가용성 검사와 링크 상태 갱신 함수를 가져온다. | 이력서 경로는 data.js의 resumePath에서 바꾼다. | 이력서 기능 |
| 7 | <code>import {setupTerminal} from './js/terminal.js';</code> | 선택형 터미널 초기화 함수를 가져온다. | 삭제하려면 18/19/23줄의 참조와 터미널 관련 HTML/월드도 함께 정리해야 한다. | 선택 기능·연결 유지 |
| 8 | <code>import {setupDebug} from './js/debug.js';</code> | 선택형 F2 디버그 초기화 함수를 가져온다. | 삭제하려면 15/19/22줄의 debug 참조도 함께 정리해야 한다. | 선택 기능·연결 유지 |
| 9 | <code>import {setupMobileControls} from './js/mobile-controls.js';</code> | 모바일 버튼과 첫 진입 선택을 연결하는 함수를 가져온다. | 모바일 기능을 없애지 않는다면 유지한다. | 모바일 필수 |
| 10 | (빈 줄) | 읽기 쉽게 구분하는 빈 줄. | 지우거나 늘려도 실행 결과는 같고 줄 번호만 바뀐다. | 선택(서식) |

## 11–19줄: 상태·패널·게임 객체 준비

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 11 | <code>const state=createState();</code> | 현재 앱 모드/일시정지/현재 구역 등을 담는 공통 상태 객체 생성. const는 변수 재대입 금지이며 객체 내부 변경까지 금지하지는 않는다. | 각 모듈이 같은 상태를 공유해야 패널을 열 때 게임이 함께 멈춘다. | 동작 필수 |
| 12 | <code>const canvas=document.querySelector('#world');</code> | HTML에서 id=world인 Canvas를 찾는다. #은 CSS ID 선택자. | HTML의 id와 다른 이름을 쓰면 null이 반환되고 Game 생성이 실패한다. | 동작 필수 |
| 13 | <code>const overlays=setupOverlays(state,canvas);</code> | dialog 닫기, 모드 전환, 게임 복귀 포커스를 설정. | 삭제하면 현재 패널/Quick View의 일시정지와 복귀 연결이 깨진다. | 현재 동작 필수 |
| 14 | <code>const refreshResume=setupResume();</code> | PDF 확인을 시작하고 나중에 새 패널의 링크 상태도 갱신할 함수를 받아 둔다. | 이 호출을 없애면 현재 PDF 검사/활성화가 실행되지 않는다. | 이력서 기능 |
| 15 | <code>const debug=setupDebug(state);</code> | 선택형 디버그 패널 제어 객체 생성. | 선택 기능이지만 debug를 받는 19줄과 사용하는 22줄도 함께 수정해야 제거 가능하다. | 선택 기능·연결 유지 |
| 16 | <code>const openPanel=setupPanels(overlays,()=&gt;game.returnToStart(),refreshResume);</code> | 상세 패널을 초기화하고 시작 지점 복귀 동작/PDF 갱신 함수를 연결한다. ()=&gt;game.returnToStart()는 나중에 실행할 콜백. | 아직 Game 생성 전이지만 콜백 내부는 클릭할 때 실행되므로 가능하다. 콜백 대신 game.returnToStart()를 즉시 실행하면 선언 순서 때문에 오류가 난다. | 현재 동작 필수 |
| 17 | <code>const toggleQuick=setupQuickView(document.querySelector('#quick-view'),overlays);</code> | Quick View의 HTML을 만들고 열기/닫기 함수 toggleQuick을 받는다. | quick-view ID는 HTML과 일치해야 한다. 이 초기화를 지우면 포트폴리오 내용과 Q 토글을 잃는다. | Quick View 필수 |
| 18 | <code>const toggleTerminal=setupTerminal(overlays,openPanel);</code> | 터미널 이벤트를 연결하고 열기/닫기 함수를 받는다. | 선택 기능. 단독 삭제하면 toggleTerminal을 참조하는 19/23줄도 수정해야 한다. | 선택 기능·연결 유지 |
| 19 | <code>const game=new Game(canvas,state,block=&gt;block.type==='terminal'?toggleTerminal():openPanel(block.type,block.contentId),debug);</code> | Game 생성. Canvas/상태/블록 접근 콜백/디버그 객체를 전달한다. terminal 블록은 터미널, 나머지는 해당 정보 패널을 연다. | 이 줄에서 게임 속도를 설정하지 않는다. 블록 종류 분기를 바꾸면 열리는 화면이 달라진다. 블록 데이터는 world.js에 있다. | 게임 필수 |

## 20–29줄: 키보드·클릭·터치 연결

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 20 | <code>const input=new Input(state,action=&gt;{</code> | 중앙 입력 객체 생성과 키별 동작 콜백 시작. | 같은 키를 여러 파일에서 별도로 처리하지 않고 한 입력 체계로 연결한다. | 게임 입력 필수 |
| 21 | <code>if(action==='KeyQ')toggleQuick();</code> | Input이 전달한 KeyQ 동작은 Quick View를 토글. | Q를 다른 키로 바꾸려면 이 줄뿐 아니라 input.js의 허용 단축키 목록과 화면 안내도 맞춘다. | Quick View 단축키 |
| 22 | <code>else if(action==='F2'){debug.toggle();game.render();}</code> | F2는 디버그 표시를 바꾸고 즉시 Canvas/진단을 다시 그린다. | D는 이동 키이므로 디버그 키로 바꾸면 충돌할 수 있다. 실제 키 인식은 input.js와 함께 수정한다. | 선택 기능 |
| 23 | <code>else if(action==='Backquote')toggleTerminal();</code> | Backquote 동작은 선택형 터미널을 토글. | 이 분기를 지우면 해당 단축키만 없어지고 월드 터미널 접근은 별도로 남길 수 있다. | 선택 기능 |
| 24 | <code>else if(action==='interact')game.interact();</code> | interact라는 입력 동작은 Game의 근처 대상 상호작용을 호출. | 실제 E 키 인식은 input.js에서 이 action을 전달한다. 거리와 대상 선택은 interactions.js가 담당한다. | 상호작용 필수 |
| 25 | <code>});</code> | 입력 콜백과 new Input 호출을 닫는다. | 괄호/중괄호의 짝을 맞춰야 JS 파싱이 된다. | 문법 |
| 26 | <code>game.input=input;</code> | 생성한 입력 객체를 게임에 전달. Game.update가 input.sample()을 호출할 수 있게 한다. | 삭제하면 게임 업데이트에서 입력을 읽을 수 없어 오류가 발생한다. | 게임 입력 필수 |
| 27 | <code>document.addEventListener('click',event=&gt;{if(event.target.closest('[data-quick]'))toggleQuick();});</code> | 문서 전체 클릭 이벤트 하나로 data-quick 버튼을 처리. closest는 클릭 위치에서 가까운 해당 표식의 요소를 찾는다. | data-quick이 있는 여러 버튼에 모두 적용된다. HTML 표식 이름을 바꾸면 이 선택자도 바꾼다. | Quick View 클릭 기능 |
| 28 | <code>setupMobileControls(input,state,overlays,toggleQuick,()=&gt;game.interact());</code> | 모바일 이동/점프/열기/진입 선택을 연결. 마지막 콜백은 Game 상호작용 실행. | 삭제하면 화면에 터치 버튼이 보여도 현재 이동 이벤트 연결이 실행되지 않는다. | 모바일 기능 필수 |
| 29 | <code>document.querySelector('#interaction-prompt').addEventListener('click',()=&gt;game.interact());</code> | 근처 블록 안내 버튼을 클릭하면 같은 상호작용을 실행하도록 연결. | 이 줄을 지우면 안내 버튼 클릭만 안 되고 E 키는 별도로 동작할 수 있다. 요소 ID는 HTML과 맞아야 한다. | 클릭 상호작용 |

## 30–36줄: 실행과 직접 링크 처리

| 줄 | 현재 코드 | 하는 일 | 바꾸거나 지우면 | 필수 여부 |
| ---: | --- | --- | --- | --- |
| 30 | <code>game.sync();refreshResume();</code> | 게임의 루프 상태를 맞춰 실행하고 현재 PDF 버튼 상태도 표시. 두 문장이다. | game.sync()를 제거하면 초기 게임 루프가 시작되지 않는다. sync는 정지/재시작과 루프 중복 방지도 담당한다. | 게임 필수·PDF UI |
| 31 | <code>const directQuick=new URLSearchParams(location.search).get('view')==='quick'&#124;&#124;location.hash==='#quick';</code> | URL의 ?view=quick 또는 #quick을 읽어 바로 Quick View로 갈지 계산. &#124;&#124;는 둘 중 하나만 참이어도 참. | URLSearchParams는 ? 뒤 쿼리를 읽는다. 값 quick을 바꾸면 직접 접근 주소 규칙도 바뀐다. | 직접 링크 기능 |
| 32 | <code>if(directQuick&#124;&#124;!game.ctx)toggleQuick();</code> | 직접 링크이거나 Canvas 2D를 얻지 못했으면 Quick View를 연다. !game.ctx는 컨텍스트 없음. | 삭제하면 no-Canvas 환경 자동 대체와 Quick View 직행이 없어지지만 일반 Q 버튼은 남는다. | 대체·직접 링크 |
| 33 | <code>else if(location.hash.startsWith('#project-'))openPanel('project',location.hash.slice(9));</code> | #project-로 시작하는 URL이면 해당 프로젝트 패널을 연다. slice(9)는 #project- 9글자를 제거. | 접두사를 바꾸면 제거 길이도 맞춰야 한다. 예: #project-morrowlab에서 morrowlab만 넘긴다. | 프로젝트 직접 링크 |
| 34 | <code>// No content is gated by Canvas support; the semantic Quick View remains usable.</code> | Canvas가 없어도 HTML 기반 Quick View를 쓸 수 있다는 개발자 주석. | 삭제해도 실행 결과는 바뀌지 않는다. | 선택(주석) |
| 35 | <code>document.documentElement.classList.add('ready');</code> | 최상위 html 요소에 ready 클래스를 붙여 초기화 완료를 표시. | 현재 CSS는 ready를 스타일에 쓰지 않지만 browser-check 테스트가 준비 완료를 기다리는 표식이다. 제거하면 해당 테스트도 수정해야 한다. | 검증 표식 |
| 36 | (빈 줄) | 읽기 쉽게 구분하는 빈 줄. | 지우거나 늘려도 실행 결과는 같고 줄 번호만 바뀐다. | 선택(서식) |

총 36줄을 빈 줄과 닫는 괄호/태그까지 모두 포함했습니다.
