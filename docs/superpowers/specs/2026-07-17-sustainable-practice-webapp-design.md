# 지속가능한 실천방안 세우기 — 활동지 웹앱 설계서

- 날짜: 2026-07-17
- 대상: 2026 인공지능 활용 선도교사 양성연수 13과정(AI·디지털 역량 진단 및 전문성 개발 경로 설계) 3번 활동
- 작성 근거: 교안 PDF(`sourse/13. 역량 사후 진단, 전문성 개발 경로 탐색.pdf`), 첨부 슬라이드 이미지 3장, 사용자 요구사항

## 1. 목적

연수 참여 선생님들이 3번 활동 "지속가능한 실천방안 세우기"를 웹앱에서 수행하고,
작성 내용이 개인별로 구글시트에 저장·불러오기 되도록 한다.

## 2. 확정 결정 사항 (기본값으로 진행, 추후 변경 가능)

| 항목 | 결정 |
|---|---|
| 관리자 페이지 | 없음. 교사 입력 전용. 전체 현황은 강사가 구글시트에서 직접 확인 |
| 시트 탭 구성 | GAS `setupSheets()` 함수가 4개 탭+헤더 자동 생성. 실제 교사 명단은 auth탭에 강사가 직접 입력 |
| 4페이지 로드맵 기간 | 예시 슬라이드와 동일한 3개 기간(1–2개월/3–4개월/5–6개월) × (실천/지원/성장 점검) |
| GitHub 저장소 | 새 public repo 생성 후 push |
| 배포 | Netlify CLI로 정적 배포 |
| GAS 코드 반영 | Google Drive 커넥터로 Apps Script 코드 수정은 불가 → `gas/Code.gs` 파일 제공, 사용자가 붙여넣고 재배포 |

## 3. 아키텍처 (승인된 A안)

```
[브라우저: 정적 SPA (Netlify)]  ←fetch→  [GAS Web App (doGet/doPost)]  ←→  [Google Sheets 4탭]
```

- **FE**: 바닐라 HTML/CSS/JS, 빌드 스텝 없음. 단일 `index.html`에 4개 화면(step) 전환 방식.
- **BE**: Google Apps Script Web App. `doGet`(login/load/setup), `doPost`(save)로 JSON API 제공.
- **CORS**: GAS는 preflight(OPTIONS)를 처리하지 못하므로, POST는 `Content-Type: text/plain;charset=utf-8`로
  JSON 문자열을 전송해 simple request로 처리(표준 GAS 패턴). 응답은 `ContentService` JSON.
- **DB**: 구글시트 `14tYk1n65EDeCfmF95YDAeBwsxUcFNhruwMdvGU-boD0`.
- **GAS 배포 URL**: `https://script.google.com/macros/s/AKfycbwX-k-8fyDg29KxUgkN-6szHPXmQweLSzDooIsAbVy59xUl4BciVtIERsC6pNYifWvR5A/exec`
  (FE `config.js`에 상수로 보관).

## 4. 화면 구성 (4페이지)

