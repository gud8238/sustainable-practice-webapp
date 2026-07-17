# Design System — 지속가능한 실천방안 세우기 활동지 웹앱

> UI-UX-pro-max-skill 프로세스(요청 분석 → 스타일/팔레트/타이포 탐색 → 규칙·안티패턴 필터링 → 시스템 산출 → 사전 검증)에 따라 작성.
> 산업 도메인: 교육(교사 연수) / 제품 유형: 폼 기반 활동지 웹앱 / 무드: 신뢰·성장·차분한 격려

## 1. Pattern (페이지 구조)

- **Login-gated 4-step wizard**: 상단 고정 헤더(브랜드 + 스텝 내비 1~4 + 사용자 배지) / 본문 단일 섹션 전환형 SPA.
- 각 스텝은 "안내 헤드라인 → 입력 카드(들) → 저장 CTA" 순서. 저장 후 다음 스텝으로 유도하는 진행형 구조.
- 4스텝: ① 로그인(센터 카드) ② 실천로드맵(2×2 카드 그리드) ③ 실천흐름(4단계 타임라인) ④ 종합 로드맵(배너 + 3×3 그리드 표 + 요약 뷰).

## 2. Style (UI 미학)

- **Soft Editorial / Warm Professional**: 연수 슬라이드(딥그린 + 크림 + 오렌지)의 톤을 계승.
- 큰 라운드(16px 카드, 12px 입력), 얕고 부드러운 그림자, 넉넉한 여백. 장식보다 가독성 우선.
- 배경에 슬라이드의 링 모티프(연그린 원형)를 미세하게 깔아 아이덴티티 유지(장식은 `aria-hidden`).

## 3. Colors (5 core + 토큰)

| 역할 | 토큰 | 값 | 용도 |
|---|---|---|---|
| Primary | `--green-800` | `#14532D` | 헤더, 제목, 아이콘 배지 |
| Secondary | `--green-600` | `#166534` | 보조 버튼, 활성 스텝, 링크 |
| CTA | `--orange-500` | `#EA8A00` | 저장/로그인 버튼, 강조 뱃지 |
| Background | `--cream-50` | `#FDF8F0` | 페이지 배경 |
| Text | `--ink-900` | `#1F2A24` | 본문 텍스트 |

보조 토큰: `--cream-100 #FBEEDD`(카드 배경), `--green-100 #DCEFE3`(타임라인 카드), `--green-50 #EFF7F1`(배경 링), `--line #E5DCCB`(보더), `--white #FFFFFF`, `--red-600 #DC2626`(오류), `--ink-500 #5C6B61`(보조 텍스트).

- 본문 텍스트 대비 4.5:1 이상 유지 (`--ink-900` on `--cream-50` ≈ 12:1, CTA 버튼은 white on `#EA8A00` 대신 `#1F2A24` 사용 금지 → 버튼 텍스트는 white, 대비 확보 위해 `#D97E00`까지 어둡게 조정 가능).
- 다크모드는 범위 외(연수장 프로젝터/개인 기기 라이트 사용 전제). `color-scheme: light` 명시.

## 4. Typography

- **Pretendard Variable** (CDN: jsdelivr `pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css`), 폴백 `system-ui, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`.
- 스케일: 페이지 타이틀 28/700, 섹션 헤드라인 22/700, 카드 타이틀 17/700, 본문·입력 15/400(행간 1.6), 캡션 13/400.
- 자간 미세 축소(-0.01em)로 한글 가독 최적화. 숫자 스텝 뱃지는 700.

## 5. Key Effects

- 전환: 150–250ms `ease-out` (페이지 fade+slide 8px, 버튼 hover 배경/그림자).
- 카드 hover: `translateY(-2px)` + shadow 상승. 클릭 요소 전부 `cursor: pointer`.
- 저장 중: 버튼 비활성 + 인라인 스피너(회전 애니메이션). 토스트: 하단 중앙 slide-up, 2.5초 자동 소멸.
- `prefers-reduced-motion: reduce` 시 모든 transition/animation 해제.

## 6. Components

- **스텝 내비**: 원형 숫자 뱃지 1~4 + 라벨. 상태: 완료(체크, green-600), 현재(orange), 잠김(회색, 비활성). 로그인 전 2~4 비활성.
- **입력 카드**: 크림 배경, 아이콘 배지(딥그린 원 + 흰 SVG 아이콘), 타이틀, 안내 문구(교안 문구 그대로), textarea(min-height 96px, 리사이즈 세로만).
- **타임라인(스텝3)**: 데스크톱 가로 4열(연결선 + 숫자 뱃지 1~3 그린, 4 오렌지 — 슬라이드와 동일), 모바일 세로 스택.
- **로드맵 표(스텝4)**: 상단 성장목표 배너(딥그린 배경, 흰 텍스트, 전구 SVG). 3행(기간) × 3열(실천/지원/성장 점검). 모바일에서는 기간별 카드로 세로 전환.
- **버튼**: Primary(CTA 오렌지, white 텍스트), Ghost(그린 보더). 높이 48px, radius 12px, focus ring `2px solid --green-600 offset 2px`.
- **토스트**: 성공(그린)/오류(레드) 아이콘 + 메시지.
- **입력 필드**: 흰 배경, `--line` 보더, focus 시 그린 보더 + ring.

## 7. Responsive

브레이크포인트: 375px(기준 모바일) / 768px(태블릿: 카드 2열) / 1024px(데스크톱: 최대폭 1040px 센터) / 1440px(여백 확장).

## 8. Accessibility

- 모든 입력에 `<label>` 연결, 스텝 내비는 `<nav aria-label="단계">` + `aria-current="step"`.
- 키보드 포커스 가시화(focus-visible ring). 아이콘은 SVG 인라인(+`aria-hidden`), 이모지 UI 사용 금지.
- 토스트는 `role="status"` (오류는 `role="alert"`).

## 9. Anti-Patterns (금지)

- AI 보라/핑크 그라데이션, 유리모피즘 남용, 네온 컬러 — 교육 도메인 부적합.
- 이모지 아이콘, 저대비 회색 텍스트(#999 미만), 자동 재생 애니메이션.
- 과도한 스텝 잠금(작성 순서 강제 안 함 — 로그인 후 자유 이동).

## 10. Pre-Delivery Checklist

- [ ] SVG 아이콘만 사용(이모지 없음)
- [ ] 모든 인터랙션 요소 focus-visible 링
- [ ] 본문 대비 4.5:1 이상
- [ ] `prefers-reduced-motion` 대응
- [ ] 375/768/1024 반응형 확인
- [ ] 클릭 요소 `cursor: pointer`
