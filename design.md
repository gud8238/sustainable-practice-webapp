# Design System v2 — "Lumina Meadow" (지속가능한 실천방안 세우기 활동지 웹앱)

> UI-UX-pro-max-skill 프로세스(요청 분석 → 스타일 탐색 → 규칙·안티패턴 필터 → 시스템 산출 → 사전 검증)로 전면 개정.
> 레퍼런스: 사용자 제공 "Lumina" 로그인 화면 (라임 그린 초원, 흰 플로팅 컨테이너, 귀여운 우파루파 마스코트, 라운드 프렌들리 타이포).
> 스타일 분류: **Soft UI Evolution + Playful Illustration** (교육 도메인과 잘 어울리는 따뜻하고 격려하는 무드).

## 1. Concept

"성장의 초원을 걷는 여정". 배경은 봄 들판의 라임 그린, 콘텐츠는 크게 떠 있는 흰 카드(플로팅 셸),
마스코트(새싹 우파루파 '루미')가 로그인 화면에서 선생님을 맞이한다. 모든 페이지가 같은 셸 안에서 전환된다.

## 2. Pattern (페이지 구조)

- **Floating Shell**: 라임 그라데이션 + 미세 도트 텍스처 배경 위에 radius 32px 흰 셸이 떠 있음. 셸 안에 헤더(로고·스텝 내비·사용자)와 콘텐츠.
- **① 로그인**: 셸 내부 2분할 — 좌: 인사 헤드라인+이름 입력 폼 / 우: 라운드(24px) SVG 일러스트 패널(하늘·언덕·나무·길·마스코트). 모바일에선 일러스트가 상단 배너로 축소.
- **② 실천로드맵**: 2×2 흰 카드 그리드(라임 아이콘 배지), 스태거 등장.
- **③ 실천흐름**: 4단계 타임라인 — 연라임 카드, 숫자 뱃지 1~3 그린 / 4 옐로 액센트.
- **④ 로드맵 완성**: 라임 그라데이션 성장목표 배너(전구 아이콘) + 3×3 흰 셀 그리드 + 저장 후 요약 카드.

## 3. Colors

| 역할 | 토큰 | 값 | 용도 |
|---|---|---|---|
| Primary | `--grass-500` | `#84B622` | CTA 버튼, 활성 스텝, 로고 |
| Primary-deep | `--grass-600` | `#6C9A15` | hover, 아이콘 배지 |
| Secondary | `--leaf-700` | `#4C6B1F` | 헤드라인, 카드 타이틀 |
| Background | `--meadow-100` | `#EBF4C4` | 페이지 배경(그라데이션 하단) |
| Text | `--ink-800` | `#38432E` | 본문 |

보조: `--meadow-50 #F6FADF`(배경 상단), `--lime-100 #F0F7D4`(연카드), `--lime-200 #E2EFB4`(뱃지 배경), `--sun-400 #F5CE42`(옐로 액센트), `--sky-300 #A9D9F2`(일러스트 하늘), `--cloud #FFFFFF`, `--surface #FFFFFF`(셸/카드), `--field #F5F5F0`(입력 필드 fill), `--ink-500 #75806A`(보조 텍스트), `--red-500 #E05252`(오류), `--blush #F7C6C0`(마스코트 볼).

- 대비: `--ink-800` on `--surface` ≈ 10:1, 버튼 white on `--grass-500` 은 굵은(700) 15px 이상만 사용, 본문급엔 `--grass-600` 이상. 검증 항목에 포함.
- 다크모드 범위 외(`color-scheme: light`).

## 4. Typography

- **Display**: `Jua` (Google Fonts, 한글 라운드체) — 로고, 페이지 헤드라인, 스텝 타이틀, 마스코트 말풍선. 레퍼런스의 둥근 로고 타이포를 한글로 번역한 선택.
- **Body**: `Pretendard Variable` — 본문, 입력, 안내문. 폴백 system-ui 계열.
- 스케일: 로고 22(Jua) / 헤드라인 30(Jua) / 섹션 타이틀 20(Jua) / 카드 타이틀 17(Jua) / 본문·입력 15(Pretendard 400, lh 1.6) / 캡션 13.

## 5. Key Effects & Motion (스킬 규칙: 150–300ms smooth + gentle hover + reduced-motion 필수)

