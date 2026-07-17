# 지속가능한 실천방안 활동지 웹앱 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 연수 교사들이 로그인 후 실천로드맵(4요소)·실천흐름(4단계)·종합 로드맵을 작성하면 구글시트 4개 탭에 개인별로 저장/불러오기 되는 정적 웹앱을 만들어 Netlify에 배포한다.

**Architecture:** 바닐라 정적 SPA(빌드 없음) + GAS Web App JSON API + Google Sheets DB. POST는 `text/plain`으로 CORS preflight 회피. GAS 코드는 파일로 제공(사용자가 반영·재배포).

**Tech Stack:** HTML/CSS/JS(vanilla), Google Apps Script, Google Sheets, git+gh CLI, Netlify CLI.

**Spec:** `docs/superpowers/specs/2026-07-17-sustainable-practice-webapp-design.md`

---

### Task 1: design.md 작성 (UI-UX-pro-max-skill 지침 적용)

**Files:**
- Create: `design.md`

- [ ] **Step 1:** WebFetch로 `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill` README 및 스킬 문서를 읽고 그 프로세스(디자인 시스템 정의: 팔레트, 타이포, 컴포넌트, 인터랙션, 접근성 규칙)를 파악한다.
- [ ] **Step 2:** 슬라이드 테마를 기반으로 `design.md` 작성. 필수 포함: 컬러 토큰(딥그린 #14532D/#166534, 크림 #FFF7ED/#FFEDD5, 오렌지 포인트 #F59E0B, 라이트그린 #DCFCE7), 타이포(Pretendard, 웹폰트 CDN), 4페이지별 레이아웃 정의(로그인 센터카드/2×2 카드그리드/4단계 타임라인/성장목표 배너+3×3 표), 버튼·입력·토스트·스텝내비 컴포넌트 스펙, 반응형 브레이크포인트(768px), 접근성(라벨, 포커스링, 대비).
- [ ] **Step 3:** Commit: `git add design.md && git commit -m "docs: UI-UX 디자인 시스템 정의"`

### Task 2: GAS 백엔드 코드

**Files:**
- Create: `gas/Code.gs`
- Create: `gas/README.md`

- [ ] **Step 1:** `gas/Code.gs` 작성 — 전체 코드:

```javascript
/**
 * 지속가능한 실천방안 세우기 — 백엔드 API
 * 시트: auth(명단) / roadmap / flow / final
 * 배포: 웹 앱, 실행 권한 "나", 액세스 권한 "모든 사용자"
 */
var SS_ID = '14tYk1n65EDeCfmF95YDAeBwsxUcFNhruwMdvGU-boD0';

var SHEETS = {
  auth:    { headers: ['이름'] },
  roadmap: { headers: ['이름', '성장목표', '실천활동', '지원자원', '점검방법', '수정일시'],
             fields:  ['growthGoal', 'actions', 'resources', 'checkMethods'] },
  flow:    { headers: ['이름', '시작(1-2개월)', '적용(3-4개월)', '확장(5-6개월)', '지속(이후)', '수정일시'],
             fields:  ['start', 'apply', 'expand', 'sustain'] },
  final:   { headers: ['이름', '성장목표',
                       '실천1(1-2개월)', '지원1', '점검1',
                       '실천2(3-4개월)', '지원2', '점검2',
                       '실천3(5-6개월)', '지원3', '점검3', '수정일시'],
             fields:  ['growthGoal', 'act1', 'sup1', 'chk1', 'act2', 'sup2', 'chk2', 'act3', 'sup3', 'chk3'] }
};

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    var action = (e.parameter.action || '').trim();
    if (action === 'setup') return json(setupSheets());
    if (action === 'login') return json(login(e.parameter.name));
    if (action === 'load')  return json(loadAll(e.parameter.name));
    return json({ ok: false, error: 'UNKNOWN_ACTION' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action === 'save') return json(save(body.sheet, body.name, body.data));
    return json({ ok: false, error: 'UNKNOWN_ACTION' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function ss() { return SpreadsheetApp.openById(SS_ID); }

function setupSheets() {
  var spreadsheet = ss();
  var order = ['auth', 'roadmap', 'flow', 'final'];
  order.forEach(function (name, i) {
    var sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name, i);
    var headers = SHEETS[name].headers;
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  });
  var auth = spreadsheet.getSheetByName('auth');
  if (auth.getLastRow() < 2) auth.getRange(2, 1).setValue('테스트교사');
  return { ok: true, message: 'setup complete' };
}

function normalize(name) { return String(name || '').replace(/\s+/g, ''); }

function login(name) {
  var n = normalize(name);
  if (!n) return { ok: false, error: 'EMPTY_NAME' };
  var auth = ss().getSheetByName('auth');
  if (!auth) return { ok: false, error: 'NO_AUTH_SHEET' };
  var last = auth.getLastRow();
  if (last >= 2) {
    var values = auth.getRange(2, 1, last - 1, 1).getValues();
    for (var i = 0; i < values.length; i++) {
      if (normalize(values[i][0]) === n) return { ok: true, name: String(values[i][0]) };
    }
  }
  return { ok: false, error: 'NOT_FOUND' };
}

function findRow(sheet, name) {
  var n = normalize(name);
  var last = sheet.getLastRow();
  if (last < 2) return -1;
  var values = sheet.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (normalize(values[i][0]) === n) return i + 2;
  }
  return -1;
}

function save(sheetName, name, data) {
  var conf = SHEETS[sheetName];
  if (!conf || !conf.fields) return { ok: false, error: 'INVALID_SHEET' };
  var auth = login(name);
  if (!auth.ok) return auth;
  var sheet = ss().getSheetByName(sheetName);
  if (!sheet) return { ok: false, error: 'NO_SHEET_' + sheetName };
  var row = [auth.name];
  conf.fields.forEach(function (f) { row.push(String((data && data[f]) || '')); });
  row.push(Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'));
  var r = findRow(sheet, name);
  if (r === -1) r = sheet.getLastRow() + 1;
  sheet.getRange(r, 1, 1, row.length).setValues([row]);
  return { ok: true };
}

function loadOne(sheetName, name) {
  var conf = SHEETS[sheetName];
  var sheet = ss().getSheetByName(sheetName);
  if (!sheet) return null;
  var r = findRow(sheet, name);
  if (r === -1) return null;
  var values = sheet.getRange(r, 1, 1, conf.headers.length).getValues()[0];
  var out = {};
  conf.fields.forEach(function (f, i) { out[f] = String(values[i + 1] || ''); });
  return out;
}

function loadAll(name) {
  var auth = login(name);
  if (!auth.ok) return auth;
  return {
    ok: true,
    name: auth.name,
    roadmap: loadOne('roadmap', name),
    flow: loadOne('flow', name),
    final: loadOne('final', name)
  };
}
```

- [ ] **Step 2:** `gas/README.md` 작성 — 반영 절차: ① 시트 열기 → 확장 프로그램 → Apps Script ② Code.gs 전체 교체 ③ 배포 관리 → 기존 배포 편집 → 새 버전 배포(같은 URL 유지) ④ `{URL}?action=setup` 접속해 탭 생성 확인 ⑤ auth탭에 실제 명단 입력.
- [ ] **Step 3:** 현재 배포 URL에 curl GET으로 연결성 확인(사용자 코드 반영 전이므로 응답 형식만 관찰, 실패해도 진행).
- [ ] **Step 4:** Commit: `git add gas && git commit -m "feat: GAS 백엔드 API 코드 및 반영 가이드"`

### Task 3: 프론트엔드 구조 + API 모듈

**Files:**
- Create: `app/index.html`
- Create: `app/css/style.css`
- Create: `app/js/config.js`
- Create: `app/js/api.js`
- Create: `app/js/app.js`
- Create: `netlify.toml`

- [ ] **Step 1:** `app/js/config.js`:

```javascript
const CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/AKfycbwX-k-8fyDg29KxUgkN-6szHPXmQweLSzDooIsAbVy59xUl4BciVtIERsC6pNYifWvR5A/exec',
  STORAGE_KEY: 'sp2026_teacher',
  DRAFT_KEY: 'sp2026_draft'
};
```

- [ ] **Step 2:** `app/js/api.js` — GET은 쿼리스트링, POST는 text/plain(JSON 문자열). 타임아웃 20초(AbortController). `apiLogin(name)`, `apiLoad(name)`, `apiSave(sheet, name, data)` 3개 함수, 실패 시 `{ok:false,error}` 반환(throw 안 함).
- [ ] **Step 3:** `app/index.html` — 단일 페이지, `<section id="page-login|page-roadmap|page-flow|page-final">` 4개 + 헤더(타이틀, 스텝내비 1~4, 사용자명/로그아웃) + 토스트 컨테이너. 각 섹션 구성은 spec 4장 그대로: roadmap은 2×2 카드(성장목표/실천활동/지원자원/점검방법 각 아이콘+안내문+textarea), flow는 4단계 타임라인(시작/적용/확장/지속, 기간 뱃지), final은 성장목표 배너 input + 3기간×(실천/지원/점검) 그리드 + 저장 후 요약 뷰.
- [ ] **Step 4:** `app/js/app.js` — 상태(`state.name`, `state.data`), `showPage(id)` 전환, 로그인 핸들러(apiLogin→apiLoad→localStorage 저장→page-roadmap 이동), 각 저장 버튼 핸들러(apiSave→토스트), 프리필 로직(final의 성장목표←roadmap.growthGoal, act1/2/3←flow.start/apply/expand — 비어있을 때만), 입력 시 draft를 localStorage에 보관, 새로고침 시 로그인 유지+데이터 재로드, 로그아웃.
- [ ] **Step 5:** `app/css/style.css` — design.md 토큰 그대로 구현(그린 헤더, 크림 카드, 오렌지 포인트, Pretendard, 반응형 768px, 포커스링, 토스트 애니메이션).
- [ ] **Step 6:** `netlify.toml`:

```toml
[build]
  publish = "app"
```

- [ ] **Step 7:** Commit: `git add app netlify.toml && git commit -m "feat: 4페이지 활동지 SPA 구현"`

### Task 4: 로컬 검증

- [ ] **Step 1:** 브라우저 미리보기로 `app/index.html`을 로컬 서버로 열어 확인: 로그인 화면 렌더, 미로그인 시 2~4페이지 차단, (GAS 미반영 상태면) 로그인 시 오류 토스트 정상 표시.
- [ ] **Step 2:** GAS가 이미 응답하는 경우 `테스트교사`로 로그인→작성→저장→새로고침→값 유지 확인.
- [ ] **Step 3:** 모바일(375px) 뷰 확인 — 카드 1열 전환, 표 세로 스택.
- [ ] **Step 4:** 발견된 문제 수정 후 Commit: `git add -A && git commit -m "fix: 로컬 검증 반영"` (수정 없으면 생략)

### Task 5: GitHub push + Netlify 배포

- [ ] **Step 1:** `gh auth status`로 인증 확인. 미인증이면 사용자에게 안내하고 중단 지점 보고.
- [ ] **Step 2:** `gh repo create sustainable-practice-webapp --public --source=. --push`
- [ ] **Step 3:** `netlify status`로 인증 확인 → `netlify deploy --prod --dir=app` (사이트 미연결 시 `netlify sites:create` 후 링크). CLI 미설치면 `npm i -g netlify-cli`.
- [ ] **Step 4:** 배포 URL 접속해 로그인 화면 렌더 확인(브라우저).
- [ ] **Step 5:** Commit(잔여 변경) 및 최종 보고: 배포 URL, repo URL, GAS 반영 절차(gas/README.md) 안내.

## Self-Review 결과

- Spec coverage: 4페이지(§4)→Task 3, 시트 스키마(§5)→Task 2 SHEETS, API(§6)→Task 2/3, 오류 처리(§7)→api.js·app.js·GAS try/catch, 배포(§9)→Task 5, design.md(§4 공통)→Task 1. 누락 없음.
- Placeholder: 코드 블록은 GAS 전체 제공, FE는 파일별 책임·동작 명세로 구체화(구현 시 design.md와 spec을 단일 소스로 사용).
- Type consistency: 필드명(growthGoal/actions/resources/checkMethods, start/apply/expand/sustain, act·sup·chk1-3)이 GAS SHEETS.fields와 FE 프리필 로직에서 동일함을 확인.
