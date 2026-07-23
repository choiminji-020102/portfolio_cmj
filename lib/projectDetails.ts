/*
  min-hyuk 스타일 경량 프로젝트 상세.
  월간지(lib/projects.ts)는 문제·기능·챌린지·다이어그램의 깊은 구조를 쓰고,
  이쪽은 스크린샷 갤러리 + 기능 불릿 + 트러블슈팅의 가벼운 구조를 쓴다.

  screenshots 가 비어 있으면 갤러리는 플레이스홀더를 보여준다 — 자료가 오면 채운다.
*/
export interface Trouble {
  title: string;
  body: string;
  image?: string;
}

/* 핵심 AI 기능 — 문제 → 해결 → 수치 구조 */
export interface AiFeature {
  name: string;
  metric?: string; // 강조 수치 (정확도 96.8% 등)
  problem: string; // 왜 필요한가
  solution: string; // 어떻게 해결했나 (데이터·모델·출력)
  image?: string; // 관련 앱 스크린샷
  diagram?: "rag"; // 구조 다이어그램 종류
}

export interface LightProject {
  slug: string;
  title: string;
  badge: string;
  period: string;
  teamSize: string;
  summary: string;
  stack: string[];
  github?: string;
  homepage?: string;
  /** homepage 버튼 라벨. 기본값 '홈페이지' */
  homepageLabel?: string;
  screenshots: string[];
  /** 왜 만들었나 — 문제 배경 */
  background?: string;
  /** 팀 구성과 역할. mine: true 인 항목이 본인 */
  team?: { name: string; role: string; mine?: boolean }[];
  /** 핵심 AI 기능 상세 (문제→해결→수치) */
  aiFeatures?: AiFeature[];
  features: string[];
  /** 기존 서비스 대비 차별점 */
  differentiators?: string[];
  /** 활용한 공공데이터·외부 데이터 */
  dataSources?: string[];
  troubles?: Trouble[];
}