| 모션 | 스펙 |
|---|---|
| 페이지 전환 | fade + translateY(10px), 240ms `cubic-bezier(0.22, 1, 0.36, 1)` |
| 스태거 등장 | 페이지 활성화 시 카드들 60ms 간격 stagger(최대 5개), 각 400ms 동일 커브 |
| 버튼 hover | 배경 진해짐 + translateY(-2px) + 그림자 상승 200ms, 내부 화살표 `→` translateX(4px) |
| 카드 hover | translateY(-3px) + 그림자 상승 220ms |
| 입력 focus | 필드 fill → white, 라임 2px ring, 180ms |
| 마스코트 | 3.2s 상하 4px bobbing 루프, 아가미 잎 2.6s 살랑임(rotate ±6°) |
| 구름 | 두 겹이 40s/55s 좌우 drift 루프 (opacity 낮음, 주의 분산 방지) |
| 토스트 | slide-up 12px + fade 250ms, 2.5s 후 fade-out |
| 저장 중 | 버튼 스피너 700ms linear 회전 |
| reduced-motion | `prefers-reduced-motion: reduce` 시 루프 애니메이션(마스코트·구름) 정지, 전환 0.01ms |

## 6. Components

- **셸**: max-width 1120px, radius 32px, `box-shadow: 0 24px 60px rgba(76,107,31,.14)`, 배경 위 24px 여백.
- **헤더**(셸 상단): 좌 로고(Jua, grass-500) + 부제(캡션) / 중앙 스텝 필: pill 배경 `--lime-100`, 활성은 `--grass-500` 흰 글자, 완료 뱃지는 체크 없이 진라임. 잠김은 40% 투명.
- **버튼**: Primary — 라임 그라데이션(`#9CCB3B→#84B622`), radius 14px, 높이 48px, 흰 700 텍스트, 화살표 포함 가능. Ghost — `--lime-100` fill, `--leaf-700` 텍스트. 모두 `cursor: pointer`.
- **입력**: `--field` fill, 보더 없음, radius 12px, focus 시 white + 라임 ring. placeholder `#A9B199`.
- **입력 카드**: 흰 배경, radius 20px, 얕은 그림자, 라임 원형 아이콘 배지(흰 SVG 스트로크 아이콘), Jua 타이틀, 캡션 안내문.
- **타임라인 카드**: `--lime-100` fill, radius 20px. 숫자 뱃지 40px 원 — 1·2·3 grass, 4 sun-400(글자 ink-800).
- **성장목표 배너**: 라임 그라데이션(`#84B622→#6C9A15`), 흰 텍스트, 전구 SVG, radius 20px.
- **요약 카드**: 흰 카드 + `--lime-100` 기간 pill(ink 텍스트) + dt 라임 라벨.
- **토스트**: 흰 pill + 좌측 상태 점(성공 grass / 오류 red), ink 텍스트, `role=status/alert`.
- **미디어 패널**(로그인): `assets/hero.mp4` 루프 영상(`autoplay muted loop playsinline`, object-fit cover, radius 24px). 자동재생이 차단되면 JS가 가시 상태에서 재생을 재시도. `aria-hidden`, 장식 전용. (v2 초기의 SVG 초원 일러스트를 사용자 제공 영상으로 교체.)
- **푸터**: 셸 하단 슬림 바 — `Develop. 목포AISW교육센터 서찬아 · Connect : rndxmrdl@naver.com`(mailto 링크), 캡션 12px, 상단 라임 보더.

## 7. Responsive

375px(모바일 기준) / 768px(태블릿) / 1024px(데스크톱) / 1440px(셸 여백 확장).
- 모바일: 셸 radius 20px·여백 12px, 로그인 일러스트는 높이 180px 상단 배너, 카드 1열, 타임라인 세로, 매트릭스 기간별 카드 스택(+셀 라벨 표시), 스텝 라벨 숨김.

## 8. Accessibility

- 모든 입력 `<label>`(시각적 또는 sr-only), 스텝 내비 `aria-current="step"`, 일러스트·장식 `aria-hidden="true"`.
- focus-visible: 2px `--grass-600` ring, offset 2px. 이모지 UI 금지(SVG만). 본문 대비 4.5:1+.

## 9. Anti-Patterns (금지)

- AI 보라/핑크 그라데이션, 네온, 유리모피즘 — 무드 파괴.
- 마스코트·구름의 과한 애니메이션(어지러움 유발) — 진폭 4px/±6° 이내 유지.
- 라임 배경 위 저대비 텍스트(라임 위엔 `--leaf-700` 이상만).
- 일러스트를 로그인 외 페이지에 크게 반복(콘텐츠 집중 방해) — 이후 페이지는 셸+카드 중심.

## 10. Pre-Delivery Checklist

- [ ] SVG 아이콘/일러스트만 사용(이모지 없음)
- [ ] 모든 인터랙션 요소 focus-visible 링 + `cursor: pointer`
- [ ] 본문 대비 4.5:1 이상 (라임 배경 위 텍스트 포함)
- [ ] `prefers-reduced-motion` — 루프 정지·전환 제거 확인
- [ ] 375/768/1024 반응형 + 가로 스크롤 없음
- [ ] 스태거·hover·전환이 150–300ms 규칙 내
