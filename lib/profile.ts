/*
  경력 · 교육 · 자격 데이터.
  프로젝트 상세는 lib/projects.ts 가 따로 가진다.

  contact — 상단바와 하단 Contact 절이 같이 쓴다. 두 군데에 적어두면
  한쪽만 고치는 사고가 나므로 여기 한 벌만 둔다.

  track — 좌측 메타축에 붙는 분류 라벨. 색이 아니라 텍스트로 갈래를 표시한다.
*/
export const contact = {
  email: "t3335150@gmail.com",
  github: "https://github.com/choiminji-020102",
};

export type Track =
  | "AI · 의료영상"
  | "AI · 비전"
  | "AI · LLM"
  | "AI · 생성형"
  | "풀스택"
  | "데이터 · 통계";

export interface Career {
  org: string;
  employment: string;
  role: string;
  period: string;
  duration: string;
  track: Track;
  /** 수치를 담은 성과 불릿. 숫자가 확정되지 않은 항목은 pending 으로 표시한다. */
  points: { text: string; pending?: boolean }[];
  stack: string[];
  /** 프로젝트 섹션에 상세가 있으면 그 slug */
  projectSlug?: string;
}

export const careers: Career[] = [
  {
    org: "(주)선목 도서출판 목자의지혜",
    employment: "프리랜서",
    role: "풀스택 — 기획·설계·개발·배포 단독 수행",
    period: "2025.10 — 2026.06",
    duration: "9개월 · 유지보수 계약 중",
    track: "풀스택",
    projectSlug: "magazine-manager",
    points: [
      {
        text: "구독자 관리·발송·정산 엑셀 수작업을 내부 관리 시스템으로 옮겨 실서비스 운영 중",
      },
      {
        text: "정기구독 3,200건을 관리하며 매월 발송 명단을 버튼 한 번으로 생성 — 합포장 누락과 중복 발송 해소",
      },
      {
        text: "정기구독·단품·VIP 3종 발송 흐름을 단일 출력 구조로 통합하는 그룹화 알고리즘 설계",
      },
      {
        text: "Cafe24 주문 연동에 embed 조회를 적용해 100건 처리 시 수백 회이던 API 호출을 1회로 축소",
      },
      {
        text: "13개 도메인 모델 · 20개 API 라우터, 전 도메인에 소프트 삭제와 감사 로그 적용",
      },
    ],
    stack: [
      "FastAPI",
      "Python",
      "SQLAlchemy",
      "MySQL",
      "React",
      "TypeScript",
      "Vite",
      "TailwindCSS",
    ],
  },
  /*
    삼성메디슨 인턴은 6개월(2024.03.02~08.31) 동안 사수가 바뀌며 담당 과제가
    둘로 나뉜다 — 카드도 그에 맞춰 파트 1 / 파트 2 두 개로 쪼갠다. 기간·팀·
    프로젝트 상세 링크가 서로 다르므로 하나로 합쳐두면 어느 성과가 어느
    기간 것인지 알 수 없다.

    '제품이 안 됐다'가 아니라 '진행 불가 사유를 규명해 보고했다'로 쓴다 —
    같은 사실이지만 전자는 변명, 후자는 판단으로 읽힌다.
  */
  {
    org: "삼성메디슨",
    employment: "인턴 · 파트 1",
    role: "AI Vision 그룹 — 하복부 초음파 다중 구조물 검출",
    period: "2024.03 — 2024.04",
    duration: "2개월",
    track: "AI · 의료영상",
    projectSlug: "samsung-medison",
    points: [
      {
        text: "성능 정체 원인 규명 — 조정과 결과 사이에 일관된 상관이 없다는 점을 근거로 병목이 모델이 아닌 정답 데이터에 있다고 가설 수립, 사내 임상의와 원본 영상·레이블을 함께 검토해 GT 마스크 경계 과다 문제를 확인·보고",
      },
      {
        text: "배포 제약 기준 모델 선정 — 후보 6종을 도메인·태스크 요건과 배포 환경 제약 관점에서 검토해 YOLOv8-seg 채택, AGPL-3.0 라이선스 리스크 규명해 함께 보고",
      },
      {
        text: "학습 검증 도구 구현 — 정규화 레이블 역산 렌더링, GT/예측 병렬 비교, 폴리곤 마스크 렌더링으로 지표만으로는 드러나지 않던 클래스 인덱스 불일치·좌표계 오류 2건 규명",
      },
      {
        text: "데이터 처리 파이프라인 구축 — AVI 프레임 추출 → 영상 단위 대표 크롭(프레임별 contour 최빈값) → GT 생성 → 학습, 영상 87개를 약 3만 장 데이터셋으로 확장",
      },
      {
        text: "GT 레이블 생성 — CVAT XML 파싱의 구조적 한계(프레임 밖 좌표 선별 불가)를 확인하고 클래스별 annotation txt 병합 방식으로 재설계, 크롭본·원본 간 비대칭 좌표계 정합 처리",
      },
    ],
    stack: ["Python", "PyTorch", "YOLOv8", "OpenCV", "CVAT", "TensorRT"],
  },
  {
    org: "삼성메디슨",
    employment: "인턴 · 파트 2",
    role: "산부인과 AI 랩 2D Follicle™ 팀 — 부인과 초음파 난포 세그멘테이션 향상",
    period: "2024.05 — 2024.08",
    duration: "4개월 · 계약 기간 만료",
    track: "AI · 의료영상",
    projectSlug: "samsung-medison-detection",
    points: [
      {
        text: "학습 데이터 구축 — 세그멘테이션 성능 향상을 위해 수천 장 규모 초음파 영상을 선별해 GT 작성·기존 GT 품질 보정(한 차례 2,534장 중 883장 선별), 현재 제품에 탑재된 난포 검출 모델의 학습 데이터 전량이 이 기간에 만든 것",
      },
      {
        text: "모델 개선 실험 — 손실 함수 3방향(Dice·Tversky·Focal Tversky) 비교로 FN 가중 Tversky Loss 채택, 손실 값으로는 드러나지 않는 소형 난포 누락을 잡기 위해 개수 기반 평가 절차를 직접 설계",
      },
      {
        text: "난포 윤곽 측정 기능 개발 (C++) — 검사자가 찍은 4점을 지나는 닫힌 곡선을 자연 3차 스플라인으로 생성, 외부 라이브러리 반입이 불가한 사내 환경이라 직접 구현, 사내 테스트 빌드에 반영해 실제 장비에서 동작 검증",
      },
    ],
    stack: ["C++", "Python", "PyTorch", "OpenCV", "ONNX"],
  },
];

