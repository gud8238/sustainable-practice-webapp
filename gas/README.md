# GAS(Apps Script) 코드 반영 가이드

웹앱(프론트엔드)은 이미 아래 배포 URL을 호출하도록 설정되어 있습니다.
**이 가이드대로 코드를 반영하고 "같은 배포"에 새 버전을 올리면** 웹앱이 바로 동작합니다.

- 스프레드시트: https://docs.google.com/spreadsheets/d/14tYk1n65EDeCfmF95YDAeBwsxUcFNhruwMdvGU-boD0/edit
- 배포 URL: `https://script.google.com/macros/s/AKfycbzqnZTGhijnsCVQmBblgQlBg6EWkOv3N5BaFmhYKX_0hI74hDbO2ghYuoF2ud2-HPiNMA/exec`

## 반영 절차

1. 스프레드시트 열기 → 상단 메뉴 **확장 프로그램 → Apps Script**
2. 편집기의 기존 `Code.gs` 내용을 **전부 지우고**, 이 폴더의 [`Code.gs`](./Code.gs) 내용을 붙여넣기 → 저장(Ctrl+S)
3. 우측 상단 **배포 → 배포 관리** → 기존 배포(연필 아이콘) 편집 → **버전: 새 버전** 선택 → **배포**
   - ⚠️ "새 배포"를 만들면 URL이 바뀌므로 반드시 **기존 배포의 새 버전**으로 배포하세요.
   - 웹 앱 설정: 실행 계정 **나**, 액세스 권한 **모든 사용자**
4. 브라우저에서 아래 주소를 열어 시트 탭 자동 생성:
   ```
   https://script.google.com/macros/s/AKfycbzqnZTGhijnsCVQmBblgQlBg6EWkOv3N5BaFmhYKX_0hI74hDbO2ghYuoF2ud2-HPiNMA/exec?action=setup
   ```
   → `{"ok":true,"message":"setup complete"}` 가 보이면 성공. 시트에 `auth / roadmap / flow / final` 4개 탭이 생깁니다.
5. **auth 탭** A열 2행부터 연수 참여 선생님 이름을 입력합니다. (여기 있는 이름만 로그인 가능. `테스트교사`는 테스트용 샘플이며 지워도 됩니다.)

## API 요약

| 요청 | 설명 |
|---|---|
| `GET ?action=setup` | 4개 탭 + 헤더 생성 |
| `GET ?action=login&name=이름` | 명단 대조 로그인 |
| `GET ?action=load&name=이름` | 세 활동지 데이터 일괄 로드 |
| `POST` `{action:"save", sheet:"roadmap"\|"flow"\|"final", name, data}` | 저장(이름 기준 upsert) |

POST 본문은 `Content-Type: text/plain` 의 JSON 문자열입니다(GAS CORS 제약 회피용 — 프론트엔드에 이미 구현됨).
