# 📝 타입리걸 (TypeLegal)

## 📌 프로젝트 소개
타입리걸은 Q&A 기반으로 계약서를 생성해주는 웹 서비스로, 사용자의 답변에 따라 계약 내용 및 후속 질문이 바뀌는 **다이나믹한 작성 경험**을 제공합니다.  
법률 지식이 없는 사람도 계약서를 쉽게 작성할 수 있도록 설계되었으며, **국문/영문 계약서 약 10종**을 작성할 수 있습니다.  
현재 웹사이트에서는 **프리랜서 계약서**를 작성해볼 수 있습니다.

## 🌍 배포 주소
🔗 [www.typelegal.io](https://www.typelegal.io) (체험 id: test@typelegal.io / pw: test12345!)

---

## 📂 프로젝트 구조
```bash
typelegal-app/
│
├── backend/                        # Spring Boot 백엔드 (REST API, 데이터 처리, PostgreSQL)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/typelegal/
│   │   │   │   ├── config          # 보안 설정 (Spring Security, CORS 등)
│   │   │   │   ├── controller      # API 엔드포인트 관리
│   │   │   │   ├── model           # 데이터 모델 (JPA 엔티티)
│   │   │   │   ├── repository      # PostgreSQL 액세스 계층 (Spring Data JPA, JSONB 활용)
│   │   │   │   └── service         # 비즈니스 로직 구현 (조항/질문 데이터 전처리)
│   │   │   ├── resources/          # 환경 변수, DB 설정
│   │   └── test/                   # 테스트 관련 파일
│   └── pom.xml                     # 프로젝트 의존성 관리 (Maven)
│
└── frontend/                       # Next.js 프론트엔드 애플리케이션
    ├── components/                 # 재사용 가능한 UI 컴포넌트
    ├── pages/
    │   ├── api/                    # API 핸들링 (회원/질문/조항 데이터 처리, 이메일 발송 등)
    │   ├── hooks/                  # 커스텀 훅 (페이지 이탈 감지)
    │   ├── index.js                # 랜딩 페이지
    │   ├── dashboard.js            # 회원 대시보드 페이지
    │   ├── draft/                  # 계약서 작성 페이지
    │   └── ...                     # 기타 페이지 (로그인/회원가입 등)
    ├── utils/                      # 유틸 함수 모음 (문자열 처리, 날짜 포맷 등)
    ├── package.json                # 프론트엔드 의존성 및 설정
    └── .eslintrc.json              # 코드 스타일 및 린트 규칙
