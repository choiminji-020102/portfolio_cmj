/*
  경력 · 교육 · 자격 데이터.
  프로젝트 상세는 lib/projects.ts 가 따로 가진다.

  track — 좌측 메타축에 붙는 분류 라벨. 색이 아니라 텍스트로 갈래를 표시한다.
*/
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
    employment: "외주",
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
        text: "매월 3,500건 정기구독 발송 명단을 버튼 한 번으로 생성 — 합포장 누락과 중복 발송 해소",
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
  {
    org: "삼성메디슨",
    employment: "인턴십",
    role: "AI Vision 그룹 — 딥러닝 기반 초음파 영상 진단 기능 개발",
    period: "2024.03 — 2024.08",
    duration: "6개월 · 계약 기간 만료",
    track: "AI · 의료영상",
    points: [
      {
        text: "초음파 영상 Segmentation 모델 성능 개선 — 논문 기반 모듈과 Augmentation 기법을 적용해 PyTorch로 연구 데이터에 최적화된 모델 구축",
        pending: true,
      },
      {
        text: "임상의와 협업해 학습 데이터셋 구축 — 레이블 작성과 기존 데이터 보정으로 품질 개선",
        pending: true,
      },
      {
        text: "영상 처리 알고리즘 기반 자동 레이블링을 구현해 데이터 부족·품질 저하 문제 해소",
        pending: true,
      },
      {
        text: "난포 크기 측정 도구 AddCaliper 개발 (C++, Cubic Spline Interpolation) — 실제 초음파 장비에 적용",
      },
    ],
    stack: ["PyTorch", "Python", "C++", "OpenCV"],
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
    projectSlug: "pm-violation-detection",
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
    date: "2025.09",
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
  /** 카드 썸네일. 없으면 track 기반 플레이스홀더가 표시된다. */
  thumbnail?: string;
}

export const projectCards: ProjectCard[] = [
  {
    title: "월간지 구독관리 시스템",
    summary:
      "출판사의 구독자 관리·발송·정산 수작업을 대체한 내부 관리 시스템. 기획부터 배포까지 단독 수행했고 현재 실서비스로 운영 중입니다.",
    badge: "외주 · 운영 중",
    track: "풀스택",
    period: "2025.10 — 2026.06",
    teamSize: "1인",
    stack: ["FastAPI", "SQLAlchemy", "MySQL", "React", "TypeScript"],
    slug: "magazine-manager",
    thumbnail: "/magazine-manager/after.png",
  },
  {
    title: "다 맡케팅 — 소상공인 AI 마케팅 자동화",
    summary:
      "홍보 쇼츠 자동 제작부터 SNS 게시글·성과 리포트까지 생성형 AI로 연결한 플랫폼. 장면 일관성 유지와 게시글 생성 파이프라인을 직접 설계했습니다.",
    badge: "KT AIVLE · 대상",
    track: "AI · 생성형",
    period: "2025.08 — 2025.09",
    teamSize: "팀 프로젝트",
    stack: ["LangGraph", "GPT-4o", "Flux.1 Kontext", "Seedance", "KoELECTRA", "FastAPI"],
  },
  {
    title: "소담소담 — AI 젖소 관리 앱",
    summary:
      "센서 없이 앱의 AI 분석만으로 젖소를 관리하는 소규모 낙농가 전용 서비스. 비싼 스마트팜 장비를 공공데이터·AI로 대체하고, RAG 챗봇 '소담이'를 직접 설계했습니다.",
    badge: "창업경진대회 · 우수상",
    track: "AI · LLM",
    period: "2025.04 — 2025.06",
    teamSize: "팀 프로젝트",
    stack: ["Flutter", "LangGraph", "YOLOv8", "FastAPI"],
    slug: "sodam",
    thumbnail: "/sodam/lumpy.png",
  },
  {
    title: "킥보드 교통법규 위반 탐지",
    summary:
      "안전모 미착용과 동승자 탑승을 탐지합니다. 라이선스 제약 없는 구조로 YOLOv3를 직접 구현하고 웹 서비스까지 연결했습니다.",
    badge: "NIPA-Google",
    track: "AI · 비전",
    period: "2024.10 — 2024.11",
    teamSize: "팀 프로젝트",
    stack: ["PyTorch", "YOLOv3", "OpenCV", "FastAPI", "React"],
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
    items: ["PyTorch", "YOLOv3", "OpenCV", "Albumentations", "TensorBoard"],
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