export interface Education {
  org: string;
  program: string;
  detail?: string;
  status: string;
  period: string;
  points: { text: string; pending?: boolean }[];
  stack?: string[];
  projectSlug?: string;
}

export const educations: Education[] = [
  {
    org: "KT AIVLE School",
    program: "7기 · AI 개발자 트랙",
    detail: "KT × 고용노동부",
    status: "수료",
    period: "2025.03 — 2025.09",
    points: [
      { text: "빅프로젝트 대상(1위) 수상", pending: true },
      { text: "미니프로젝트 5건 수행", pending: true },
    ],
  },
  {
    org: "NIPA-Google ML 부트캠프",
    program: "협력 실무 프로젝트",
    detail: "정보통신산업진흥원",
    status: "수료",
    period: "2024.10 — 2024.11",
    points: [
      {
        text: "YOLOv3를 직접 구현해 킥보드 안전모 미착용·동승자 탑승을 탐지하는 시스템 개발",
      },
      {
        text: "AI-Hub 60만 장 규모 PM 데이터셋에서 위반 이미지를 선별하고 전처리 파이프라인 설계",
      },
      {
        text: "학습된 모델을 FastAPI + React 웹 서비스로 연동 — 이미지를 끌어다 놓으면 탐지",
      },
    ],
    stack: ["PyTorch", "YOLOv3", "OpenCV", "FastAPI", "React", "Docker"],
  },
  {
    org: "한림대학교",
    program: "인공지능융합학부 AI의료융합전공",
    detail: "심리학과 복수전공",
    status: "졸업",
    period: "2020.03 — 2025.02",
    points: [
      { text: "총 취득학점 146.0 / 130" },
      { text: "총 평점평균 4.29 / 4.50" },
    ],
  },
];

export interface Award {
  name: string;
  org: string;
  date: string;
  result: string;
}

export const awards: Award[] = [
  {
    name: "농림축산식품 공공데이터 활용 창업경진대회 (제10회)",
    org: "농림축산식품부",
    date: "2025.08",
    result: "우수상",
  },
  {
    name: "AI 보건의료통계분석 경진대회",
    org: "한림대학교",
    date: "2021.11",
    result: "최우수상",
  },
];

