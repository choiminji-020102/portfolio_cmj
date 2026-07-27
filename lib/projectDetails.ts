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

/* 해결책을 제목+불릿으로 쪼갠 블록 (챗봇처럼 해결이 여러 갈래일 때) */
export interface SolutionBlock {
  title: string;
  points: string[];
}

/* 트러블슈팅·기술적 의사결정 — 문제 → 해결 → 효과 + 태그 (슬림버전) */
export interface TroubleItem {
  title: string;
  stars?: number; // 중요도 (1~5)
  problem: string;
  solution: string;
  effect: string;
  tags?: string[];
  diagram?: "route"; // 곁들일 다이어그램
}

/* 핵심 AI 기능 — 문제 → 해결 → 수치 구조.
   단순 항목은 problem/solution(문단), 복합 항목은 problemList/solutionBlocks 사용 */
export interface AiFeature {
  name: string;
  tagline?: string; // 기능 한 줄 부제
  metric?: string; // 강조 수치 (정확도 96.8% 등)
  problemLabel?: string; // 문제 섹션 라벨 (기본 "문제")
  problem?: string; // 단순 문제 (한 문단)
  problemList?: string[]; // 여러 문제 불릿
  solutionLabel?: string; // 해결 섹션 라벨 (기본 "해결")
  solution?: string; // 단순 해결 (한 문단)
  solutionBlocks?: SolutionBlock[]; // 여러 갈래 해결 (제목+불릿)
  image?: string; // 관련 앱 스크린샷 (영상 poster로도 사용)
  video?: string; // 시연 영상
  diagram?: "rag"; // 구조 다이어그램 종류
  troubles?: TroubleItem[]; // 트러블슈팅·기술적 의사결정
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
  /** 팀 프로젝트에서 본인이 담당한 역할 */
  myRole?: string;
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
    teamSize: "팀 프로젝트 · AI 파트 담당",
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
    screenshots: ["/sodam/home.png"],
    background:
      "소규모 젖소농가(50두 미만)는 3년 새 15%가 폐업할 만큼 빠르게 사라지고 있습니다. 원인은 ICT 스마트팜의 높은 도입 장벽(설치비용 부담 35.6%)과 청년 후계자 부재였습니다. 팀원의 외삼촌이 운영하던 20두 소규모 젖소농장의 폐업 경험에서 출발해, 비싼 센서 장비 없이도 앱의 AI 분석만으로 소규모 농가가 기술 격차 없이 농장을 운영할 수 있게 만드는 것을 목표로 했습니다.",
    myRole:
      "RAG 챗봇 '소담이'와 4종 AI 예측 모델(럼피스킨병·유방염·착유량·유성분)을 전담 — 데이터 수집·전처리부터 모델 학습, LangChain 기반 Query Routing 설계, 서비스 연동까지 AI 파트 전 과정을 담당했습니다.",
    aiFeatures: [
      {
        name: "AI 챗봇 '소담이'",
        metric: "RAG · Query Routing",
        problemLabel: "기존 챗GPT를 그대로 쓸 때의 한계",
        problemList: [
          "환각(Hallucination) — 낙농 전문 지식을 물으면 근거 없는 답을 지어냄",
          "질병·정책·시세 등 최신 낙농 정보를 반영하지 못함",
          "낙농 전문 용어를 일상 용어와 혼동",
        ],
        solutionLabel: "소담이의 기술적 해결책",
        solutionBlocks: [
          {
            title: "RAG (Retrieval-Augmented Generation)",
            points: [
              "질문 관련 문서를 먼저 검색하고 그 내용을 바탕으로 답변 생성",
              "출처를 함께 표시해 신뢰도 높은 정보 제공",
            ],
          },
          {
            title: "Prompt Engineering",
            points: [
              "GPT에 '낙농 상담사' 역할 부여, 사용자 맞춤형 설명 방식 적용",
              "연령대와 상황에 따라 표현 방식 자동 조절",
            ],
          },
          {
            title: "LangChain 기반 Agent",
            points: [
              "질문을 4가지 유형으로 자동 분류해 맞춤 대응 (Query Routing)",
              "전문 지식·농장 데이터·일상 대화 등 상황별 응답 최적화",
            ],
          },
        ],
        diagram: "rag",
        image: "/sodam/chatbot-demo.png",
        video: "/sodam/videos/chatbot.mp4",
        troubles: [
          {
            title: "배포 환경 벡터 DB 생성 실패 & 재로딩",
            stars: 5,
            problem:
              "로컬에선 되던 RAG가 배포 서버에서 Chroma DB 생성에 실패했고, 캐시가 있어도 질문마다 벡터 DB를 통째로 다시 로딩했습니다.",
            solution:
              "persist 경로를 절대경로 /RAG/chroma → 프로젝트 기준 상대경로로 바꿔 이식성을 확보하고, 함수 진입부에서 매번 실행되던 _vectordb=None 을 제거해 캐시 히트 분기를 복원했습니다. 경로 없음·빈 문서 예외 방어도 추가했습니다.",
            effect:
              "로컬·배포가 동일 경로로 동작하고, 첫 요청 이후에는 벡터 DB를 다시 로딩하지 않습니다(반복 파일 접근·재임베딩 제거).",
            tags: ["배포환경", "캐시", "RAG"],
          },
          {
            title: "질문 라우팅 아키텍처의 진화 (3분류 → 4분류 → 역할 재정의)",
            stars: 5,
            problem:
              "초기 라우팅은 cow_info / general / rag 3분류였습니다. 무관 질문을 걸러내려 irrelevant를 추가했더니, 이번엔 '아까 뭐랬어?' 같은 UX 대화까지 무관 질문으로 오차단됐습니다.",
            solution:
              "노드를 더 만드는 대신 역할을 다시 나눴습니다. rag는 낙농 지식으로 단일화, general은 UX 대화 전담으로 재정의, cow_info는 '그 소·그 아이' 지시어까지 흡수, irrelevant는 완전 무관(로또·주식)에만 한정. LLM이 엉뚱한 라벨을 뱉어도 irrelevant로 떨어지는 방어 코드도 넣었습니다.",
            effect:
              "무관 질문은 LLM 호출 전에 종료되고, UX 대화 오차단이 해소되며, 의도별로 서로 다른 데이터 소스(문서·농장 DB·대화 맥락)에 연결됩니다.",
            tags: ["LangGraph", "아키텍처진화", "의도분류"],
            diagram: "route",
          },
          {
            title: "RAG 검색 실패 시 응답 전략 — 프롬프트냐 노드냐",
            stars: 5,
            problem:
              "사내 문서를 검색해 답하는 RAG에서, 문서에 관련 내용이 없는 no-hit 케이스가 설계에 없어 빈 context가 그대로 프롬프트에 들어가 부실한 답이 나갔습니다.",
            solution:
              "'프롬프트 내부 처리 vs 노드 분기'를 응답 속도·유지보수·의도 제어로 비교했습니다. no-hit는 별도 노드로 분기할 만큼 복잡한 상태 전이가 아니라고 판단해, 프롬프트에 '자료가 없으면 알고 있는 지식으로 답하라'는 조건부 지시를 넣는 fallback을 택했습니다.",
            effect:
              "검색이 실패해도 응답이 비지 않고 지식 기반으로 이어집니다. no-hit용 노드를 추가하지 않아 그래프가 단순하게 유지됐습니다.",
            tags: ["RAG", "Fallback", "의사결정"],
          },
          {
            title: "사용자별·채팅방별 세션 메모리 구조",
            stars: 4,
            problem:
              "한 사용자가 여러 채팅방을 오가고 여러 사용자가 동시에 쓰는데, 메모리가 전역 단일이면 대화 맥락이 섞입니다. dict 저장은 LLM 이해·LangChain 호환 모두 불리했습니다.",
            solution:
              "(user_id, chat_id) 튜플을 키로 세션을 격리하고, .get(key, [])로 키가 없어도 KeyError 없이 빈 세션으로 시작했습니다. 저장 포맷은 dict 대신 '사용자: …', '소담이: …' 화자 접두 문자열 리스트로 두어, 이어붙이면 대화 스크립트 형태가 되게 했습니다.",
            effect:
              "유저·채팅방별 맥락이 격리되고, 대화 스크립트형 포맷 덕에 '그 소·아까 그거' 같은 후속 질문의 맥락이 프롬프트에 자연스럽게 이어집니다.",
            tags: ["Memory", "멀티턴", "세션관리"],
          },
          {
            title: "RAG 출처 표기 반복 개선",
            stars: 4,
            problem:
              "답변에 근거 문서 출처를 붙이자 자잘한 오류가 이어졌습니다. 확장자가 그대로 노출(무언가.pdf)되고, 같은 문서가 중복 표기되고, ** 같은 기호가 날것으로 나가고, 영어 질문에도 한글 '출처:'가 붙었습니다.",
            solution:
              "문서 임베딩 시점부터 확장자를 뗀 파일명만 metadata에 저장하고, 출력은 중복 제거·기호 제거·질문 언어별 분기([출처] / [Source]) 규칙으로 다듬었습니다. 커밋 5건에 걸친 반복 개선입니다.",
            effect:
              "출처가 깔끔한 파일명으로, 중복·기호 없이, 질문 언어에 맞춰 표기됩니다.",
            tags: ["RAG", "응답품질", "다국어"],
          },
        ],
      },
      {
        name: "럼피스킨병 AI 진단",
        metric: "테스트 정확도 96.8%",
        problemLabel: "럼피스킨병의 위협",
        problemList: [
          "제1종 가축전염병으로 젖소에 치명적 — 유량 감소·유산·불임을 유발",
          "젖소 발병률이 육우보다 5.4배 높아 조기 발견이 중요",
        ],
        solutionLabel: "소담소담 솔루션",
        solutionBlocks: [
          {
            title: "데이터셋 (Training / Test · 공개 데이터 2종)",
            points: [
              "Training set — Kaggle·Mendeley 럼피스킨 이미지(정상 700 + 럼피스킨 324) + Kaggle Cow Lumpy Disease(정상 515 + 럼피스킨 421), 약 2,000장",
              "Test set — 두 데이터셋에서 정상·럼피스킨 각 50장씩 균형 있게 구성",
            ],
          },
          {
            title: "AI 모델 개발",
            points: [
              "사전 학습된 YOLOv8 분류 모델을 Training set으로 추가 학습",
              "2개 클래스 분류: 정상 / 럼피스킨병 의심",
              "정확도 96.8% (Test set 기준)",
            ],
          },
          {
            title: "예측 결과 제공 항목",
            points: [
              "정상 여부 및 위험도 표시",
              "신뢰도 수치 제공",
              "의심 시 수의사 연락 가이드 안내",
            ],
          },
        ],
        image: "/sodam/lumpy.png",
        video: "/sodam/videos/lumpy.mp4",
      },
      {
        name: "유방염 위험도 예측",
        tagline: "발병 후 발견, 이미 늦을 수 있습니다.",
        metric: "정확도 83.9%",
        problemLabel: "유방염의 위험",
        problemList: [
          "젖소에서 가장 흔하고 경제적 손실이 큰 질병",
          "조기 발견을 놓치면 우유 생산량이 6~20% 감소",
        ],
        solutionLabel: "소담소담 솔루션",
        solutionBlocks: [
          {
            title: "공공데이터 활용",
            points: ["스마트팜 빅데이터 API (농림수산식품교육문화정보원)"],
          },
          {
            title: "AI 분류 모델 개발",
            points: [
              "데이터 분석: 착유량·전도율·유지방비율·유단백비율·산차수",
              "체세포수 데이터 유무에 따라 2가지 분석 모드 제공",
              "출력: 정상 / 주의 / 염증 가능성 판단 + 확신도 + 모델 정확도",
              "정확도 83.9%",
            ],
          },
        ],
        image: "/sodam/mastitis.png",
        video: "/sodam/videos/mastitis.mp4",
      },
      {
        name: "착유량 예측",
        tagline: "생산량 변화에 미리 대비하세요.",
        metric: "모델 설명력 82.4%",
        problemLabel: "착유량, 왜 중요한가",
        problemList: [
          "젖소 건강과 농장 수익성의 대표 지표",
          "데이터 기반 예측으로 한 해 평균 10% 내외의 수익 변동을 미리 대비",
        ],
        solutionLabel: "소담소담 솔루션",
        solutionBlocks: [
          {
            title: "공공데이터 활용",
            points: ["스마트팜 빅데이터 API (농림수산식품교육문화정보원)"],
          },
          {
            title: "AI 회귀 모델 개발",
            points: [
              "데이터 분석: 착유 횟수·전도율·환경 온도·유지방비율·유단백비율·사료 섭취량·착유기 측정일자",
              "출력: 예측 착유량 + AI 확신도 + 모델 설명력",
              "모델 설명력 82.4% (MAE 3.41 · RMSE 4.94)",
            ],
          },
        ],
        image: "/sodam/milk.png",
        video: "/sodam/videos/milk.mp4",
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