export const lightProjects: LightProject[] = [
  {
    slug: "sodam",
    title: "소담소담",
    badge: "창업경진대회 · 우수상",
    period: "2025.04 — 2025.06",
    teamSize: "3인 팀 프로젝트",
    summary:
      "센서 없이, 앱의 AI 분석만으로 젖소를 관리하는 소규모 낙농가 전용 서비스. 비싼 스마트팜 장비 대신 공공데이터와 AI로 질병 진단·생산성 예측을 대체하고, 도메인 특화 RAG 챗봇 '소담이'를 직접 설계했습니다.",
    stack: [
      "Flutter",
      "LangChain",
      "LangGraph",
      "FastAPI",
      "YOLOv8",
      "OpenAI GPT",
    ],
    github: "https://github.com/BlackCows-Team",
    homepage: "https://blackcows-team.github.io/blackcows-privacy/index.html",
    homepageLabel: "소개 페이지",
    screenshots: [
      "/sodam/home.png",
      "/sodam/lumpy.png",
      "/sodam/mastitis.png",
      "/sodam/milk.png",
    ],
    background:
      "소규모 젖소농가(50두 미만)는 3년 새 15%가 폐업할 만큼 빠르게 사라지고 있습니다. 원인은 ICT 스마트팜의 높은 도입 장벽(설치비용 부담 35.6%)과 청년 후계자 부재였습니다. 팀원의 외삼촌이 운영하던 20두 소규모 젖소농장의 폐업 경험에서 출발해, 비싼 센서 장비 없이도 앱의 AI 분석만으로 소규모 농가가 기술 격차 없이 농장을 운영할 수 있게 만드는 것을 목표로 했습니다.",
    team: [
      { name: "최민지", role: "AI 예측 모델 · AI 챗봇 개발 (팀장)", mine: true },
      { name: "SeulGi0117", role: "백엔드 개발 · DevOps" },
      { name: "BogyunJeong", role: "프론트엔드 개발 · UI/UX" },
    ],
    aiFeatures: [
      {
        name: "AI 챗봇 '소담이'",
        metric: "RAG · Query Routing",
        problem:
          "범용 챗GPT는 낙농 도메인에서 환각(없는 정보를 지어냄)·최신 정보 미반영·전문 용어 혼동 문제가 있어, 농가가 믿고 쓸 수 없었습니다.",
        solution:
          "낙농 전문 문서(이미지·PDF·텍스트)를 임베딩해 Vector DB에 저장하고, 질문과 관련된 문서를 먼저 검색해 그 내용을 근거로 답변하는 RAG 구조를 적용했습니다. 답변에는 항상 출처를 함께 표시합니다. LangChain 기반 Agent로 질문을 '낙농 전문 지식 / 농장 기록 조회 / 일반 대화 / 무관 질문' 4가지 유형으로 자동 분류(Query Routing)하고, Prompt Engineering으로 GPT에 '낙농 상담사' 역할을 부여해 사용자 연령대·상황에 맞게 설명 방식을 조절했습니다. 과거 대화 히스토리 기반의 1:1 상담 UI와 앱 어디서나 부르는 떠다니는 챗봇 버튼도 함께 구현했습니다.",
        diagram: "rag",
        image: "/sodam/chatbot-demo.png",
      },
      {
        name: "럼피스킨병 AI 진단",
        metric: "테스트 정확도 96.8%",
        problem:
          "럼피스킨병은 제1종 가축전염병으로 젖소에 치명적입니다(유량 감소·유산·불임). 젖소 발병률이 육우보다 5.4배 높아 조기 발견이 중요합니다.",
        solution:
          "소의 피부 상태를 촬영해 업로드하면 사전 학습된 YOLOv8 분류 모델이 감염 여부를 분석합니다. 젖소 피부 이미지 약 2,000장으로 추가 학습해 '정상 / 럼피스킨병 의심' 2개 클래스로 분류하고, 위험도와 신뢰도 수치를 함께 표시합니다. 의심 시에는 수의사 연락 가이드를 안내합니다.",
      },
      {
        name: "유방염 위험도 예측",
        metric: "정확도 83.9%",
        problem:
          "유방염은 젖소에서 가장 흔하고 경제적 손실이 큰 질병입니다. 조기 발견을 놓치면 우유 생산량이 6~20% 감소할 수 있습니다.",
        solution:
          "스마트팜 빅데이터 API를 활용해 착유량·전도율·유지방비율·유단백비율·산차수를 분석합니다. 체세포수 데이터 유무에 따라 2가지 분석 모드를 제공하며, '정상 / 주의 / 염증 가능성'을 확신도·모델 정확도와 함께 4단계로 판정합니다.",
      },
      {
        name: "착유량 예측",
        metric: "모델 설명력 82.4%",
        problem:
          "착유량은 젖소 건강과 농장 수익성의 대표 지표입니다. 데이터 기반 예측은 한 해 평균 10% 내외의 수익 변동을 미리 대비할 수 있게 합니다.",
        solution:
          "착유 횟수·전도율·환경 온도·유지방비율·유단백비율·사료 섭취량·착유기 측정일자를 회귀 모델로 분석해 향후 착유량을 예측합니다. 예측 착유량과 함께 AI 확신도·모델 설명력을 제공해 결과의 신뢰 수준을 투명하게 보여줍니다.",
      },
    ],
    features: [
      "센서 없는 AI 예측 6종 — 착유량·유방염·유성분 품질·사료 효율·분만·교배 타이밍을 앱 분석만으로 제공",
      "홈 대시보드 — 소 상태 요약(정상·주의·이상)과 전체 소 현황을 한 눈에 확인",
      "이표번호로 젖소 등록 — 축산물이력제 공공데이터 연동으로 12자리 이표번호만 입력하면 자동 등록",
      "10가지 상세 기록 관리 — 건강검진·백신·체중·치료·발정·인공수정·임신감정·분만·착유·사료급여",
    ],
    differentiators: [
      "젖소 전용 낙농 특화 — 기존 서비스는 축우 전반·시장 정보 제공 위주인 반면, 소담소담은 젖소에 특화된 유일한 관리 솔루션",
      "기록이 저장에 그치지 않고 AI 예측과 챗봇에 직접 활용됨",
      "이표번호 등록 없이도 즉시 사용 가능",
    ],
    dataSources: [
      "축산물통합이력정보 API (축산물품질평가원) — 이표번호로 젖소 자동 등록",
      "스마트팜 빅데이터 API (농림수산식품교육문화정보원) — 생산성 예측 모델",
      "젖소 피부질병 오픈 이미지 (Kaggle) — 럼피스킨병 진단 모델 학습",
      "낙농 전문기관 공개 지식 — RAG 챗봇 지식 베이스",
    ],
  },
];

export function getLightProject(slug: string): LightProject | undefined {
  return lightProjects.find((p) => p.slug === slug);
}

export const lightProjectSlugs = lightProjects.map((p) => p.slug);