export interface Certification {
  name: string;
  org: string;
  date: string;
  number: string;
}

export const certifications: Certification[] = [
  {
    name: "SQL 개발자 (SQLD)",
    org: "한국데이터산업진흥원",
    date: "2025.12",
    number: "SQLD-059000879",
  },
  {
    name: "데이터분석 준전문가 (ADsP)",
    org: "한국데이터산업진흥원",
    date: "2024.03",
    number: "ADsP-040000771",
  },
  {
    name: "사회조사분석사 2급",
    org: "한국산업인력공단",
    date: "2021.08",
    number: "21202241138L",
  },
  {
    name: "TOEIC Speaking IH (140)",
    org: "한국 TOEIC 위원회",
    /* 어학성적은 응시일 기준 — 유효기간 2년도 이 날부터 센다 (2027.09.21까지).
       영구 자격증(SQLD·ADsP 등)은 연월로 충분해 일자를 쓰지 않는다 */
    date: "2025.09.21",
    number: "105290",
  },
];

export interface Paper {
  name: string;
  org: string;
  link: string;
}

export const papers: Paper[] = [
  {
    name: "노인의 스마트폰 사용과 사회활동 참여가 인지기능에 미치는 영향에 대한 연구",
    org: "한국산학기술학회",
    link: "https://www.kais99.org/jkais/journal/Vol23No08/vol23no08p23.pdf",
  },
];

/*
  프로젝트 카드.
  draft: true 인 항목은 화면에 나오지 않는다 — 내용이 채워지면 플래그를 지운다.
  빈 카드를 띄우느니 완성된 것만 보여주는 편이 낫다.
  slug 가 있으면 상세 페이지(app/projects/[slug])로 연결된다.
*/
export interface ProjectCard {
  title: string;
  summary: string;
  /** 어디서 나온 작업인지 — 경력·교육 섹션과 이어주는 배지 */
  badge: string;
  track: Track;
  period: string;
  teamSize: string;
  stack: string[];
  slug?: string;
  draft?: boolean;
  /** 카드 커버 이미지 (2:1, 권장 1280×640). 없으면 track 플레이스홀더가 표시된다. */
  thumbnail?: string;
  /** GitHub 저장소. 있으면 카드에 GitHub 아이콘 링크가 뜬다. */
  github?: string;
  /** 이 프로젝트에서 내가 맡은 범위 — 팀 작업에서 역할이 산문에 묻히지 않게 한다 */
  role?: string;
  /** 어디까지 갔는지 — 성능 지표나 도달점 */
  outcome?: string;
}

