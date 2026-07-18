# Design System v3 — "Kidora Bright" (지속가능한 실천방안 세우기 활동지 웹앱)

> UI-UX-pro-max-skill 프로세스(요청 분석 → 스타일 탐색 → 규칙·안티패턴 필터 → 시스템 산출 → 사전 검증)로 개정.
> 레퍼런스: 사용자 지정 Framer 프로젝트 **Kidora**(교육 템플릿, 프로젝트 ID `myj9gfbiKATWtYAZUD5r`)에서
> Framer Agent CLI로 **실제 컬러 스타일·텍스트 스타일·홈 화면**을 추출해 그대로 토큰화함.
> 원칙: **디자인 스타일만 반영.** HTML 구조·JS 로직·GAS 연동·배포는 v2에서 변경하지 않는다.

## 1. Concept

"밝고 따뜻한 교육 브랜드". 웜 크림 캔버스 위에 파스텔 카드가 리듬감 있게 배치되고,
검정 볼드 헤딩이 명확한 위계를 만든다. 딥 퍼플 CTA와 그린·앰버 액센트, 스타버스트(✳) 장식이 포인트.

## 2. Colors (Kidora 컬러 스타일 실측값)

| 역할 | 토큰 | 값 | Kidora 원본 스타일명 |
|---|---|---|---|
| Page | `--page` | `#FCFAED` | Page Color |
| Card 1 (민트) | `--card-mint` | `#D7FDCF` | Card Color 01 |
| Card 2 (라벤더) | `--card-lav` | `#EBE1FD` | Card Color 02 |
| Card 3 (피치) | `--card-peach` | `#FEEECD` | Card Color 03 |
| CTA | `--purple` | `#520080` | Logo Background 02 |
| Accent | `--green` | `#09D89A` | Logo Background 01 |
| Accent 2 | `--amber` | `#FCB520` | Logo Background 03 |
| Heading | `--ink` | `#000000` | Black Color |
| Body | `--para` | `#575757` | Paragraph Color |
| Border | `--border` | `#D5D5D5` | Border Color |
| Error | `--warn` | `#FF2244` | Warining |

보조: `--white #FFFFFF`, `--purple-hover #3E0061`(퍼플 hover 심화), `--purple-tint rgba(82,0,128,.08)`(focus ring).

- 대비: 검정 헤딩 on 크림 ≈ 19:1, `--para` on 크림 ≈ 5.4:1, 흰 텍스트 on 퍼플 ≈ 12:1 — 모두 4.5:1 이상.
- 앰버·그린 위 텍스트는 검정만 사용(흰색 금지 — 대비 부족).
- 다크모드 범위 외(`color-scheme: light`).

## 3. Typography (Kidora 텍스트 스타일 실측값)

- **Heading**: `Plus Jakarta Sans`(700/800, Google Fonts) + 한글 폴백 `Pretendard Variable` — Kidora H1~H6과 동일 계열. 검정.
- **Body**: `Nunito Sans`(400/600/700) + `Pretendard Variable` — Kidora Body 스타일과 동일.
- v2의 Jua(라운드체)는 **제거** — Kidora는 모던 지오메트릭 볼드 스타일.
- 스케일(웹앱 규모에 맞게 Kidora 비율 축소): 헤드라인 32/800/1.15, 로그인 h1 38/800, 섹션 라벨(오버라인) 13/700 대문자풍, 카드 타이틀 18/700, 본문·입력 15/400(lh 1.6), 캡션 13.

## 4. Pattern (구조 변화 없음, 스킨만)

