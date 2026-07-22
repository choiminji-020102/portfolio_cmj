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
    teamSize: "팀 프로젝트",
    summary:
      "낙농업 종사자를 위한 도메인 특화 RAG 챗봇을 Flutter 앱에 탑재한 통합 관리 어플리케이션. LangGraph로 질문 분기와 응답 흐름을 직접 설계했습니다.",
    stack: ["Flutter", "LangChain", "LangGraph", "FastAPI"],
    screenshots: [],
    features: [
      "낙농업 종사자를 위한 도메인 특화 RAG 챗봇 개발",
      "LangGraph로 질문 유형을 분기하고 응답 흐름을 단계별로 직접 설계",
      "Flutter 앱에 챗봇을 탑재해 현장에서 바로 활용",
    ],
  },
];

export function getLightProject(slug: string): LightProject | undefined {
  return lightProjects.find((p) => p.slug === slug);
}

export const lightProjectSlugs = lightProjects.map((p) => p.slug);