export const projectCards: ProjectCard[] = [
  {
    title: "월간지 구독관리 시스템",
    summary:
      "출판사의 구독자 관리·발송·정산 수작업을 대체한 내부 관리 시스템. 기획부터 배포까지 단독 수행했고 현재 실서비스로 운영 중입니다.",
    badge: "프리랜서 · 운영 중",
    track: "풀스택",
    period: "2025.10 — 2026.06",
    teamSize: "1인",
    stack: ["FastAPI", "SQLAlchemy", "MySQL", "React", "TypeScript"],
    slug: "magazine-manager",
    thumbnail: "/covers/magazine-manager.png",
    role: "기획 · 개발 · 배포 단독",
    outcome: "실서비스 운영 중",
  },
  {
    title: "다 맡케팅 — 소상공인 AI 마케팅 자동화",
    summary:
      "홍보 쇼츠 자동 제작부터 SNS 게시글·성과 리포트까지 생성형 AI로 연결한 플랫폼. 장면 일관성 유지와 게시글 생성 파이프라인을 설계·구현했습니다.",
    badge: "KT AIVLE · 대상",
    track: "AI · 생성형",
    period: "2025.08 — 2025.09",
    teamSize: "팀 프로젝트",
    stack: ["LangGraph", "GPT-4o", "Flux.1 Kontext", "Seedance", "KoELECTRA", "FastAPI"],
    slug: "damatketing",
    thumbnail: "/covers/damatketing-v2.png",
    role: "장면 일관성 · 게시글 생성 파이프라인 설계·구현",
    outcome: "쇼츠 제작 → SNS 게시 → 성과 리포트 자동화",
  },
  {
    title: "소담소담 — AI 젖소 관리 앱",
    summary:
      "센서 없이 앱의 AI 분석만으로 젖소를 관리하는 소규모 낙농가 전용 서비스. 스마트팜 장비를 갖추기 어려운 농가도 공공데이터와 AI 모델로 질병을 진단하고 생산성을 예측할 수 있게 했습니다.",
    badge: "창업경진대회 · 우수상",
    track: "AI · LLM",
    period: "2025.04 — 2025.06",
    teamSize: "팀 프로젝트",
    // 상세 페이지(projectDetails.ts)의 stack과 같은 어휘를 쓴다
    stack: [
      "RAG",
      "AI Agent",
      "Query Routing",
      "LangGraph",
      "AI 예측 모델",
      "이미지 분류 · 회귀",
      "YOLOv8",
      "Flutter",
    ],
    slug: "sodam",
    thumbnail: "/covers/sodam.png",
    github: "https://github.com/BlackCows-Team",
    role: "AI 예측 모델 6종 · 럼피스킨 진단 · RAG 챗봇",
    outcome: "럼피스킨 96.8% · 유방염 83.9%",
  },
  {
    title: "부인과 초음파 난포 검출 — 2D Follicle™",
    summary:
      "여러 개의 난포 크기를 한 화면에서 자동 측정하는 부인과 초음파 AI 기능. 세그멘테이션 성능을 올리기 위해 학습 데이터 구축·모델 개선 실험·측정 기능(C++) 개발 세 갈래로 참여했고, 그렇게 만든 데이터가 현재 제품에 탑재된 검출 모델의 학습 데이터로 쓰이고 있습니다.",
    badge: "삼성메디슨 · 인턴",
    track: "AI · 의료영상",
    period: "2024.05 — 2024.08",
    teamSize: "2D Follicle™ 팀",
    stack: ["C++", "Python", "PyTorch", "OpenCV", "ONNX"],
    slug: "samsung-medison-detection",
    thumbnail: "/covers/samsung-medison-detection.png",
    role: "학습 데이터 구축 · 모델 개선 실험 · 측정 기능(C++) 개발",
    outcome: "제품 탑재 모델의 학습 데이터 전량 구축",
  },
  {
    title: "초음파 다중 구조물 검출",
    summary:
      "하복부 초음파 영상에서 6개 구조물을 검출하는 과제. 학습을 반복하며 시각화 도구·GT 생성 함수·데이터 처리 파이프라인을 직접 만들었고, 성능이 정체되자 원인을 추적해 병목이 모델이 아니라 정답 데이터에 있음을 규명했습니다.",
    badge: "삼성메디슨 · 인턴",
    track: "AI · 의료영상",
    period: "2024.03 — 2024.04",
    teamSize: "단독 수행",
    stack: [
      "Python",
      "PyTorch",
      "OpenCV",
      "YOLOv8",
      "Instance Segmentation",
      "CVAT",
      "TensorRT",
    ],
    slug: "samsung-medison",
    thumbnail: "/covers/samsung-medison-v2.png",
    role: "학습 데이터 구축 · 검증 도구 개발",
    outcome: "성능 병목을 정답 데이터로 규명",
  },
  {
    title: "KT AIVLE 미니프로젝트",
    summary: "",
    badge: "KT AIVLE",
    track: "AI · 비전",
    period: "2025",
    teamSize: "",
    stack: [],
    draft: true,
  },
];

export const skillGroups = [
  {
    name: "AI · 머신러닝",
    caption: "모델을 직접 구현하고 데이터에 맞게 최적화합니다",
    items: ["PyTorch", "YOLOv3", "YOLOv8", "OpenCV", "Albumentations", "TensorBoard"],
  },
  {
    name: "백엔드",
    caption: "도메인 규칙을 코드로 옮기고 무결성을 지킵니다",
    items: ["FastAPI", "Python", "SQLAlchemy", "MySQL", "JWT", "C++"],
  },
  {
    name: "프론트엔드",
    caption: "관리자가 매일 쓰는 화면을 만듭니다",
    items: ["React", "TypeScript", "Next.js", "TailwindCSS", "React Query"],
  },
  {
    name: "데이터 · 협업",
    caption: "분석 근거를 남기고 기록을 공유합니다",
    items: ["SQL", "통계 분석", "Docker", "Git", "Figma"],
  },
];
