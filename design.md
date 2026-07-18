# Design System v4 — "Nodeflow Dark" (지속가능한 실천방안 세우기 활동지 웹앱)

> UI-UX-pro-max-skill 프로세스(요청 분석 → 스타일 탐색 → 규칙·안티패턴 필터 → 시스템 산출 → 사전 검증)로 개정.
> 레퍼런스: 사용자 지정 Framer 프로젝트 **Nodeflow**(다크 SaaS 템플릿, 프로젝트 ID `SASVCZ55RkeqSlZT1Xog`)에서
> Framer Agent CLI로 **실제 컬러 스타일·텍스트 스타일·홈 화면**을 추출해 그대로 토큰화함.
> 원칙: **UI 스타일만 교체.** 페이지 구성·HTML 구조·JS 로직·GAS 연동·배포는 변경하지 않는다.

## 1. Concept

"어두운 우주 위의 정밀한 도구". 거의 블랙에 가까운 네이비 캔버스, 헤어라인(흰 8%) 보더의 차콜 카드,
화이트 pill CTA, 블루·그린·퍼플 틴트 뱃지. 절제된 글로우가 깊이를 만든다.

## 2. Colors (Nodeflow 컬러 스타일 실측값)

| 역할 | 토큰 | 값 | Nodeflow 원본 스타일명 |
|---|---|---|---|
| Page(바깥) | `--bg-deep` | `#0D0F16` | Inkwell Blue |
| Shell | `--bg` | `#0C0E18` | Dark Navy |
| Surface(카드) | `--surface` | `#1D1F2A` | Charcoal Blue |
| Surface 2(입력) | `--surface-2` | `#101624` | Deep Navy |
| Hairline | `--line` | `rgba(255,255,255,0.08)` | White 8 |
| Hairline 강조 | `--line-strong` | `rgba(255,255,255,0.25)` | White 25 |
| 텍스트 | `--text` | `#FFFFFF` | White 100 |
| 텍스트 보조 | `--text-70/60/40` | 흰 70/60/40% | White 70/60/40 |
| Accent | `--blue` | `#60A5FA` (+10/15/20/30 틴트) | Blue 100~10 |
| Accent 2 | `--green` | `#34D399` (+10/20) | Green 100~10 |
| Accent 3 | `--purple` | `#818CF8` (+10/20) | Purple 100~10 |
| Error | `--red` | `#FF5F57` | Red |
| Warning | `--yellow` | `#FFBD2E` | Yellow |

- CTA는 **흰색 배경 + 검정 텍스트**(Nodeflow 시그니처). 밝은 블루 면 위 텍스트는 검정.
- 대비: 흰 텍스트 on `--bg` ≈ 19:1, `--text-60` on `--bg` ≈ 10:1, 검정 on 흰 CTA ≈ 19:1, 검정 on `--blue` ≈ 7.9:1 — 모두 충족.
- `color-scheme: dark` 명시(스크롤바·폼 위젯 다크).

## 3. Typography (Nodeflow 텍스트 스타일 실측값)

- **Heading**: `Cabinet Grotesk`(500/700, Fontshare CDN) + 한글 폴백 `Pretendard Variable`(700) — Nodeflow H1~H6 동일 폰트. 흰색, letter-spacing -0.02em.
- **Body**: `Inter`(400/500/600, Google Fonts) + `Pretendard Variable` — Nodeflow Text 13~18 계열.
- 스케일: 로그인 h1 38/700/1.15, 페이지 헤드라인 32/700/1.15, 카드 타이틀 18/700, 본문·입력 15/400(lh 1.55), 라벨·캡션 13/500.

## 4. Pattern (구조 변화 없음, 스킨만)

- 플로팅 셸 유지 — 셸은 `--bg` + 1px `--line` 보더, 페이지 바깥은 `--bg-deep` + 상단 중앙 **블루 radial 글로우**(Nodeflow 히어로 행성 문법, 은은하게).
- **오버라인 = pill 뱃지**: 흰 5% bg + `--line` 보더 + 흰 70% 텍스트, 스타버스트는 블루 — Nodeflow 섹션 라벨("About", "Step 1") 문법.
- 카드는 파스텔 로테이션 대신 **동일 surface + 헤어라인 보더**, 액센트는 아이콘/숫자 **틴트 뱃지 로테이션**(블루→그린→퍼플→옐로)으로 표현.

## 5. Components