- 플로팅 셸 유지하되 **셸 배경을 크림(#FCFAED)**으로, 페이지 배경은 크림을 살짝 어둡게(`#F5F2E3`) — Kidora의 풀-크림 캔버스 느낌.
- 페이지 헤드에 **오버라인 라벨**(스타버스트 SVG + 소제목) 추가 — Kidora의 "● ABOUT US" 섹션 라벨 문법.
- 카드는 **파스텔 3색 로테이션**(민트→라벤더→피치→흰+보더), radius 24px, 플랫(기본 그림자 없음, hover 시만 얕은 그림자).

## 5. Components

- **버튼 Primary**: 딥 퍼플 풀-pill(radius 999px), 흰 700 텍스트, 높이 48px. hover: `--purple-hover` + translateY(-2px). 화살표 슬라이드 모션 유지.
- **버튼 Ghost**: 흰 배경 + `--border` 1.5px 보더 pill, 검정 텍스트. hover: 검정 보더.
- **스텝 내비**: pill — 비활성 흰+보더, hover 크림, **현재 딥 퍼플**(흰 글자). step-num 원은 현재일 때 앰버 배경+검정 숫자.
- **입력**: 흰 배경 + `--border` 보더, radius 14px. focus: 퍼플 보더 + `--purple-tint` ring.
- **입력 카드**(2페이지): 파스텔 로테이션 bg, 보더 없음. 아이콘 배지 40px 원 — 그린/퍼플/앰버/검정 순환(흰 아이콘, 앰버는 검정 아이콘).
- **타임라인**(3페이지): 숫자 원 — 1·2·3 검정 bg 흰 숫자, 4(지속) 앰버 bg 검정 숫자. 카드 bg 민트/라벤더/피치/흰+퍼플 1.5px 보더. 연결선 `--border`.
- **성장목표 배너**(4페이지): 딥 퍼플 bg, 흰 텍스트, 전구 아이콘 앰버 — Kidora의 "Join our community" 퍼플 섹션 문법.
- **매트릭스**: 기간 셀 파스텔 로테이션(민트/라벤더/피치) + 검정 700 텍스트. 셀 textarea 흰+보더.
- **요약 카드**: 파스텔 로테이션 bg, 기간 pill은 검정 bg 흰 텍스트, dt 라벨은 퍼플.
- **토스트**: 흰 pill + 보더, 상태 점(성공 그린/오류 `--warn`), 검정 텍스트.
- **푸터**: 유지, 보더 `--border`, 링크 퍼플.
- **미디어 패널**(로그인): hero.mp4 루프 영상 유지(v2와 동일), radius 24px.
- **스타버스트 장식**: 8각 별 SVG(그린/앰버), 오버라인 라벨 앞과 로그인 헤드라인 옆에 소형으로만 사용.

## 6. Key Effects & Motion (v2 스펙 계승, 색만 교체)

| 모션 | 스펙 |
|---|---|
| 페이지 전환 | fade + translateY(10px), 240ms `cubic-bezier(0.22,1,0.36,1)` |
| 스태거 등장 | 카드 60ms 간격, 각 400ms 동일 커브 |
| 버튼 hover | 배경 심화 + translateY(-2px) + 화살표 translateX(4px), 200ms |
| 카드 hover | translateY(-3px) + `0 10px 24px rgba(0,0,0,.08)`, 220ms |
| 입력 focus | 퍼플 보더 + 틴트 ring, 180ms |
| 스타버스트 | 로그인 장식만 24s 저속 회전(진폭 낮음) |
| 토스트/스피너 | v2 동일 |
| reduced-motion | 루프·전환 전부 해제 |

## 7. Responsive / Accessibility (v2 계승)

- 375/768/1024/1440 브레이크포인트, 모바일 1열·타임라인 세로·매트릭스 카드 스택, 가로 스크롤 금지.
- 라벨 연결·`aria-current`·focus-visible(퍼플 2px ring)·SVG 아이콘 전용(이모지 금지)·`prefers-reduced-motion`.

## 8. Anti-Patterns (금지)

- AI 보라/핑크 **그라데이션** — Kidora는 플랫 솔리드 퍼플만 사용. 그라데이션 버튼 금지.
- 파스텔 위 저대비 회색 텍스트(#9D9D9D 미만은 장식 전용).
- 앰버/그린 배경 위 흰 텍스트.
- 과도한 장식(스타버스트 남발) — 페이지당 2~3개 이하.

## 9. Pre-Delivery Checklist

- [ ] SVG 아이콘/장식만 사용(이모지 없음)
- [ ] 모든 인터랙션 요소 focus-visible 링 + `cursor: pointer`
- [ ] 본문 대비 4.5:1 이상 (파스텔 카드 위 포함)
- [ ] `prefers-reduced-motion` 대응
- [ ] 375/768/1024 반응형 + 가로 스크롤 없음
- [ ] 기능 무변경 확인(로그인·저장·로드·프리필·draft 동작 동일)
