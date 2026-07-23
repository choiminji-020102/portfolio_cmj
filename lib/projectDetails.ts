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
  features: string[];
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
      "소규모 낙농가를 위한 AI 기반 젖소 관리 앱. 비싼 스마트팜 장비 없이도 앱의 AI 분석만으로 질병 진단·생산성 예측을 할 수 있게 만들었습니다. 도메인 특화 RAG 챗봇 '소담이'의 질문 분기 파이프라인을 직접 설계했습니다.",
    stack: [
      "Flutter",
      "LangChain",
      "LangGraph",
      "FastAPI",
      "YOLOv8",
      "OpenAI GPT",
    ],
    screenshots: [
      "/sodam/chatbot.png",
      "/sodam/lumpy.png",
      "/sodam/mastitis.png",
      "/sodam/milk.png",
    ],
    features: [
      "AI 챗봇 '소담이' — RAG로 낙농 전문 문서를 검색해 출처와 함께 답변, 환각(Hallucination) 문제 해소",
      "럼피스킨병 AI 진단 — 젖소 피부 사진 2,000장으로 학습한 YOLOv8 분류 모델, 테스트 정확도 96.8%",
      "유방염 위험도 예측 — 착유량·전도율·유지방비율 등 생체 지표 분석, 정확도 83.9%",
      "착유량 예측 — 착유 횟수·사료 섭취량·환경 온도 기반 회귀 모델, 설명력 82.4%",
      "이표번호로 젖소 등록 — 축산물이력제 공공데이터 연동으로 간편 등록, 10가지 상세 기록 관리",
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