- **버튼 Primary**: 흰 bg + 검정 700 텍스트, 풀-pill, 높이 48px. hover: 흰 88% + translateY(-2px). 스피너는 검정(흰 버튼 위 가시성).
- **버튼 Ghost**: 흰 10% bg + `--line` 보더 pill, 흰 텍스트. hover: 흰 15% + 보더 강조.
- **스텝 내비**: pill — 기본 흰 5% bg + 보더, 흰 70% 텍스트. hover 흰 10%. **현재: 흰색 bg + 검정 텍스트**, num 원은 블루 20% bg + 진블루 텍스트.
- **입력**: `--surface-2` bg + `--line` 보더, 흰 텍스트, radius 12px. focus: `--blue` 보더 + 블루 15% ring. placeholder 흰 40%.
- **입력 카드**(2페이지): `--surface` + `--line` 보더, radius 20px. hover: 보더 `--line-strong` + lift. 아이콘 배지 40px 원 — 틴트 로테이션: 블루20/그린20/퍼플20/옐로 15% bg에 각 액센트 컬러 아이콘.
- **타임라인**(3페이지): 숫자 원 — 틴트 로테이션(블루/그린/퍼플/옐로 20% bg + 컬러 숫자). 카드 `--surface` + 보더, 4(지속)만 `--blue` 30% 보더 강조. 연결선 `--line`.
- **성장목표 배너**(4페이지): `--blue` 솔리드 bg + **검정 텍스트**(Nodeflow 하이라이트 프라이싱 카드 문법), 전구 아이콘 검정. input: 흰 35% bg + 검정 텍스트.
- **매트릭스**: 기간 셀 틴트 로테이션(블루10/그린10/퍼플10 + 각 컬러 700 텍스트). 헤더 흰 70%.
- **요약 카드**: `--surface` + 보더, 기간 pill 흰 10% + 흰 텍스트, dt 라벨 블루.
- **토스트**: `--surface` + 보더, 흰 텍스트, 상태 점(성공 `--green`/오류 `--red`).
- **푸터**: 상단 `--line` 보더, 텍스트 흰 40%, 링크 블루.
- **미디어 패널**(로그인): hero.mp4 루프 영상 유지, radius 20px, `--line` 보더 1px(다크 위 경계).

## 6. Key Effects & Motion (v2/v3 스펙 계승, 색만 교체)

| 모션 | 스펙 |
|---|---|
| 페이지 전환 | fade + translateY(10px), 240ms `cubic-bezier(0.22,1,0.36,1)` |
| 스태거 등장 | 카드 60ms 간격, 각 400ms |
| 버튼 hover | 배경 변화 + translateY(-2px) + 화살표 translateX(4px), 200ms |
| 카드 hover | translateY(-3px) + 보더 강조 + `0 10px 24px rgba(0,0,0,.4)`, 220ms |
| 입력 focus | 블루 보더 + 틴트 ring, 180ms |
| 배경 글로우 | 정적(애니메이션 없음 — 다크에서 움직이는 글로우는 어지러움) |
| 토스트/스피너 | 기존 동일 (Primary 스피너만 검정) |
| reduced-motion | 루프·전환 전부 해제 |

## 7. Responsive / Accessibility (계승)

- 375/768/1024/1440 브레이크포인트, 모바일 1열·타임라인 세로·매트릭스 스택, 가로 스크롤 금지.
- 라벨 연결·`aria-current`·focus-visible(블루 2px ring)·SVG 아이콘 전용·`prefers-reduced-motion`.

## 8. Anti-Patterns (금지)

- AI 보라/핑크 그라데이션 배경 — Nodeflow는 솔리드 다크 + 미묘한 단색 글로우만.
- 순수 검정(#000) 배경 — 반드시 네이비 틴트(#0C0E18 계열).
- 다크 위 저대비 텍스트(흰 40% 미만은 장식·플레이스홀더 전용).
- 채도 높은 면적 큰 컬러 블록(액센트는 틴트 뱃지·보더·포인트로만; 예외는 성장목표 배너 1곳).

## 9. Pre-Delivery Checklist

- [ ] SVG 아이콘/장식만 사용(이모지 없음)
- [ ] 모든 인터랙션 요소 focus-visible 링 + `cursor: pointer`
- [ ] 본문 대비 4.5:1 이상 (다크 surface 위 포함)
- [ ] `prefers-reduced-motion` 대응
- [ ] 375/768/1024 반응형 + 가로 스크롤 없음
- [ ] 기능 무변경 확인(로그인·저장·로드·프리필·draft 동작 동일)
- [ ] 흰 버튼 위 스피너 가시성
