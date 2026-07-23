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
  screenshots: string[];
  /** 왜 만들었나 — 문제 배경 */
  background?: string;
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
    teamSize: "팀 프로젝트 · 팀장",
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
    screenshots: [
      "/sodam/home.png",
      "/sodam/chatbot.png",
      "/sodam/lumpy.png",
      "/sodam/mastitis.png",
      "/sodam/milk.png",
    ],
    background:
      "소규모 젖소농가(50두 미만)는 3년 새 15%가 폐업할 만큼 빠르게 사라지고 있습니다. 원인은 ICT 스마트팜의 높은 도입 장벽(설치비용 부담 35.6%)과 청년 후계자 부재였습니다. 팀원의 외삼촌이 운영하던 20두 소규모 젖소농장의 폐업 경험에서 출발해, 비싼 센서 장비 없이도 앱의 AI 분석만으로 소규모 농가가 기술 격차 없이 농장을 운영할 수 있게 만드는 것을 목표로 했습니다.",
    features: [
      "AI 챗봇 '소담이' — RAG로 낙농 전문 문서를 검색해 출처와 함께 답변, Query Routing으로 질문을 4가지 유형으로 자동 분류",
      "럼피스킨병 AI 진단 — 젖소 피부 사진 2,000장으로 학습한 YOLOv8 분류 모델, 테스트 정확도 96.8%",
      "유방염 위험도 예측 — 착유량·전도율·유지방비율 등 생체 지표 분석, 정확도 83.9%",
      "착유량 예측 — 착유 횟수·사료 섭취량·환경 온도 기반 회귀 모델, 설명력 82.4%",
      "센서 없는 AI 예측 6종 — 착유량·유방염·유성분 품질·사료 효율·분만·교배 타이밍을 앱 분석만으로 제공",
      "홈 대시보드 & 젖소 기록 관리 — 이표번호로 간편 등록(축산물이력제 연동), 건강검진·백신·번식 등 10가지 상세 기록",
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
    troubles: [
      {
        title: "기존 GPT의 한계 → RAG + Query Routing 으로 해결",
        body:
          "범용 GPT는 낙농 도메인에서 환각(없는 정보를 지어냄)·최신 정보 미반영·전문 용어 혼동 문제가 있었습니다. 이를 해결하기 위해 낙농 전문 문서를 임베딩해 Vector DB에 저장하고, 질문과 관련된 문서를 먼저 검색해 그 내용을 근거로 답변하는 RAG 구조를 적용했습니다. 답변에는 항상 출처를 함께 표시해 신뢰도를 높였습니다. 나아가 LangChain 기반 Agent로 사용자 질문을 '낙농 전문 지식 / 농장 기록 조회 / 일반 대화 / 무관 질문' 4가지 유형으로 자동 분류(Query Routing)해, 상황별로 응답 경로를 최적화했습니다.",
      },
    ],
  },
];

export function getLightProject(slug: string): LightProject | undefined {
  return lightProjects.find((p) => p.slug === slug);
}

export const lightProjectSlugs = lightProjects.map((p) => p.slug);
