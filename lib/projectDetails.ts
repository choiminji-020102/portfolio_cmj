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

/* 트러블슈팅·기술적 의사결정 — 처음 접근 → 문제 → 판단·해결 서사 */
export interface TroubleItem {
  title: string;
  body: string[]; // 문단 단위
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
            title: "Query Routing 재설계 — UX 대화가 '무관 질문'으로 튕기던 문제",
            body: [
              "초기 분류기는 낙농 지식 / 농장 소 정보 / 무관 질문 위주로 나눴는데, '저번에 내가 뭐 물었지?', '너 아까 뭐라고 했어?', '진짜야?' 같은 질문이 전부 '무관 질문(irrelevant)'으로 분류돼 '낙농 질문에만 답할 수 있어요'라며 대화가 끊기는 문제가 있었습니다. 낙농 질문은 아니지만 챗봇에는 반드시 필요한 UX형 대화 흐름이었습니다.",
              "노드를 더 늘리는 대신, 4개 노드는 유지하되 역할을 다시 정의했습니다. 낙농 관련 질문은 모두 rag 노드로 단일화하고(문서에서 못 찾으면 GPT 상식으로 폴백), general 노드를 '챗봇으로서의 자연스러운 대화(인사·감정·이전 대화 참조·잡담)' 전담으로 재정의했습니다. 완전히 무관한 질문(로또·날씨·주식)만 irrelevant로 정중히 거절합니다.",
              "이렇게 하니 '낙농 질문을 어디로 보낼지' 고민할 필요가 사라지고(전부 rag 직행), rag가 실패해도 자연스럽게 응답하는 fallback 흐름이 확보돼 분기가 단순해지고 유지보수가 쉬워졌습니다.",
            ],
          },
          {
            title: "RAG가 문서에서 답을 못 찾을 때 — 노드 분기 vs 프롬프트 처리",
            body: [
              "Vector DB에서 질문과 관련된 문서를 못 찾았을 때 어떻게 답할지가 문제였습니다. 두 가지 방법을 두고 비교했습니다. ① LangGraph에 '문서 없음' 노드를 새로 만들어 분기하는 방법, ② rag 노드의 프롬프트 안에서 '자료가 없으면 상식으로 답하라'고 지시하는 방법입니다.",
              "노드 분기는 흐름이 명시적이지만 다시 분기하느라 응답이 느려지고 상태 전달이 복잡해집니다. 프롬프트 처리는 한 번에 끝나 빠르고 유지보수가 쉬우며 '문서 없으면 자유롭게 답변'이라는 의도를 정확히 걸 수 있습니다. 속도·유지보수·의도 제어를 따져 프롬프트 내부 처리를 택했습니다.",
              "최종적으로 rag 프롬프트에 '참고 자료가 비어있거나 답을 찾을 수 없으면 알고 있는 지식·상식으로 답해도 된다'는 규칙을 넣어, 문서 밖 질문에도 대화가 끊기지 않게 했습니다.",
            ],
          },
          {
            title: "대화 메모리 포맷 전환 — dict 누적에서 문자열 리스트로",
            body: [
              "처음에는 대화 기록을 {\"질문\": ..., \"답변\": ...} 형태의 dict 리스트로 계속 누적했습니다. 그런데 이 방식은 기록이 길어질수록 LLM 프롬프트의 context length 한계를 넘길 수 있고, dict 구조를 프롬프트에 넣으면 LLM이 대화 포맷을 학습하기 어려웠습니다.",
              "메모리를 '사용자: …', '소담이: …' 형태의 문자열 리스트로 바꿔, 프롬프트에 넣을 때 그대로 이어붙이기만 하면 LLM이 자연스러운 대화로 인식하게 했습니다. 세션은 (user_id, chat_id) 튜플을 키로 저장해 사용자별·채팅방별로 맥락을 분리했고, 값을 안전하게 꺼내도록 .get(key, []) 패턴을 써서 기록이 없을 때 빈 리스트로 시작하게 했습니다.",
            ],
          },
          {
            title: "LangChain 최신 문법으로 마이그레이션 (LLMChain → LCEL)",
            body: [
              "개발 도중 LLMChain과 .run()이 deprecated 되면서 경고가 떴고, 내부 동작이 의도대로 되지 않는 정황이 있었습니다. 모든 노드를 최신 방식인 LCEL(prompt | llm | StrOutputParser)과 .invoke() 조합으로 전환해, 체인 구성을 명시적으로 만들고 앞으로의 호환성 문제를 없앴습니다.",
            ],
          },
          {
            title: "노드 성격에 맞춘 temperature 차등 설정",
            body: [
              "노드마다 요구되는 성격이 달라 temperature를 다르게 뒀습니다. 질문 분류(classifier)는 흔들리면 안 되므로 0으로 고정해 결정적으로 분류하고, RAG 답변은 근거 기반이되 딱딱하지 않게 0.3, 일반 대화(general)는 40~70대 사용자에게 친근하게 들리도록 0.5로 설정했습니다.",
            ],
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