디자인: 첨부 슬라이드의 그린(#1B6B4A 계열)/크림(#FDEEDC 계열)/오렌지 포인트 테마.
UI-UX-pro-max-skill 지침으로 `design.md`를 작성한 뒤 이를 따른다. 모바일/태블릿 반응형.

### 페이지 1 — 로그인
- 이름 입력 → GAS `action=login` 호출 → auth탭 명단과 대조.
- 성공 시 이름을 `localStorage`에 저장하고 페이지 2로 이동. 기존 작성 데이터가 있으면 함께 로드.
- 실패 시 "명단에 없는 이름" 안내.

### 페이지 2 — 지속가능한 실천로드맵 (슬라이드 1)
4개 카드 입력(각 textarea):
1. **성장 목표** — "나는 ~한 교사가 될 것이다."
2. **실천 활동** — "이를 위해 ~을 실천할 것이다." (시작-적용-확장-지속 힌트)
3. **지원 자원** — 활용할 연수·도구·공동체
4. **점검 방법** — 체크리스트, 동료피드백, 자기기록

저장 → roadmap탭 upsert(이름 기준 1행).

### 페이지 3 — 실천흐름 만들기 (슬라이드 2)
4단계 타임라인 입력:
1. **시작 (1–2개월)** 2. **적용 (3–4개월)** 3. **확장 (5–6개월)** 4. **지속 (이후)**

저장 → flow탭 upsert.

### 페이지 4 — 실천로드맵 완성 (슬라이드 3 예시 형태)
- 상단 **성장목표** 배너: 페이지 2의 성장 목표가 자동 프리필(수정 가능).
- 3행(1–2개월/3–4개월/5–6개월) × 3열(실천/지원/성장 점검) 표 입력.
  - "실천" 열은 페이지 3의 시작/적용/확장 내용이 비어있을 때 프리필 제안.
- 저장 → final탭 upsert. 저장 후 완성 로드맵 요약 뷰 표시.

### 공통
- 상단 스텝 내비게이션(1~4)으로 자유 이동(로그인 후).
- 각 페이지 진입 시 기존 저장값 로드(재접속 시 이어서 작성).
- 저장 성공/실패 토스트 표시.

## 5. 구글시트 스키마

| 탭(순서) | 이름 | 헤더 |
|---|---|---|
| 1 | `auth` | 이름 (A열, 2행부터 명단) |
| 2 | `roadmap` | 이름, 성장목표, 실천활동, 지원자원, 점검방법, 수정일시 |
| 3 | `flow` | 이름, 시작(1-2개월), 적용(3-4개월), 확장(5-6개월), 지속(이후), 수정일시 |
| 4 | `final` | 이름, 성장목표, 실천1(1-2개월), 지원1, 점검1, 실천2(3-4개월), 지원2, 점검2, 실천3(5-6개월), 지원3, 점검3, 수정일시 |

upsert 규칙: 이름으로 행 검색 → 있으면 갱신, 없으면 추가. (동명이인은 범위 밖: 명단에 구분자 포함 권장)

## 6. GAS API 명세

- `GET ?action=setup` → 4개 탭/헤더 생성(+auth 샘플 1행). 결과 JSON.
- `GET ?action=login&name=홍길동` → `{ok:true}` / `{ok:false, error:"NOT_FOUND"}`
- `GET ?action=load&name=홍길동` → `{ok:true, roadmap:{...}|null, flow:{...}|null, final:{...}|null}`
- `POST` body(JSON, text/plain): `{action:"save", sheet:"roadmap"|"flow"|"final", name:"홍길동", data:{...}}` → `{ok:true}`
- 모든 오류는 `{ok:false, error:"메시지"}`로 통일.

## 7. 오류 처리

- FE: fetch 실패/타임아웃 시 재시도 안내 토스트, 저장 중 버튼 비활성+스피너.
- 미로그인 상태로 2~4페이지 접근 시 로그인 화면으로 리다이렉트.
- GAS: try/catch로 감싸 항상 JSON 반환. 알 수 없는 action → `UNKNOWN_ACTION`.
- 입력값은 저장 전 로컬에도 보관(localStorage)하여 네트워크 실패 시 유실 방지.

## 8. 테스트 및 검증

- GAS: `setup`→`login`→`save`→`load` 순서로 curl 수동 검증(사용자가 코드 반영·재배포한 후).
- FE: 로컬 서버로 4페이지 흐름 및 반응형 확인(브라우저 확인), Netlify 배포 후 실배포 URL 재확인.
- 사용자가 GAS 코드를 반영하기 전에는 FE가 오류 토스트를 정상 표시하는지 확인.

## 9. 배포 파이프라인

1. `git init` → 커밋
2. `gh repo create`(public) → push
3. `netlify deploy --prod`(정적, 루트 `app/` 또는 프로젝트 루트)
4. GAS 코드는 `gas/Code.gs`로 제공 + `gas/README.md`에 반영·재배포 절차 안내

## 10. 산출물 구조

```
혁명웹앱/
├─ docs/superpowers/specs/…-design.md   (본 문서)
├─ docs/superpowers/plans/…-plan.md     (구현 계획)
├─ design.md                            (UI-UX-pro-max-skill 기반 디자인 시스템)
├─ app/
│  ├─ index.html
│  ├─ css/style.css
│  └─ js/config.js, api.js, app.js
├─ gas/
│  ├─ Code.gs
│  └─ README.md
└─ netlify.toml
```
