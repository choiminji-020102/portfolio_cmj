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

/* 풀버전 상세 — 문서 순서 그대로 섞이는 블록들 */
export type TroubleBlock =
  | { type: "sub"; text: string } // 굵은 소제목 (1. 2. 등)
  | { type: "text"; text: string } // 문단
  | { type: "code"; code: string } // 코드 블록
  | { type: "list"; items: string[] } // 불릿 리스트
  | { type: "table"; head: string[]; rows: string[][] } // 표
  | {
      // 왼쪽 설명 + 오른쪽 작은 캡처 (학습 결과 그래프·리포트)
      type: "split";
      text: string;
      images: { src: string; width: number; height: number; alt: string }[];
      caption?: string;
    };

export interface TroubleDetail {
  heading: string; // 큰 섹션 제목 (문제 상황 / 원인 분석 / 해결 과정 …)
  blocks: TroubleBlock[];
}

/* 트러블슈팅·기술적 의사결정 — 슬림(문제→해결→효과) + 풀버전(details) */
export interface TroubleItem {
  title: string;
  problem: string;
  solution: string;
  effect: string;
  tags?: string[];
  tech?: string[]; // 풀버전 상단 기술 스택
  diagram?: "route"; // 곁들일 다이어그램
  details?: TroubleDetail[]; // 아코디언 풀버전
}

/* 핵심 AI 기능 — 문제 → 해결 → 수치 구조.
   단순 항목은 problem/solution(문단), 복합 항목은 problemList/solutionBlocks 사용 */
export interface AiFeature {
  name: string;
  tagline?: string; // 기능 한 줄 부제
  when?: string; // 작업 시점 (타임라인이 있는 프로젝트에서 항목을 짚어준다)
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
  /** troubles 섹션 라벨. 기본값 '트러블슈팅 · 기술적 의사결정' */
  troublesLabel?: string;
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
  /** 과제 개요 — 대상·클래스·데이터·태스크 같은 사실 항목 */
  overview?: { label: string; value: string }[];
  /** overview 섹션 라벨. 기본값 '과제 개요' */
  overviewLabel?: string;
  /** 작업 타임라인 — 시점별로 무엇을 만들었는지 */
  timeline?: { when: string; what: string }[];
  /** 타임라인 아래 붙는 단서 문장 */
  timelineNote?: string;
  /** 배경 섹션 라벨. 기본값 '제안 배경' */
  backgroundLabel?: string;
  /** 왜 만들었나 — 문제 배경, 리드 1줄(위기 진술) */
  background?: string;
  /** 제안 배경 — 리드 2줄(위기가 낳은 결과, 화살표로 연결) */
  backgroundEffect?: string;
  /** 제안 배경 — 시작점(폐업 양극화)을 보여주는 그래프 이미지 */
  backgroundChart?: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  /** 제안 배경 — 문제(폐업 가속)가 갈라지는 원인 갈래 */
  backgroundCauses?: {
    index: string;
    title: string;
    stat: string;
    statLabel: string;
    /** 해당 원인을 뒷받침하는 그래프·실태조사 이미지 (선택) */
    image?: {
      src: string;
      width: number;
      height: number;
      alt: string;
      /** 최대 폭 제한 Tailwind 클래스 (기본 w-full) */
      maxWidthClass?: string;
    };
    /** 이미지 대신 HTML로 그리는 실태조사 인용 카드 (선택) */
    surveyCard?: { title: string; quote: string; source?: string };
    /** 이미지 대신 HTML로 그리는 가로 막대그래프 (선택) — label 있는 세그먼트만 범례로 표시 */
    barChart?: { segments: { value: number; label?: string }[] };
  }[];
  /** 제안 배경 — 프로젝트의 개인적 출발점(계기) */
  backgroundOrigin?: string;
  /** 제안 배경 — 우리가 세운 목표 */
  backgroundGoal?: string;
  /** 팀 프로젝트에서 본인이 담당한 역할 (리드 문장) */
  myRole?: string;
  /** 내가 맡은 역할 — 담당 축(영역) */
  myRoleAreas?: { title: string; desc: string }[];
  /** 내가 맡은 역할 — 작업 범위(순서) */
  myRolePipeline?: string[];
  /** 핵심 AI 기능 상세 (문제→해결→수치) */
  aiFeatures?: AiFeature[];
  /** aiFeatures 섹션 라벨. 기본값 '핵심 AI 기능' */
  aiFeaturesLabel?: string;
  features: string[];
  /** features 섹션 라벨. 기본값 '그 외 기능' */
  featuresLabel?: string;
  /** 기존 서비스 대비 차별점 */
  differentiators?: string[];
  /** 활용한 공공데이터·외부 데이터 */
  dataSources?: string[];
  troubles?: Trouble[];
  /** 마무리 회고 — 결과가 아니라 무엇이 남았는지 */
  closing?: string[];
  /** closing 섹션 라벨. 기본값 '마무리' */
  closingLabel?: string;
  /** 작업 중 정리한 외부 글(기술 블로그 등) — 본문에서 덜어낸 상세의 근거 */
  writeups?: { title: string; href: string }[];
  /** writeups 섹션 라벨. 기본값 '작업 기록' */
  writeupsLabel?: string;
}

export const lightProjects: LightProject[] = [
  /*
    다 맡케팅 상세 — 뼈대만 세운 상태.
    아래 서술은 lib/profile.ts 카드(summary·role·outcome·stack)에서 확인된 범위로만 작성했다.
    비워 둔 것: 스크린샷, 성능 지표, 트러블슈팅, 팀 규모·본인 파트의 정확한 경계,
    Seedance·KoELECTRA를 어디에 썼는지. 자료가 오면 채운다.
  */
  {
    slug: "damatketing",
    title: "다 맡케팅",
    badge: "KT AIVLE · 대상",
    period: "2025.08 — 2025.09",
    teamSize: "팀 프로젝트",
    summary:
      "소상공인의 홍보 쇼츠 제작부터 SNS 게시글 작성, 성과 리포트까지를 생성형 AI로 이어 붙인 마케팅 자동화 플랫폼입니다. 저는 장면이 흔들리지 않게 붙잡는 일관성 유지와 게시글 생성 파이프라인을 설계·구현했습니다.",
    stack: [
      "LangGraph",
      "GPT-4o",
      "Flux.1 Kontext",
      "Seedance",
      "KoELECTRA",
      "FastAPI",
    ],
    screenshots: [],
    backgroundLabel: "과제 배경",
    background:
      "소상공인에게 마케팅은 본업 밖의 일입니다 — 홍보 영상 제작, SNS 게시, 성과 확인이 저마다 다른 도구와 시간을 요구합니다.",
    backgroundEffect:
      "이 세 단계를 생성형 AI로 하나의 흐름에 묶는 것이 과제의 목표였습니다.",
    myRole:
      "생성형 AI 파이프라인 중 두 축을 맡아 설계부터 구현까지 진행했습니다. 여러 장면으로 나뉘는 쇼츠에서 인물·배경이 장면마다 달라지지 않게 붙잡는 일, 그리고 만들어진 콘텐츠를 SNS 게시글로 바꾸는 생성 파이프라인을 만드는 일입니다.",
    myRoleAreas: [
      {
        title: "장면 일관성 유지",
        desc: "쇼츠가 여러 장면으로 나뉘어도 인물·배경이 유지되도록 이미지 생성 단계를 설계·구현",
      },
      {
        title: "게시글 생성 파이프라인",
        desc: "제작된 홍보 콘텐츠를 SNS 게시글로 변환하는 생성 흐름을 LangGraph로 구현",
      },
    ],
    myRolePipeline: [
      "장면 분할·프롬프트 설계",
      "참조 기반 이미지 생성",
      "게시글 생성 체인 구성",
      "파이프라인 연결",
    ],
    // 앞에 '핵심 AI 기능' 섹션이 없으므로 '그 외 기능' 기본 라벨을 쓰지 않는다
    featuresLabel: "주요 기능",
    features: [
      "홍보 쇼츠 자동 제작",
      "SNS 게시글 자동 생성",
      "마케팅 성과 리포트",
    ],
  },
  {
    slug: "sodam",
    title: "소담소담",
    badge: "창업경진대회 · 우수상",
    period: "2025.04 — 2025.06",
    teamSize: "팀 프로젝트 · AI 파트 담당",
    summary:
      "센서 없이, 앱의 AI 분석만으로 젖소를 관리하는 소규모 낙농가 전용 서비스입니다. 스마트팜 장비를 갖추기 어려운 농가도 공공데이터와 AI 모델만으로 질병을 진단하고 생산성을 예측할 수 있게 했고, 낙농 도메인에 특화한 RAG 챗봇 '소담이'를 설계·구현했습니다.",
    // 담당한 일의 개념(RAG·Agent·예측)을 앞에, 구현 기술을 뒤에.
    // 직접 만들지 않은 영역(DB 설계·인프라)은 싣지 않는다
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
    github: "https://github.com/BlackCows-Team",
    homepage: "https://blackcows-team.github.io/blackcows-privacy/index.html",
    homepageLabel: "소개 페이지",
    screenshots: ["/sodam/home.png"],
    backgroundLabel: "과제 배경",
    background: "낙농업의 위기 — '소규모 농가가 버틸 수 없는 구조'",
    backgroundEffect: "소규모 젖소농가 폐업 속도 가속화",
    backgroundChart: {
      src: "/sodam/background-farm-decline.png",
      width: 1870,
      height: 1269,
      alt: "사육 규모별 젖소농가 수 변화 그래프 (2021년 대비 2024년)",
    },
    backgroundCauses: [
      {
        index: "1",
        title: "ICT 스마트팜 도입의 높은 장벽",
        stat: "35.6%",
        statLabel: "도입 시 겪은 어려움 1위 — 설치비용 확보",
        barChart: {
          segments: [
            { value: 35.6, label: "설치비용 확보" },
            { value: 7.2, label: "낮은 기술 이해도" },
            { value: 6.1 },
            { value: 5 },
          ],
        },
      },
      {
        index: "2",
        title: "청년 후계자 부재 · 진입 어려움",
        stat: "31.7%",
        statLabel: "청년·후계농 초기 정착 어려움 1위 — 영농 기술 습득 부족",
        surveyCard: {
          title: "2024 낙농경영실태조사",
          quote:
            "중·소규모 경영일수록 '후계자도 없고 육성계획도 없다'는 응답 비율이 높았고, 후계자 없는 고령농가와 상당수 낙농가가 폐업을 강요받고 있다.",
          source: "농림축산식품부 · 낙농가 2,040명 설문",
        },
      },
    ],
    backgroundOrigin:
      "팀원의 외삼촌이 운영하던 20두 규모의 소규모 젖소농장이 문을 닫았습니다. 이 폐업 경험이 프로젝트의 출발점이 됐습니다.",
    backgroundGoal:
      "비싼 센서 장비 없이 앱의 AI 분석만으로, 소규모 농가가 비용·기술 격차 없이 농장을 운영할 수 있게 하는 것.",
    myRole:
      "소담소담의 AI 파트를 혼자 전담했습니다. 챗봇·이미지 진단·예측 모델 세 축을, 데이터 수집부터 서비스 연동까지 전 과정에 걸쳐 만들었습니다.",
    myRoleAreas: [
      {
        title: "RAG 챗봇 '소담이'",
        desc: "LangChain·LangGraph 기반 Query Routing 설계로 낙농 상담 챗봇 구현",
      },
      {
        title: "럼피스킨병 이미지 진단",
        desc: "피부 병변 이미지 기반 질병 진단 모델 (테스트 정확도 96.8%)",
      },
      {
        title: "AI 예측 모델 6종",
        desc: "유방염·착유량·유성분 등 생산성·질병 예측 모델 학습·비교",
      },
    ],
    myRolePipeline: [
      "데이터 수집·전처리",
      "모델 학습·비교",
      "Query Routing 설계",
      "서비스 연동",
    ],
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
          {
            title: "모델 선택 (GPT-4o-mini)",
            points: [
              "RAG로 답변 근거를 검색된 문서에서 가져와 모델의 자체 지식 의존도가 낮아, 상위 모델 없이도 충분한 품질이라 판단",
              "classifier 분류·노드 분기 등 다단계 호출을 거치는 구조라, 응답이 빠른 모델이 대화형 UX에 유리하다고 판단",
              "여기에 비용 효율까지 더해 GPT-4o-mini 채택",
            ],
          },
        ],
        diagram: "rag",
        image: "/sodam/chatbot-demo.png",
        video: "/sodam/videos/chatbot.mp4",
        troubles: [
          {
            title: "질문 라우팅 아키텍처 재설계를 통한 응답 품질 개선",
            problem:
              "모든 질문을 하나의 응답 흐름에서 처리해 데이터 소스가 혼재됐고, 무관 질문을 차단하는 과정에서는 정상적인 UX 대화까지 함께 차단되는 Over-blocking이 발생했습니다.",
            solution:
              "Intent Classifier와 LangGraph 조건부 라우팅으로 질문을 역할별 노드(RAG·Cow Info·General·Irrelevant)에 분기하고, general 노드의 책임을 재정의해 UX 대화를 분리했습니다.",
            effect:
              "질문 유형별 데이터 소스가 명확히 분리돼 답변 품질이 안정화됐고, 서비스 정체성과 사용자 경험을 모두 유지하는 라우팅 구조를 구축했습니다.",
            tags: ["LangGraph", "라우팅설계", "의도분류", "RAG"],
            tech: ["LangGraph", "LangChain", "OpenAI GPT-4o-mini", "Python"],
            diagram: "route",
            details: [
              {
                heading: "문제 상황",
                blocks: [
                  {
                    type: "text",
                    text: "소담이 챗봇은 하나의 서비스 안에서 성격이 서로 다른 질문을 처리해야 했다.",
                  },
                  {
                    type: "list",
                    items: [
                      "낙농 일반 지식",
                      "사용자 농장의 특정 소 정보 조회",
                      "챗봇과의 자연스러운 대화",
                    ],
                  },
                  {
                    type: "text",
                    text: "초기에는 질문 유형을 구분하지 않고 하나의 응답 흐름에서 모든 질문을 처리했다.",
                  },
                  { type: "text", text: "이로 인해 두 가지 문제가 발생했다." },
                  {
                    type: "text",
                    text: "1. \"103번 소 상태 알려줘.\"(사용자 농장의 특정 소 조회)와 \"젖소 발정 주기는?\"(일반 지식)처럼 필요한 데이터 소스가 서로 다른 질문이 같은 경로에서 처리되어 답변 품질이 일정하지 않았다.",
                  },
                  {
                    type: "text",
                    text: "2. \"로또 번호 알려줘.\", \"오늘 점심 뭐 먹지?\"처럼 서비스와 무관한 질문에도 일반 LLM이 그대로 응답하면서 낙농 전문 챗봇이라는 서비스 정체성이 흐려졌다.",
                  },
                ],
              },
              {
                heading: "원인 분석",
                blocks: [
                  {
                    type: "text",
                    text: "문제의 원인은 질문의 의도(Intent)를 먼저 판별하는 단계가 없었다는 것이었다.",
                  },
                  { type: "text", text: "질문마다 필요한 데이터 소스는 서로 달랐다." },
                  {
                    type: "table",
                    head: ["질문 유형", "필요한 데이터"],
                    rows: [
                      ["낙농 일반 지식", "RAG 문서 검색"],
                      ["특정 소 조회", "농장 DB"],
                      ["자연스러운 대화", "대화 Context"],
                    ],
                  },
                  {
                    type: "text",
                    text: "하지만 질문을 구분하지 않고 하나의 응답 흐름으로 처리하면서 적절한 데이터 소스를 선택하지 못했다.",
                  },
                  {
                    type: "text",
                    text: "결국 질문의 의도보다 응답 생성이 먼저 이루어지는 구조 자체가 문제였다.",
                  },
                ],
              },
              {
                heading: "해결 과정",
                blocks: [
                  { type: "sub", text: "1. 질문 분류(Classifier)를 독립 노드로 분리" },
                  {
                    type: "text",
                    text: "먼저 응답 생성 이전에 질문의 의도를 분류하는 classify_question_route 노드를 LangGraph 그래프의 시작 단계에 추가하였다.",
                  },
                  {
                    type: "text",
                    text: "질문 분류는 창의성보다 항상 동일한 결과를 반환하는 일관성이 중요하다고 판단하여 temperature=0으로 설정하였다.",
                  },
                  { type: "code", code: `llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0
)

chain = prompt | llm | StrOutputParser()

result = chain.invoke({
    "question": state["current_question"]
})` },
                  {
                    type: "text",
                    text: "분류 결과는 다음 네 가지 중 하나만 반환하도록 설계하였다.",
                  },
                  {
                    type: "list",
                    items: ["rag", "cow_info", "general", "irrelevant"],
                  },
                  { type: "sub", text: "2. 질문 유형별로 전용 노드에 라우팅" },
                  {
                    type: "text",
                    text: "분류 결과에 따라 LangGraph의 add_conditional_edges()를 이용하여 질문을 서로 다른 처리 노드로 연결하였다.",
                  },
                  { type: "code", code: `builder.add_conditional_edges(
    "classifier",
    route_by_answer_type,
    {
        "rag": "rag_response",
        "cow_info": "cow_info_graph",
        "general": "general_response",
        "irrelevant": "irrelevant_response",
    }
)` },
                  { type: "text", text: "각 노드는 하나의 책임만 수행하도록 설계하였다." },
                  {
                    type: "table",
                    head: ["질문 유형", "처리 방식"],
                    rows: [
                      ["rag", "RAG 문서 검색"],
                      ["cow_info", "농장 DB 조회"],
                      ["general", "UX 대화"],
                      ["irrelevant", "서비스와 무관한 질문 차단"],
                    ],
                  },
                  {
                    type: "text",
                    text: "이를 통해 질문의 의도를 먼저 분류한 뒤, 적절한 데이터 소스로 라우팅하는 구조를 만들 수 있었다.",
                  },
                  { type: "sub", text: "3. 새로운 문제 발생 : Over-blocking" },
                  {
                    type: "text",
                    text: "하지만 실제 테스트 과정에서 예상하지 못한 문제가 발생했다.",
                  },
                  {
                    type: "text",
                    text: "서비스와 무관한 질문만 차단하려고 추가했던 irrelevant가",
                  },
                  {
                    type: "list",
                    items: ["\"고마워.\"", "\"너 누구야?\"", "\"내가 아까 뭐 물어봤지?\""],
                  },
                  {
                    type: "text",
                    text: "같은 챗봇으로서 자연스럽게 응답해야 하는 UX 대화까지 모두 차단하고 있었다.",
                  },
                  {
                    type: "text",
                    text: "결과적으로 \"낙농 관련 질문에만 답변할 수 있습니다.\"라는 응답이 반환되면서 사용자 경험이 오히려 저하되었다.",
                  },
                  {
                    type: "text",
                    text: "즉, 무관한 질문만 차단하려 했지만 정상적인 UX 대화까지 함께 차단하는 Over-blocking 문제가 발생한 것이다.",
                  },
                  { type: "sub", text: "4. 해결 방법 검토" },
                  {
                    type: "text",
                    text: "처음에는 UX 대화를 처리하는 새로운 노드를 추가하는 방법도 고려하였다.",
                  },
                  {
                    type: "text",
                    text: "그러나 문제를 분석해 보니 처리 노드가 부족한 것이 아니라 질문 유형의 경계가 잘못 정의되어 있다는 점이 원인이었다.",
                  },
                  {
                    type: "text",
                    text: "노드를 계속 추가하면 그래프만 복잡해지고 역할이 중복될 수 있었다.",
                  },
                  {
                    type: "text",
                    text: "따라서 새로운 노드를 만드는 대신 기존 노드의 책임을 다시 정의하는 방향을 선택하였다.",
                  },
                  { type: "sub", text: "5. General 노드의 역할 재정의 (핵심)" },
                  {
                    type: "text",
                    text: "기존에는 general 노드를 단순한 일반 대화 정도로 정의하고 있었다.",
                  },
                  {
                    type: "text",
                    text: "이를 \"낙농 질문은 아니지만 챗봇으로서 반드시 응답해야 하는 UX 대화 전담 노드\"로 역할을 재정의하였다.",
                  },
                  {
                    type: "text",
                    text: "최종적으로 질문 유형의 경계를 다음과 같이 다시 설계하였다.",
                  },
                  {
                    type: "list",
                    items: [
                      "낙농 관련 질문 → rag",
                      "사용자 농장의 특정 소 조회 → cow_info",
                      "기억, 감사, 인사, 챗봇 소개 등 자연스러운 UX 대화 → general",
                      "로또, 주식, 정치 등 서비스와 무관한 질문 → irrelevant",
                    ],
                  },
                  {
                    type: "text",
                    text: "이를 통해 irrelevant는 진짜 무관한 질문만 처리하고, \"내가 아까 뭐 물어봤지?\", \"고마워.\"와 같은 질문은 general로 라우팅되어 정상적으로 응답할 수 있도록 경계를 명확하게 재설계하였다.",
                  },
                  { type: "sub", text: "6. Cow 정보 분류 기준 정밀화" },
                  {
                    type: "text",
                    text: "멀티턴 대화에서 개체 조회가 자연스럽게 이어질 수 있도록 cow_info 분류 기준도 함께 개선하였다. (커밋 : 0de1fea, 37f642e)",
                  },
                  { type: "text", text: "기존에는 \"103번 소\" 정도만 인식했지만, 다음과 같은 표현도 모두 cow_info로 분류하도록 확장하였다." },
                  {
                    type: "list",
                    items: ["12자리 이표번호", "그 소", "그 아이"],
                  },
                  {
                    type: "text",
                    text: "이를 통해 \"103번 소 상태 알려줘.\" → \"그 소 어제 분만했어?\"와 같은 후속 질문도 동일한 개체 조회 흐름으로 정확하게 라우팅할 수 있도록 개선하였다.",
                  },
                  { type: "sub", text: "7. LLM 오출력 방어" },
                  {
                    type: "text",
                    text: "질문 분류를 LLM이 수행하기 때문에 정의되지 않은 문자열이 반환될 가능성도 고려하였다.",
                  },
                  {
                    type: "text",
                    text: "따라서 정의된 네 가지 유형 외의 값이 반환되면 irrelevant로 처리하도록 방어 로직을 추가하였다.",
                  },
                  { type: "code", code: `if result not in {
    "rag",
    "cow_info",
    "general",
    "irrelevant"
}:
    result = "irrelevant"` },
                  {
                    type: "text",
                    text: "이를 통해 예상하지 못한 출력에도 그래프가 안정적으로 동작하도록 구성하였다.",
                  },
                ],
              },
              {
                heading: "적용 결과",
                blocks: [
                  {
                    type: "list",
                    items: [
                      "질문을 응답 생성 이전에 먼저 분류하고, 분류 결과에 따라 적절한 데이터 소스로 연결하는 라우팅 아키텍처를 구축하였다.",
                      "서비스와 무관한 질문은 사전에 차단하여 낙농 전문 챗봇이라는 서비스 정체성을 유지할 수 있었다.",
                      "general 노드의 역할을 재정의하여 Over-blocking 문제를 해결하고 자연스러운 UX 대화를 유지할 수 있었다.",
                      "지시어와 12자리 이표번호까지 인식하도록 분류 기준을 확장하여 멀티턴 대화의 정확도를 향상시켰다.",
                      "질문 유형과 처리 노드의 책임을 명확하게 분리하여 새로운 질문 유형이 추가되더라도 분류 규칙과 처리 노드만 확장하면 되는 구조를 갖추었다.",
                    ],
                  },
                ],
              },
              {
                heading: "배운 점",
                blocks: [
                  {
                    type: "text",
                    text: "이번 트러블슈팅에서 가장 중요했던 것은 질문을 4가지로 분류한 것 자체가 아니라, 라우팅 구조를 설계하는 과정에서 발생한 문제를 다시 설계로 해결한 경험이었다.",
                  },
                  {
                    type: "text",
                    text: "처음에는 irrelevant를 추가하면 서비스와 무관한 질문을 해결할 수 있을 것이라 생각했다. 하지만 실제 테스트 과정에서 정상적인 UX 대화까지 차단되는 부작용을 확인했고, 원인이 노드의 개수가 아니라 질문 유형의 경계와 각 노드의 책임 정의에 있다는 점을 발견했다.",
                  },
                  {
                    type: "text",
                    text: "이를 해결하기 위해 새로운 노드를 계속 추가하는 대신 기존 노드의 역할을 재정의하여 그래프 구조를 단순하게 유지하면서도 사용자 경험과 확장성을 함께 확보할 수 있었다.",
                  },
                  {
                    type: "text",
                    text: "또한 LLM 기반 라우팅에서는 분류 정확도뿐 아니라 예상하지 못한 출력에 대한 방어 로직까지 함께 설계해야 안정적인 서비스를 구축할 수 있다는 점을 경험했다.",
                  },
                ],
              },
            ],
          },
          {
            title:
              "이표번호를 모르면 대화가 끊기던 소 정보 조회 — 단일 노드에서 상태 기반 서브그래프로",
            problem:
              "소 정보 조회가 단일 노드로 구현돼 있어, 질문에 12자리 이표번호가 없으면 안내 메시지만 남기고 대화가 종료됐다(코드 분기상 처리율 0%).",
            solution:
              "LangGraph 서브그래프로 분리해 소 식별·목록 fallback·선택·카테고리 질의·상세 응답 5개 노드로 책임을 나누고, selected_cow_info 유무를 조건부 엣지로 평가해 이표번호를 아는 사용자는 목록 단계를 건너뛰게 했다.",
            effect:
              "cow_info 처리 노드가 1개 → 5개로 늘어나는 동안 메인 그래프는 5개 그대로 유지됐고, 이표번호 없이도 목록 → 선택 경로가 생겼다(대신 코드량은 344줄 1파일 → 387줄 3파일로 늘고, 되묻기 한 턴이 추가됨).",
            tags: ["서브그래프분리", "상태관리", "폴백설계", "책임분리"],
            tech: [
              "LangGraph (Subgraph · Conditional Edge · State)",
              "Firebase Firestore",
              "Python",
            ],
            details: [
              {
                heading: "문제 상황",
                blocks: [
                  {
                    type: "text",
                    text: "소담이 챗봇의 소 정보 조회는 처음에 단일 노드 하나로 구현되어 있었다. 질문에서 12자리 이표번호를 추출해 Firestore에서 소를 찾고, 키워드(착유·발정·건강·백신·체중 등)로 사용자가 원하는 기록 유형을 추측해 최근 기록 1건을 반환하는 구조였다.",
                  },
                  { type: "text", text: "이 구조는 두 지점에서 무너졌다." },
                  { type: "sub", text: "1. 이표번호가 없으면 대화가 그 자리에서 끊겼다" },
                  {
                    type: "code",
                    code: `# ab1c23e — generate_farmdata_response (그래프 노드 라벨: generate_cow_info_answer)
ear_tag_number = extract_ear_tag_number(question)
if not ear_tag_number:
    answer = "어떤 소에 대해 질문하시는지 12자리 이표번호(귀표번호)를 질문에 포함해 주세요."
    return {**state, "current_answer": answer}   # ← 여기서 흐름 종료`,
                  },
                  {
                    type: "text",
                    text: "\"어제 분만한 소 누구야?\", \"우리 농장 소 정보 알려줘\"처럼 개체를 특정하지 않은 질문은 전부 이 분기로 빠져 거부 메시지만 남기고 끝났다. 성공률을 측정할 필요도 없이 코드 분기상 이표번호 없는 질문은 처리율 0%였다. 사용자가 12자리 숫자를 외우고 있어야만 쓸 수 있는 챗봇이었다.",
                  },
                  { type: "sub", text: "2. 키워드 추측이 자주 빗나갔다" },
                  {
                    type: "text",
                    text: "정보 종류를 if \"착유\" in question, elif \"발정\" in question 식의 키워드 매칭으로 판단했다. 사용자가 쓰는 표현이 예상 키워드와 어긋나면 엉뚱한 기록을 반환했다. 조용히 틀린 답을 주는 쪽이, 못 찾았다고 말하는 것보다 나빴다.",
                  },
                ],
              },
              {
                heading: "원인 분석",
                blocks: [
                  {
                    type: "text",
                    text: "두 문제의 뿌리는 같았다. 여러 턴에 걸쳐야 할 조회 과정을 상태 없는 단일 모듈에 밀어 넣은 것이다.",
                  },
                  { type: "text", text: "실제 조회 흐름을 풀어보면 이렇다." },
                  {
                    type: "code",
                    code: `소 특정 → (실패 시) 후보 목록 제시 → 사용자 선택 → 정보 종류 선택 → 상세 응답`,
                  },
                  {
                    type: "text",
                    text: "이 흐름은 본질적으로 중간 상태를 요구한다. 후보 목록이 무엇이었는지, 사용자가 어떤 소를 골랐는지를 다음 단계로 넘겨야 하는데, 단일 노드에는 이 상태를 담을 자리가 없었다.",
                  },
                  {
                    type: "text",
                    text: "문제는 파일 크기에서도 드러났다. Firebase 실연동을 거치며 cow_info_response.py는 99줄에서 344줄로 3.5배 비대해졌고, 그 안에서 8개 함수가 이표번호 추출·DB 조회·카테고리 분류·응답 빌드를 모두 떠안고 있었다.",
                  },
                  {
                    type: "text",
                    text: "주목할 점은 이 코드가 깊게 중첩되어 있지는 않았다는 것이다(최대 3단계). 문제는 복잡도의 깊이가 아니라 넓이였다. 한 모듈이 서로 다른 관심사 여러 개를 나란히 쥐고 있어서, \"소를 못 찾으면 목록을 보여주고 고르게 하자\"는 개선 하나를 넣으려 해도 조회·분류·응답 코드를 모두 헤집어야 했다.",
                  },
                ],
              },
              {
                heading: "해결 방법 비교",
                blocks: [
                  {
                    type: "table",
                    head: ["방법", "장점", "단점"],
                    rows: [
                      [
                        "단일 모듈에 조건 분기 추가",
                        "구현 비용 최소",
                        "관심사가 더 섞임, 분기 추가마다 전체 재검증",
                      ],
                      [
                        "메인 챗봇 그래프에 노드 5개 직접 추가",
                        "흐름은 분리됨",
                        "메인 그래프에 소 조회 전용 노드·엣지가 섞여 복잡도 급증",
                      ],
                      [
                        "전용 서브그래프로 분리",
                        "책임 분리, 전용 State 확보, 메인 그래프 불변",
                        "초기 설계 비용",
                      ],
                    ],
                  },
                  {
                    type: "text",
                    text: "전용 서브그래프를 선택했다. 메인 그래프의 classifier는 \"이 질문을 어느 기능으로 보낼 것인가\"만 판단하고, 소 조회의 다단계 흐름은 서브그래프가 통째로 책임지는 구조다.",
                  },
                ],
              },
              {
                heading: "해결 과정",
                blocks: [
                  { type: "sub", text: "1. 전용 State 분리" },
                  {
                    type: "text",
                    text: "메인 챗봇 상태(DairyChatState)와 별도로, 다단계 조회에 필요한 필드만 담은 State를 정의했다.",
                  },
                  {
                    type: "code",
                    code: `# types.py
class DairyChatState(TypedDict):          # 메인 챗봇 상태
    user_id: str
    chat_id: str
    farm_id: str
    current_question: str
    current_answer: str
    answer_route: Literal["rag", "cow_info", "general", "irrelevant"]


class CowInfoState(TypedDict):            # 소 정보 조회 전용 상태
    user_id: str
    chat_id: str
    farm_id: str
    current_question: str
    current_answer: str
    selected_cow_info: Optional[Dict[str, Any]]   # 특정된 소의 기본 정보
    awaiting_confirmation: bool
    cow_list: Optional[List[Dict[str, Any]]]      # 후보 목록 (fallback용)`,
                  },
                  {
                    type: "text",
                    text: "메인 상태가 answer_route(어디로 보낼지)만 든다면, CowInfoState는 selected_cow_info·cow_list(무엇을 조회 중인지)를 든다. 단일 노드 구조에서 담을 자리가 없었던 중간 상태가 정확히 이 두 필드다.",
                  },
                  { type: "sub", text: "2. 단일 노드 → 5개 노드 서브그래프 (커밋 37f642e)" },
                  {
                    type: "text",
                    text: "344줄짜리 단일 모듈을 관심사별 3개 파일(graph 40줄 / nodes 154줄 / service 193줄)로 쪼개고, 노드마다 책임을 하나씩만 지도록 나눴다.",
                  },
                  {
                    type: "table",
                    head: ["노드", "책임"],
                    rows: [
                      ["check_ear_tag_node", "이표번호로 소 식별 (진입점)"],
                      ["show_cow_list_node", "식별 실패 시 농장 소 목록 제시 (fallback)"],
                      ["select_cow_node", "목록에서 사용자 선택 처리"],
                      ["ask_info_detail_node", "정보 카테고리 질의"],
                      ["ask_info_detail_response_node", "상세 조회 후 응답 생성"],
                    ],
                  },
                  {
                    type: "code",
                    code: `# cow_info_graph.py
def create_cow_info_graph():
    graph = StateGraph(CowInfoState)

    graph.add_node("check_ear_tag_node", RunnableLambda(check_ear_tag_node))
    graph.add_node("show_cow_list_node", RunnableLambda(show_cow_list_node))
    graph.add_node("select_cow_node", RunnableLambda(select_cow_node))
    graph.add_node("ask_info_detail_node", RunnableLambda(ask_info_detail_node))
    graph.add_node("ask_info_detail_response_node", RunnableLambda(ask_info_detail_response_node))

    graph.set_entry_point("check_ear_tag_node")

    graph.add_conditional_edges(
        "check_ear_tag_node",
        lambda s: "selected_cow_info" in s and s["selected_cow_info"] is not None,
        {
            True: "ask_info_detail_node",     # 소 특정 성공 → 목록 단계 스킵
            False: "show_cow_list_node"       # 실패 → 목록 fallback
        }
    )
    graph.add_edge("show_cow_list_node", "select_cow_node")
    graph.add_edge("select_cow_node", "ask_info_detail_node")
    graph.add_edge("ask_info_detail_node", "ask_info_detail_response_node")
    graph.add_edge("ask_info_detail_response_node", END)

    return graph.compile()`,
                  },
                  { type: "sub", text: "3. 조건부 진입으로 지름길 확보" },
                  {
                    type: "text",
                    text: "위 add_conditional_edges가 이 설계의 핵심이다. selected_cow_info 필드 하나의 유무로 경로가 갈리므로, 이표번호를 아는 사용자는 리팩토링 전과 동일한 최단 경로를 유지하면서 모르는 사용자에게만 목록 경로를 태울 수 있었다. fallback을 추가하되 기존 경험을 손해 보지 않는 것이 조건이었다.",
                  },
                  { type: "sub", text: "4. 이중 식별 + 목록 fallback" },
                  {
                    type: "text",
                    text: "식별 실패가 곧 대화 종료가 되지 않도록 3단계로 완충했다.",
                  },
                  {
                    type: "code",
                    code: `# 1차 — 정규식으로 12자리 이표번호 추출
def extract_ear_tag_number(text: str) -> str | None:
    match = re.search(r'(\\d{12})', text)
    return match.group(1) if match else None


# 2차 — select_cow_node: 이표번호 완전일치 또는 이름 부분매칭
ear_tag_number = extract_ear_tag_number(question)

if ear_tag_number:
    selected_cow = next(
        (cow for cow in cow_list if cow["ear_tag_number"] == ear_tag_number), None
    )
else:
    selected_cow = next(
        (cow for cow in cow_list if cow["name"] in question), None   # 이름 부분매칭
    )

# 3차 — 실패 시 목록을 다시 제시해 흐름 유지
if not selected_cow:
    return show_cow_list_node(state)`,
                  },
                  {
                    type: "text",
                    text: "목록은 이름·이표번호·출생일을 함께 노출하고 최대 10마리로 제한했다. 전체 노출은 목록 자체가 다시 정보 과부하가 되기 때문이다. 농장에 소가 한 마리도 없는 경우는 별도 안내로 분기했다.",
                  },
                  {
                    type: "text",
                    text: "각 노드는 응답 생성 후 append_chat_memory()로 대화 기록을 남겨, 서브그래프 안에서 오간 내용도 전체 대화 맥락에 합류하도록 했다.",
                  },
                  {
                    type: "text",
                    text: "초기 구조에서 거부당하던 \"어제 분만한 소 누구야?\" 같은 질문은, 이제 조건을 해석하지는 못하더라도 목록 → 선택 경로로 흘러 조회가 이어진다. 완전 해결이 아니라 실패 시의 착지점을 만든 것이 이 단계의 목표였다.",
                  },
                  { type: "sub", text: "5. 키워드 추측 → 명시적 카테고리 선택" },
                  {
                    type: "text",
                    text: "추측을 없애고 사용자가 직접 고르게 바꿨다. 소 한 마리의 관리 정보는 수십 개 필드에 걸쳐 있어 전량 출력도 답이 아니었기에 9개 카테고리로 나눴다.",
                  },
                  {
                    type: "text",
                    text: "체형 / 산유 / 번식 / 건강 / 관리 / 혈통 / 사료 / 위치 / 행동",
                  },
                  {
                    type: "text",
                    text: "선택한 카테고리의 필드만 조회하고, 그중에서도 값이 있는 필드만 응답에 포함했다.",
                  },
                  {
                    type: "code",
                    code: `def build_relevant_cow_info_by_category(category: str, basic: dict, detail: dict) -> dict:
    if not basic or not detail:
        return {"오류": "해당 소의 기본 정보 또는 상세 정보를 찾을 수 없습니다."}
    if category not in fields_by_category:
        return {"오류": f"카테고리 '{category}'는 지원하지 않습니다."}

    category_data = detail.get(category, {})
    for field in fields_by_category[category]:
        value = category_data.get(field)
        if value:                        # 빈 값 스킵 → 응답 간결화
            info[field] = str(value)
    return info`,
                  },
                  {
                    type: "text",
                    text: "추측이 사라지면서 틀린 답을 주는 경우 자체가 없어졌다. 되묻기 한 번을 추가하는 대신 오답 위험을 제거한 트레이드오프다.",
                  },
                  { type: "sub", text: "6. 실 데이터 불완전성 방어" },
                  {
                    type: "text",
                    text: "placeholder에서 실제 Firestore 연동으로 전환하자(abbaed9) 개발 중엔 보이지 않던 문제가 나왔다. 문서 누락, 스키마와 어긋난 enum 값, 빈 필드였다. 특히 enum 불일치는 ValueError로 요청 전체를 500으로 떨어뜨렸다.",
                  },
                  {
                    type: "code",
                    code: `def get_basic_info_by_ear_tag_number(ear_tag_number: str):
    try:
        docs = db.collection('cows') \\
                 .where("ear_tag_number", "==", ear_tag_number) \\
                 .limit(1).stream()
        cow_doc = next(docs, None)

        if cow_doc is None or not cow_doc.exists:
            print(f"[ERROR] 해당 이표번호로 문서를 찾지 못했습니다: {ear_tag_number}")
            return None

        cow_data = cow_doc.to_dict()

        health_status = None
        if cow_data.get("health_status"):
            try:
                health_status = HealthStatus(cow_data["health_status"])
            except ValueError:
                print(f"[WARNING] 잘못된 health_status 값: {cow_data['health_status']} "
                      f"(젖소 ID: {cow_data['id']})")
                health_status = HealthStatus.NORMAL   # 기본값 복구

        breeding_status = None
        if cow_data.get("breeding_status"):
            try:
                breeding_status = BreedingStatus(cow_data["breeding_status"])
            except ValueError:
                print(f"[WARNING] 잘못된 breeding_status 값: {cow_data['breeding_status']} "
                      f"(젖소 ID: {cow_data['id']})")
                breeding_status = None                # 폴백값 없이 비움

        return { ... }   # 15개 필드

    except Exception as e:
        print(f"[ERROR] 특정 젖소 *기본 정보* 조회 전체 실패 "
              f"(ear_tag_number: {ear_tag_number}): {str(e)}")
        return None`,
                  },
                  {
                    type: "text",
                    text: "폴백 전략을 필드마다 다르게 가져간 것은 의도적이다. health_status는 표시 자체가 목적이므로 NORMAL로 복구하고, breeding_status는 잘못된 값으로 번식 판단을 오도하느니 비우는 편이 안전하다고 봤다.",
                  },
                  {
                    type: "text",
                    text: "모든 Firestore 조회를 try/except로 감싸 실패 시 None을 반환하고, 호출부에서 안내 메시지로 변환했다. 어떤 예외 경로로도 500이 나지 않는 것을 기준으로 삼았다.",
                  },
                  {
                    type: "table",
                    head: ["예외 상황", "처리"],
                    rows: [
                      ["문서 없음 / 조회 실패", "[ERROR] 로그 + None 반환 → 안내 메시지"],
                      [
                        "enum 값 불일치",
                        "[WARNING] 로그 + HealthStatus.NORMAL / breeding_status=None",
                      ],
                      ["농장에 소 없음", "등록 유도 메시지"],
                      ["카테고리 오입력", "9개 목록 재안내"],
                      ["기본·상세 정보 한쪽 누락", "\"정보를 찾을 수 없습니다\" 안내"],
                    ],
                  },
                  { type: "sub", text: "7. 서브그래프 통합 버그 (커밋 2c83f8e)" },
                  {
                    type: "text",
                    text: "서브그래프를 부모 그래프에 붙이며 .as_runnable()을 호출했는데, compile()이 이미 실행 가능한 그래프를 반환하므로 불필요한 호출이었다.",
                  },
                  {
                    type: "code",
                    code: `- cow_info_subgraph = create_cow_info_graph().as_runnable()
+ cow_info_subgraph = create_cow_info_graph()   # compile() 결과가 이미 Runnable`,
                  },
                ],
              },
              {
                heading: "적용 결과",
                blocks: [
                  {
                    type: "text",
                    text: "메인 그래프 노드 수는 5개 그대로 두고, cow_info 처리 노드만 1개 → 5개로 늘렸다.",
                  },
                  {
                    type: "table",
                    head: ["구분", "초기 (ab1c23e)", "현재 (HEAD)"],
                    rows: [
                      ["메인 그래프 노드 수", "5", "5 (변동 없음)"],
                      ["cow_info 처리", "단일 노드", "cow_info_graph 서브그래프"],
                      ["cow_info 노드 수", "1", "5"],
                      [
                        "cow_info 파일 구성",
                        "1파일 344줄 / 8함수",
                        "3파일 387줄 (graph·nodes·service)",
                      ],
                    ],
                  },
                  {
                    type: "text",
                    text: "메인 그래프는 classifier / general_response / rag_response / cow_info_graph / irrelevant_response 5개를 그대로 유지한다. 소 조회 로직이 5배로 세분화되는 동안 메인 그래프는 단 한 줄도 복잡해지지 않았다는 점이, 서브그래프 분리가 실제로 값을 한 지점이다.",
                  },
                  {
                    type: "text",
                    text: "라인 수 자체는 344줄에서 387줄로 오히려 늘었다. 하지만 8개 함수가 뒤섞여 있던 한 파일이 그래프 정의·노드 로직·DB 접근 3계층으로 갈렸고, 이후 수정은 해당 계층 파일만 열면 되는 구조가 됐다.",
                  },
                  { type: "text", text: "그 외 결과는 다음과 같다." },
                  {
                    type: "list",
                    items: [
                      "이표번호를 몰라도 조회 경로가 생겼다. 이표번호가 없으면 무조건 거부하고 종료하던 분기를 제거하고, 목록 → 선택 경로로 연결했다.",
                      "조건부 진입으로 이표번호가 명확한 경우의 경로 길이는 리팩토링 전과 동일하게 유지했다.",
                      "키워드 추측 제거로 오답 응답 가능성을 없앴다.",
                      "Firestore 예외 5종을 안내 메시지로 흡수해, DB 데이터가 깨져도 500이 아닌 대화로 처리된다.",
                    ],
                  },
                  { type: "sub", text: "git 진화 타임라인" },
                  {
                    type: "code",
                    code: `ab1c23e  단일 노드 (generate_farmdata_response, 99줄)
   ↓
abbaed9  실 DB 연동 → generate_cow_info_response로 개명, 344줄로 비대화
   ↓
0de1fea  질문 분류 · 이표번호 추출 로직 개선
   ↓
37f642e  5노드 서브그래프 분리 (graph / nodes / service 3파일 신규)
   ↓
2c83f8e  서브그래프 통합 버그 수정 (.as_runnable() 제거)`,
                  },
                ],
              },
              {
                heading: "남은 과제",
                blocks: [
                  {
                    type: "text",
                    text: "문서화하며 코드를 다시 감사한 결과 확인한, 아직 해결되지 않은 지점들이다.",
                  },
                  { type: "sub", text: "1. 다단계 설계와 단일 실행의 간극 (가장 근본적)" },
                  {
                    type: "text",
                    text: "서브그래프는 다단계 대화를 전제로 설계했지만, 현재 그래프는 진입부터 END까지 한 번의 실행에서 완주한다. 사용자 입력을 받기 위해 중간에 멈추는 지점이 없다.",
                  },
                  { type: "text", text: "그 결과 두 가지가 어긋난다." },
                  {
                    type: "list",
                    items: [
                      "awaiting_confirmation이 소비되지 않는다. 레포 전역 grep 결과 세팅 3곳, 읽기 0곳이다. 턴을 넘겨 이 플래그를 검사할 지점 자체가 없기 때문이다.",
                      "카테고리 검증이 같은 질문으로 수행된다. ask_info_detail_node가 9개 목록을 안내한 직후 ask_info_detail_response_node가 category = question.strip()으로 검증하는데, 이 question은 사용자가 목록을 보기 전에 던진 원래 질문이다.",
                    ],
                  },
                  {
                    type: "text",
                    text: "해결하려면 LangGraph의 checkpointer와 interrupt를 도입해 노드 사이에서 실행을 중단·재개하고, 재진입 시 awaiting_confirmation을 검사하는 조건부 엣지를 추가해야 한다. 이것이 다음 작업의 1순위다.",
                  },
                  { type: "sub", text: "2. 노드가 다른 노드를 직접 호출해 생기는 경로 오염" },
                  {
                    type: "text",
                    text: "fallback을 그래프 엣지가 아니라 파이썬 함수 직접 호출로 구현한 지점이 두 곳 있다.",
                  },
                  {
                    type: "code",
                    code: `# check_ear_tag_node 마지막 줄
return show_cow_list_node(state)      # 함수를 직접 호출`,
                  },
                  {
                    type: "text",
                    text: "이 경우 show_cow_list_node가 실행되어 selected_cow_info=None이 담긴 상태가 반환되고, 그 직후 조건부 엣지가 다시 False로 평가되어 같은 노드가 한 번 더 실행된다. Firestore 조회와 append_chat_memory가 중복되는 구조다.",
                  },
                  {
                    type: "text",
                    text: "select_cow_node도 실패 시 같은 방식으로 반환하는데, 이후 엣지는 조건 없이 ask_info_detail_node로 향한다. 그곳에서 cow['name']을 참조하므로 selected_cow_info가 None이면 TypeError가 발생한다.",
                  },
                  {
                    type: "text",
                    text: "fallback을 함수 호출이 아니라 조건부 엣지로 옮기는 것이 옳은 수정이다.",
                  },
                  { type: "sub", text: "3. 데이터 계층의 결함 3가지" },
                  {
                    type: "list",
                    items: [
                      "조회 방식 불일치 — 기본 정보는 필드 쿼리(.where(\"ear_tag_number\", ...)), 상세 정보는 문서 ID 접근(.document(ear_tag_number))이다. 문서 ID와 이표번호가 다른 데이터가 들어오면 기본 정보만 조회되고 상세 정보는 조용히 빈다.",
                      "behavioral_info의 enum 폴백 누락 — Temperament(...) / MilkingBehavior(...) 변환에는 개별 try/except가 없다. 값이 깨져 있으면 바깥 try에 잡혀 상세 조회 전체가 None으로 실패한다. health_status와 동일한 개별 폴백이 필요하다.",
                      "동기 DB 호출 — show_cow_list_node의 Firestore 호출이 동기라 이벤트 루프를 블로킹한다.",
                    ],
                  },
                ],
              },
              {
                heading: "배운 점",
                blocks: [
                  {
                    type: "text",
                    text: "이 구조는 처음부터 설계한 것이 아니라, 단일 노드가 한계에 부딪히면서 밀려서 도달한 결과다.",
                  },
                  {
                    type: "text",
                    text: "\"이표번호가 없으면 대화가 끊긴다\"는 실제 한계가 목록·선택 흐름을 요구했고, 그 흐름을 담으려니 중간 상태가 필요해졌고, 상태를 관리하려니 서브그래프로 갈 수밖에 없었다. 하나의 모듈에 여러 책임이 쌓이면 분기를 하나 추가하는 일이 곧 구조의 한계선이 되고, 그 시점이 상태를 가진 워크플로우로 분리할 타이밍이라는 것을 배웠다.",
                  },
                  {
                    type: "text",
                    text: "또한 서브그래프 분리의 효과가 \"그래프가 단순해졌다\"가 아니라 \"복잡도를 한 곳에 가둬 메인 그래프를 안 건드리게 만들었다\"는 것도 노드 수를 직접 세어보고 나서야 정확히 이해했다. 메인 그래프 노드 수는 5개 그대로였고, 라인 수는 오히려 늘었다. 리팩토링의 성과를 \"줄었다\"로 말하려던 습관을 고치게 된 계기였다.",
                  },
                  {
                    type: "text",
                    text: "가장 크게 남은 배움은 \"구조를 만드는 것\"과 \"구조가 의도대로 도는 것\"은 다른 문제라는 점이다. 다단계 대화를 전제로 State와 노드를 나눴지만, 실행 모델(단일 실행 완주)을 함께 설계하지 않아 awaiting_confirmation 같은 필드가 쓰이지 못한 채 남았다. 상태 기반 워크플로우에서는 상태를 어떻게 나눌지와 함께, 그 상태가 언제 저장되고 언제 재개되는지까지 같이 결정해야 한다는 것을 이번 감사 과정에서 확인했다.",
                  },
                ],
              },
            ],
          },
          {
            title:
              "배포 환경과 실행 환경 차이로 인한 Vector DB 생성 및 캐시 무효화 문제 해결",
            problem:
              "로컬에서는 정상 동작하던 RAG가 배포 환경에서 Chroma Vector DB 생성에 실패했고, 캐시가 있어도 Vector DB를 매 요청마다 다시 로드해 불필요한 파일 접근과 재임베딩이 반복됐습니다.",
            solution:
              "절대경로를 프로젝트 기준 상대경로로 변경해 환경 의존성을 제거하고, _vectordb = None 초기화를 제거해 인메모리 캐시를 복구했으며, 경로·빈 문서에 대한 예외 처리를 추가했습니다.",
            effect:
              "로컬과 배포 환경에서 동일하게 동작하는 구조를 구축하고, 첫 요청 이후에는 Vector DB를 재사용해 반복적인 로딩과 재임베딩을 제거했습니다.",
            tags: ["배포환경", "벡터DB", "캐싱", "RAG"],
            tech: ["LangGraph", "LangChain", "ChromaDB", "OpenAI Embedding", "Python"],
            details: [
              {
                heading: "문제 상황",
                blocks: [
                  {
                    type: "text",
                    text: "소담이 챗봇은 낙농 문서를 임베딩하여 Chroma Vector DB에 저장한 뒤, 사용자 질문과 가장 유사한 문서를 검색하는 RAG 구조로 구현하였다.",
                  },
                  {
                    type: "text",
                    text: "로컬 환경에서는 정상적으로 동작했지만, 배포 서버에서는 Vector DB 생성 단계에서 실패하여 RAG가 동작하지 않았다. 또한 DB가 정상적으로 생성된 경우에도 질문이 들어올 때마다 Vector DB를 다시 로드하여 불필요한 I/O가 반복되는 문제가 있었다.",
                  },
                ],
              },
              {
                heading: "원인 분석",
                blocks: [
                  { type: "sub", text: "1. 배포 환경에서 Vector DB 생성 실패" },
                  {
                    type: "text",
                    text: "persist_dir의 기본 경로를 다음과 같이 설정해두었다.",
                  },
                  { type: "code", code: `persist_dir="/RAG/chroma"` },
                  {
                    type: "text",
                    text: "앞의 / 때문에 프로젝트 내부가 아닌 파일 시스템 루트 경로를 의미하게 되었고, 배포 환경에서는 해당 위치에 디렉터리를 생성할 권한이 없어 Vector DB 생성이 실패했다.",
                  },
                  {
                    type: "text",
                    text: "즉, 로컬과 배포 환경의 파일 시스템 및 권한 차이를 고려하지 못한 것이 원인이었다.",
                  },
                  { type: "sub", text: "2. 캐시가 동작하지 않는 구조" },
                  {
                    type: "text",
                    text: "Vector DB를 한 번만 생성하여 재사용하기 위해 전역 캐시(_vectordb)를 두었지만, 함수가 호출될 때마다 다음 코드가 실행되고 있었다.",
                  },
                  { type: "code", code: `global _vectordb
_vectordb = None` },
                  {
                    type: "text",
                    text: "이 때문에 아래 캐시 분기는 항상 실행되지 않았다.",
                  },
                  { type: "code", code: `if _vectordb:
    return _vectordb` },
                  {
                    type: "text",
                    text: "결과적으로 Vector DB는 매 요청마다 다시 로드되었고, 캐시를 구현했음에도 실제로는 전혀 활용되지 않는 구조였다.",
                  },
                ],
              },
              {
                heading: "해결 과정",
                blocks: [
                  { type: "sub", text: "1. 저장 경로를 상대경로로 변경" },
                  {
                    type: "text",
                    text: "절대경로 대신 프로젝트 기준 상대경로를 사용하도록 변경하였다.",
                  },
                  { type: "code", code: `- persist_dir="/RAG/chroma"
+ persist_dir="RAG/chroma"` },
                  {
                    type: "text",
                    text: "이를 통해 로컬과 배포 환경에서 동일한 경로 기준으로 동작하도록 수정하였다.",
                  },
                  { type: "sub", text: "2. Vector DB 캐시 복원" },
                  {
                    type: "text",
                    text: "불필요한 초기화를 제거하여 최초 한 번만 Vector DB를 생성하고 이후에는 메모리에 저장된 객체를 재사용하도록 수정하였다.",
                  },
                  { type: "code", code: `- _vectordb = None
+ # _vectordb = None` },
                  { type: "code", code: `if _vectordb:
    return _vectordb` },
                  { type: "sub", text: "3. 예외 처리 추가" },
                  {
                    type: "text",
                    text: "배포 과정에서 원인을 빠르게 파악할 수 있도록 방어 로직도 함께 추가하였다.",
                  },
                  { type: "code", code: `if not os.path.exists(source_folder):
    raise FileNotFoundError(...)

if len(raw_documents) == 0:
    raise ValueError("문서가 비어 있습니다.")` },
                  {
                    type: "text",
                    text: "모든 예외는 로그로 출력한 뒤 다시 발생시키도록 구현하여 문제 원인을 즉시 확인할 수 있도록 개선하였다.",
                  },
                ],
              },
              {
                heading: "적용 결과",
                blocks: [
                  {
                    type: "list",
                    items: [
                      "프로젝트 기준 상대경로를 사용하여 로컬과 배포 환경 모두 동일한 방식으로 동작하도록 개선",
                      "Vector DB 캐시가 정상적으로 동작하여 첫 로딩 이후에는 DB를 다시 생성하거나 로드하지 않도록 개선",
                      "문서 경로 오류 및 빈 문서와 같은 예외를 사전에 검증하여 문제 원인을 빠르게 파악할 수 있는 구조를 구축",
                    ],
                  },
                ],
              },
              {
                heading: "배운 점",
                blocks: [
                  {
                    type: "text",
                    text: "이번 경험을 통해 배포 환경에서는 파일 경로와 권한까지 고려한 설계가 필요하다는 점을 배웠다.",
                  },
                  {
                    type: "text",
                    text: "또한 캐시는 단순히 구현하는 것이 아니라 실제로 캐시가 동작하는지 검증하는 과정이 중요하다는 것을 경험했다. _vectordb = None 한 줄 때문에 캐시가 완전히 무력화되어 있었고, 성능 문제의 원인은 새로운 기능이 아니라 기존 로직을 정확히 분석하는 과정에서 발견할 수 있었다.",
                  },
                ],
              },
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
            title: "왜 필요한가 — 데이터의 89.4% 공백",
            points: [
              "체세포수(SCC)는 유방 건강을 나타내는 표준 지표지만, 별도 검사를 거쳐야 얻을 수 있다",
              "전체 착유 기록 732,660건 중 체세포수 측정값 보유는 77,372건(10.6%)뿐",
              "나머지 89.4%의 공백을, 착유로봇이 자동 수집하는 5개 지표만으로 메우는 분류 모델을 설계",
            ],
          },
          {
            title: "서비스 로직 — 측정값이 있으면 예측하지 않는다",
            points: [
              "체세포수 값 있음 → 기준값 기반 규칙 분기 (확정 판정)",
              "체세포수 값 없음 → 5개 지표 기반 ML 모델로 등급 예측 (추정 판정)",
              "모델의 타겟 자체가 체세포수 등급이므로, 실측값이 있으면 추정할 이유가 없다",
            ],
          },
          {
            title: "최종 모델",
            points: [
              "Random Forest · 입력 5개 피처 — 착유량·전도율·유지방비율·유단백비율·산차수",
              "Accuracy 0.839 · Weighted F1 0.827",
              "타겟 등급 재설계와 피처 정제로 유방염 의심군 F1 0.41 → 0.49, macro F1 0.48 → 0.64 개선",
              "확신도는 predict_proba의 최대 클래스 확률을 사용",
            ],
          },
        ],
        image: "/sodam/mastitis.png",
        video: "/sodam/videos/mastitis.mp4",
        troublesLabel: "모델 개발 과정 · 성능 최적화",
        troubles: [
          {
            title: "타겟 등급 재설계와 피처 정제",
            problem:
              "체세포수 4등급 분류 모델의 Accuracy는 0.833이었지만, 정작 잡아내야 할 '염증 가능성'의 Recall이 0.06, '유방염 의심'이 0.32였습니다. 전체 정확도가 다수 클래스(정상 79%)에 가려져 이상 개체를 사실상 탐지하지 못하는 상태였습니다.",
            solution:
              "문헌 기준을 살리되 실질적으로 동일한 조치가 필요한 2·3등급을 통합해 3등급으로 재설계하고, 변수 중요도 기반 Ablation Study로 피처를 10개에서 5개로 정제했습니다.",
            effect:
              "유방염 의심군 F1 0.41 → 0.49, macro F1 0.48 → 0.64로 개선했고, Weighted F1 손실 0.001로 변수를 절반으로 줄여 모델을 경량화했습니다.",
            tags: ["클래스불균형", "타겟재설계", "AblationStudy", "모델비교"],
            tech: [
              "Python",
              "pandas",
              "scikit-learn",
              "XGBoost",
              "matplotlib",
              "seaborn",
            ],
            details: [
              {
                heading: "문제 정의",
                blocks: [
                  {
                    type: "text",
                    text: "체세포수(SCC, Somatic Cell Count)는 유즙 내 면역세포 수로, 유방 건강 상태를 나타내는 표준 지표다. 문제는 별도 검사를 거쳐야 얻을 수 있다는 것이다.",
                  },
                  {
                    type: "table",
                    head: ["구분", "건수", "비중"],
                    rows: [
                      ["전체 착유 기록", "732,660", "100%"],
                      ["체세포수 측정값 보유", "77,372", "10.6%"],
                    ],
                  },
                  {
                    type: "text",
                    text: "즉, 농가는 대부분의 착유 시점에서 유방 상태를 알 수 없는 채로 운영된다.",
                  },
                  { type: "sub", text: "설계한 서비스 로직" },
                  {
                    type: "code",
                    code: `착유 기록 입력
  ├─ 체세포수 값 있음  → 기준값 기반 규칙 분기 (확정 판정)
  └─ 체세포수 값 없음  → ML 모델로 등급 예측 (추정 판정)  ← 본 프로젝트`,
                  },
                  {
                    type: "text",
                    text: "측정값이 있으면 예측할 필요가 없다. 이 모델의 존재 이유는 측정값이 없는 89.4%를 커버하는 것이다.",
                  },
                ],
              },
              {
                heading: "타겟(종속변수) — 4등급에서 3등급으로",
                blocks: [
                  { type: "sub", text: "1. 임계값의 근거" },
                  {
                    type: "text",
                    text: "임의로 자르지 않고 낙농 문헌의 통용 기준을 따랐다.",
                  },
                  {
                    type: "table",
                    head: ["기준 (유즙 1mL당)", "해석"],
                    rows: [
                      ["≤ 1×10⁵ (10만)", "매우 건강"],
                      ["≤ 3×10⁵ (30만)", "감염 없는 정상 범위"],
                      ["≥ 5×10⁵ (50만)", "유방에 심한 자극 — 세균성 유방염 의심"],
                    ],
                  },
                  { type: "sub", text: "2. 1차 시도 — 4등급 분류" },
                  {
                    type: "code",
                    code: `def categorize_scc(value):
    if value <= 100:   return 0  # 정상
    elif value <= 300: return 1  # 주의
    elif value <= 500: return 2  # 염증 가능성
    else:              return 3  # 유방염 의심`,
                  },
                  {
                    type: "table",
                    head: ["등급", "건수", "비율"],
                    rows: [
                      ["0 정상", "61,184", "79.1%"],
                      ["1 주의", "11,779", "15.2%"],
                      ["2 염증 가능성", "1,783", "2.3%"],
                      ["3 유방염 의심", "2,626", "3.4%"],
                    ],
                  },
                  {
                    type: "text",
                    text: "Random Forest 클래스별 성능 (Accuracy 0.833)",
                  },
                  {
                    type: "table",
                    head: ["등급", "Precision", "Recall", "F1", "Support"],
                    rows: [
                      ["정상", "0.88", "0.95", "0.92", "12,237"],
                      ["주의", "0.56", "0.43", "0.49", "2,356"],
                      ["염증 가능성", "0.32", "0.06", "0.11", "357"],
                      ["유방염 의심", "0.57", "0.32", "0.41", "525"],
                      ["macro avg", "0.58", "0.44", "0.48", "15,475"],
                      ["weighted avg", "0.81", "0.83", "0.81", "15,475"],
                    ],
                  },
                  {
                    type: "split",
                    text: "Accuracy 83%는 겉보기 숫자였다. 데이터의 79%가 '정상'이라 모델이 다수 클래스에 쏠려 있을 뿐, 정작 잡아내야 할 유방염 의심군의 Recall은 0.32, 염증 가능성은 0.06으로 사실상 탐지에 실패한 상태였다. Confusion Matrix에서도 염증 가능성(23건)과 유방염 의심(167건)의 정답 예측이 극히 적고, 대부분이 '정상'과 '주의'로 흡수되고 있다.",
                    images: [
                      {
                        src: "/sodam/mastitis/cm-4class.png",
                        width: 581,
                        height: 490,
                        alt: "4등급 분류 Confusion Matrix",
                      },
                    ],
                    caption: "4등급 분류 Confusion Matrix",
                  },
                  {
                    type: "text",
                    text: "이 괴리는 weighted avg F1 0.81 vs macro avg F1 0.48에서 그대로 드러난다. 클래스별 표본 수로 가중하면 좋아 보이지만, 모든 클래스를 동등하게 보면 절반도 안 되는 성능이다. 불균형 데이터에서 Accuracy와 weighted 지표만 보면 안 되는 이유다. 원인은 두 가지로 판단했다.",
                  },
                  {
                    type: "list",
                    items: [
                      "클래스 불균형 — 정상:주의:염증:의심 ≈ 24:5:1:2",
                      "중간 구간 경계의 모호성 — 주의(100~300)와 염증 가능성(300~500)은 센서 노이즈·개체 편차에 민감해 분리가 어려움",
                    ],
                  },
                  { type: "sub", text: "3. 2차 설계 — 3등급으로 재분류" },
                  {
                    type: "text",
                    text: "문헌의 5×10⁵ 기준을 살리되, 실질적으로 동일한 조치(수의사 확인)가 필요한 2·3등급을 통합했다.",
                  },
                  {
                    type: "code",
                    code: `def categorize_scc(value):
    if value <= 100:   return 0  # 정상
    elif value <= 300: return 1  # 주의
    else:              return 2  # 유방염 의심 (염증 가능성 + 의심 통합)`,
                  },
                  {
                    type: "table",
                    head: ["등급", "건수"],
                    rows: [
                      ["0 정상", "61,184"],
                      ["1 주의", "11,779"],
                      ["2 유방염 의심", "4,409"],
                    ],
                  },
                  { type: "text", text: "개선 결과 (Random Forest)" },
                  {
                    type: "table",
                    head: ["등급", "Precision", "Recall", "F1", "Support"],
                    rows: [
                      ["정상", "0.88", "0.95", "0.92", "12,237"],
                      ["주의", "0.59", "0.43", "0.49", "2,356"],
                      ["유방염 의심", "0.67", "0.39", "0.49", "882"],
                      ["macro avg", "0.71", "0.59", "0.64", "15,475"],
                      ["weighted avg", "0.82", "0.84", "0.83", "15,475"],
                    ],
                  },
                  {
                    type: "split",
                    text: "유방염 의심군 F1이 0.41 → 0.49, Precision이 0.57 → 0.67로 올랐고, macro F1은 0.48 → 0.64로 개선됐다. Confusion Matrix에서도 유방염 의심 정답 예측이 167건 → 346건으로 2배 이상 늘었다. 모델 파라미터가 아니라 등급 체계 자체를 문제로 보고 재설계한 판단이 유효했다.",
                    images: [
                      {
                        src: "/sodam/mastitis/cm-3class.png",
                        width: 581,
                        height: 490,
                        alt: "3등급 분류 Confusion Matrix",
                      },
                    ],
                    caption: "3등급 재분류 후 Confusion Matrix",
                  },
                ],
              },
              {
                heading: "성능 최적화 — 피처 선정",
                blocks: [
                  { type: "sub", text: "1. 제조사 필터링" },
                  {
                    type: "text",
                    text: "전체 데이터의 제조사 분포는 이미 한쪽으로 크게 쏠려 있었다.",
                  },
                  {
                    type: "table",
                    head: ["제조사 ID", "count"],
                    rows: [
                      ["agrirobotech", "732,374"],
                      ["delaval", "286"],
                    ],
                  },
                  {
                    type: "text",
                    text: "체세포수 결측치를 제거하고 나니 delaval 데이터는 사실상 전부 사라져 제조사 ID가 한 종류만 남았다. 변수로서 정보량이 0이므로 학습에서 제외하고, 단일 기기(agrirobotech) 기준 모델로 범위를 한정했다.",
                  },
                  { type: "sub", text: "2. 변수 중요도 분석 — 1차 제거" },
                  {
                    type: "text",
                    text: "1차 학습(전체 변수 10개)의 Random Forest 변수 중요도.",
                  },
                  {
                    type: "table",
                    head: ["변수", "중요도"],
                    rows: [
                      ["전도율", "0.265"],
                      ["유지방비율", "0.239"],
                      ["유단백비율", "0.194"],
                      ["착유량", "0.182"],
                      ["산차수", "0.096"],
                      ["착유횟차", "0.011"],
                      ["공기흐름값", "0.007"],
                      ["온도", "0.005"],
                      ["수집건수", "0.001"],
                      ["혈액흐름여부_Y", "≈ 0.000"],
                    ],
                  },
                  {
                    type: "split",
                    text: "상위 5개(전도율·유지방비율·유단백비율·착유량·산차수)가 전체 중요도의 97.6%를 차지했고, 반대로 수집건수와 혈액흐름여부_Y는 둘을 합쳐도 0.07%에 불과했다. 예측에 기여하지 않으면서 결측·수집 실패 리스크만 늘리는 변수로 판단해 이 둘을 1차로 제거했다.",
                    images: [
                      {
                        src: "/sodam/mastitis/importance-base.png",
                        width: 989,
                        height: 590,
                        alt: "1차 학습 Random Forest 변수 중요도",
                      },
                    ],
                    caption: "1차 학습(전체 변수 10개) 변수 중요도",
                  },
                  { type: "sub", text: "3. Ablation Study — 단계별 성능 변화" },
                  {
                    type: "text",
                    text: "변수를 단계적으로 제거하며 성능 변화를 측정했다. (Random Forest 기준)",
                  },
                  {
                    type: "table",
                    head: ["#", "실험 조건", "변수 수", "Accuracy", "Weighted F1"],
                    rows: [
                      ["1", "4등급 + 전체 변수", "10", "0.833", "0.814"],
                      ["2", "수집건수·혈액흐름여부 제거", "8", "0.833", "0.815"],
                      ["3", "3등급 재분류", "8", "0.842", "0.828"],
                      ["4", "온도·공기흐름값·착유횟차 추가 제거", "5", "0.839", "0.827"],
                    ],
                  },
                  {
                    type: "split",
                    text: "세 차례의 변수 중요도를 비교하면 전도율 > 유지방비율 > 유단백비율 > 착유량 순위가 조건에 관계없이 일정하게 유지된다. 상위 신호가 특정 실험 설정에 의존하지 않는다는 뜻으로, 피처 제거 판단의 근거가 됐다.",
                    images: [
                      {
                        src: "/sodam/mastitis/importance-8f.png",
                        width: 989,
                        height: 590,
                        alt: "실험 2 변수 중요도",
                      },
                      {
                        src: "/sodam/mastitis/importance-3class.png",
                        width: 989,
                        height: 590,
                        alt: "실험 3 변수 중요도",
                      },
                    ],
                    caption:
                      "좌: 실험 2(8개 변수) · 우: 실험 3(3등급 재분류). 상위 4개 변수의 순위와 크기가 거의 변하지 않는다.",
                  },
                  { type: "sub", text: "4. 최종 피처 5개 선정 — 2차 제거" },
                  {
                    type: "text",
                    text: "실험 3까지 남아 있던 8개 중 온도(0.005)·공기흐름값(0.007)·착유횟차(0.011)는 중요도 합계가 2.3%에 그쳤다. 상위 5개만으로 이미 전체 중요도의 97.6%가 설명되므로, 이 셋을 빼도 정보 손실이 크지 않다고 보고 2차로 제거했다.",
                  },
                  {
                    type: "table",
                    head: ["최종 피처", "중요도"],
                    rows: [
                      ["전도율", "0.265"],
                      ["유지방비율", "0.239"],
                      ["유단백비율", "0.194"],
                      ["착유량", "0.182"],
                      ["산차수", "0.096"],
                    ],
                  },
                  {
                    type: "text",
                    text: "결과적으로 실험 3 대비 Weighted F1은 0.828 → 0.827로 사실상 동일했다(-0.001). 성능을 거의 그대로 유지한 채 변수를 10개 → 5개로 줄여 모델 경량화와 해석 가능성을 확보했고, 실서비스에서는 입력 항목이 적을수록 센서 수집 실패 지점이 줄어드는 이점이 더 크다고 판단해 이 조합을 최종 채택했다.",
                  },
                  { type: "sub", text: "5. 도메인 해석" },
                  {
                    type: "text",
                    text: "가장 중요한 변수가 전도율로 나온 것은 도메인 지식과 일치한다. 유방에 염증이 생기면 혈액 내 Na⁺·Cl⁻ 이온이 유즙으로 유입되어 전기전도율이 상승하기 때문이다. 모델이 통계적 우연이 아니라 생리학적으로 타당한 신호를 학습했다는 근거로 볼 수 있다.",
                  },
                ],
              },
              {
                heading: "모델 비교 및 튜닝",
                blocks: [
                  {
                    type: "text",
                    text: "최종 피처 5개 기준, 4개 모델을 동일 조건에서 비교했다.",
                  },
                  {
                    type: "table",
                    head: ["모델", "Accuracy", "Precision", "Recall", "F1"],
                    rows: [
                      ["Logistic Regression", "0.790", "0.720", "0.790", "0.728"],
                      ["Random Forest (최종 채택)", "0.839", "0.822", "0.839", "0.827"],
                      ["XGBoost", "0.823", "0.795", "0.823", "0.787"],
                      ["Tuned XGBoost (GridSearchCV)", "0.834", "0.816", "0.834", "0.822"],
                    ],
                  },
                  { type: "sub", text: "GridSearchCV — 3-fold, 108개 조합 × 324 fits" },
                  {
                    type: "code",
                    code: `Best Params: {
  'n_estimators': 200, 'max_depth': 9, 'learning_rate': 0.2,
  'subsample': 0.8, 'colsample_bytree': 1.0
}`,
                  },
                  {
                    type: "split",
                    text: "XGBoost는 튜닝으로 F1이 0.787 → 0.822까지 올랐지만 기본 파라미터 Random Forest(0.827)를 끝내 넘지 못했다. 탐색 비용 대비 이득이 없다고 판단해 최종 모델은 Random Forest로 확정했다.",
                    images: [
                      {
                        src: "/sodam/mastitis/gridsearch.png",
                        width: 1313,
                        height: 104,
                        alt: "GridSearchCV 튜닝 결과",
                      },
                    ],
                    caption: "GridSearchCV 튜닝 결과",
                  },
                  {
                    type: "text",
                    text: "선형 모델(LR)이 트리 계열 대비 약 5%p 낮은 것으로 보아, 변수와 체세포수 등급 사이에 비선형적 상호작용이 존재한다고 해석했다.",
                  },
                ],
              },
              {
                heading: "한계와 다음 스텝",
                blocks: [
                  { type: "sub", text: "1. 체세포수 단위 기준 불명확" },
                  {
                    type: "text",
                    text: "데이터셋에 체세포수의 측정 단위(유즙 몇 mL 기준인지)가 명시되어 있지 않다. 문헌 기준(1mL당)을 가정해 등급을 나눴으나, 실서비스 적용 전 데이터 제공처 확인이 필수다. 단위가 다르면 임계값 전체를 재조정해야 한다.",
                  },
                  { type: "sub", text: "2. 소수 클래스 Recall 0.39 — 아직 부족" },
                  {
                    type: "text",
                    text: "유방염 의심 개체 10마리 중 4마리만 잡아낸다. 낙농 현장에서는 오탐(FP) 비용보다 미탐(FN) 비용이 크므로, Accuracy가 아니라 Recall을 우선 지표로 삼는 재튜닝이 필요하다.",
                  },
                  {
                    type: "list",
                    items: [
                      "class_weight='balanced' / scale_pos_weight 적용",
                      "SMOTE 등 오버샘플링으로 소수 클래스 보강",
                      "예측 확률 임계값을 0.5에서 하향 조정",
                      "평가지표를 Accuracy → macro F1 / PR-AUC로 전환",
                    ],
                  },
                  { type: "sub", text: "3. 개체별 baseline 미반영" },
                  {
                    type: "text",
                    text: "현재는 단일 착유 시점의 절대값만 사용한다. 소마다 정상 전도율·유지방비율이 다르므로, 개체별 평상시 값 대비 편차를 피처로 추가하면 개체 편차 노이즈를 상당 부분 제거할 수 있을 것으로 본다. (예: 최근 7회 이동평균 대비 z-score)",
                  },
                  { type: "sub", text: "4. 단일 기종 데이터 기반" },
                  {
                    type: "text",
                    text: "체세포수 결측을 제거하고 나면 agrirobotech 한 기종만 남아, 학습 데이터가 사실상 단일 착유로봇 기준이다. 기종마다 센서 측정 방식과 값의 스케일이 다를 수 있으므로, 타 기종 적용 전에는 별도 검증이 필요하다.",
                  },
                ],
              },
            ],
          },
        ],
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
              "모델: RandomForestRegressor (스케일러 적용)",
              "입력 8개 피처 — 착유횟수·전도율·환경온도·유지방비율·유단백비율·농후사료섭취량·착유 측정월·착유 측정요일",
              "출력: 예측 착유량(L) + AI 확신도 + 모델 설명력",
              "확신도는 RandomForest 각 트리 예측값의 변동계수(표준편차÷평균)를 0~100%로 환산 — 회귀에는 predict_proba가 없어 앙상블의 예측 분산을 불확실성 지표로 활용",
              "모델 설명력 82.4% (MAE 3.41 · RMSE 4.94)",
            ],
          },
        ],
        image: "/sodam/milk.png",
        video: "/sodam/videos/milk.mp4",
      },
    ],
    features: [
      "센서 없는 AI 예측 6종 — 착유량·유방염·유성분 품질·사료 효율·분만·교배 타이밍. 이 중 착유량·유방염 2종은 공공데이터로 직접 학습해 서비스에 적용했고, 나머지 4종은 동일 파이프라인으로 입력 변수까지 설계",
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
  /*
    삼성메디슨 인턴 — 파트 1 (2024.03~04, 하복부 초음파 다중 구조물 검출).
    인턴 기간 중 사수가 바뀌며 담당 과제가 둘로 나뉜다.
    파트 2 는 자료가 오면 별도 slug 로 추가하고, 그때 이 slug 를
    samsung-medison-detection 으로 정리한다.

    아래 서술은 본인이 제공한 작업 기록 문서를 유일한 출처로 삼는다.
    이력서 불릿에서 추정해 채운 내용은 넣지 않는다.
  */
  {
    slug: "samsung-medison",
    title: "초음파 다중 구조물 검출",
    badge: "삼성메디슨 · 인턴",
    period: "2024.03 — 2024.04",
    teamSize: "AI Vision 그룹 · 2개월",
    summary:
      "하복부 초음파 영상에서 6개 구조물을 검출하는 과제를 담당했습니다. 학습을 반복하며 필요한 도구를 직접 만들었습니다 — 결과를 눈으로 확인하는 시각화 도구, 어노테이션을 학습 포맷으로 변환하는 GT 생성 함수, 영상에서 데이터셋까지의 처리 파이프라인입니다. 두 달간 성능이 정체되자 원인을 추적해, 병목이 모델이 아니라 정답 데이터에 있음을 규명했습니다.",
    stack: [
      "Python",
      "PyTorch",
      "OpenCV",
      "YOLOv8",
      "Object Detection",
      "Instance Segmentation",
      "CVAT",
      "ONNX",
      "TensorRT",
    ],
    screenshots: [],
    overview: [
      { label: "대상", value: "하복부 초음파 영상 (충수염 진단 보조)" },
      {
        label: "클래스",
        value:
          "6종 — Terminal ileum · Psoas · Cecum · Iliac artery · Iliac vein · Appendix",
      },
      {
        label: "데이터",
        value:
          "초기 87개 폴더 (폴더 = 영상 1개, jpg 이미지와 동명 txt 레이블이 1:1 대응) → AVI 프레임 추출로 약 3만 장 규모로 확장 (900×600)",
      },
      { label: "태스크", value: "Object Detection → Instance Segmentation" },
      { label: "수행", value: "단독 수행 · 외국인 사수와 영어로 협업" },
    ],
    timeline: [
      { when: "3/29", what: "Bounding box drawing 함수" },
      { when: "4/2", what: "GT / predict 비교 도구" },
      { when: "4/8", what: "sharpen 전처리 함수" },
      { when: "4/11~12", what: "Segmentation 모델 서베이" },
      { when: "4/15", what: "XML → txt 변환 함수 · YOLOv8-seg 첫 학습" },
      { when: "4/16", what: "Mask 렌더링 함수 · 좌표계 정합" },
      { when: "4/18", what: "merge_separate_annote" },
      { when: "4/21", what: "데이터 처리 파이프라인" },
      { when: "4/24~25", what: "Appendix 단일 클래스 Segmentation 학습" },
    ],
    timelineNote:
      "위 작업과 병행해 기간 내내 조건을 바꿔가며 학습을 반복했습니다. 도구는 대부분 그 반복 과정에서 막힌 지점을 풀기 위해 만든 것입니다.",
    aiFeaturesLabel: "수행 내용",
    aiFeatures: [
      {
        name: "1. 검증 도구 구현",
        when: "3/29 · 4/2 · 4/16",
        tagline:
          "학습을 돌려도 좌표 변환이 맞는지, 예측이 어디서 틀리는지 숫자만으로는 알 수 없었습니다. 확인할 수단부터 만들었습니다.",
        metric: "오류 2건 규명",
        problemLabel: "확인할 수 없던 것",
        problemList: [
          "정규화된 레이블 좌표가 실제 이미지 위 어디에 찍히는지 숫자만으로는 알 수 없다",
          "예측이 어디서 틀렸는지 — 위치인지 클래스인지 — 지표 하나로는 구분되지 않는다",
          "좌표계를 변환할 때마다 결과가 맞는지 검산할 방법이 없다",
        ],
        solutionLabel: "직접 만든 도구",
        solutionBlocks: [
          {
            title: "Bounding box drawing (3/29)",
            points: [
              "정규화 레이블을 픽셀 좌표로 역산해 이미지 위에 렌더링",
              "폴더 경로만 입력하면 전체가 자동 처리되도록 구성",
            ],
          },
          {
            title: "GT / predict 비교 도구 (4/2)",
            points: [
              "정답 박스를 그린 GT 이미지와 YOLOv8 예측 결과를 cv2.hconcat 으로 가로 병합해 나란히 비교",
              "bounding box · class name · 하단 파일명을 함께 표시해 어긋난 지점을 바로 짚을 수 있게 함",
            ],
          },
          {
            title: "Mask 렌더링 (4/16)",
            points: [
              "Segmentation 전환 이후 cv2.polylines 로 폴리곤 좌표를 선으로 그려 표시",
              "변환된 레이블 txt 가 옳은 좌표를 따왔는지 검증하는 데도 같은 함수를 사용",
            ],
          },
        ],
        troublesLabel: "이 도구들로 발견한 것",
        troubles: [
          {
            title: "두 건의 오류 — 눈에 보이는 증상과 실제 원인이 달랐다",
            problem:
              "검출 위치는 정확한데 클래스 이름이 다르게 표시되고, 마스크 모양은 정확한데 색상이 다르게 렌더링됐다. 증상만 보고는 원인을 좁힐 수 없었다.",
            solution:
              "학습 산출물 labels.jpg 를 역추적해, 각각 어노테이션 파일과 설정 파일의 클래스 인덱스 정의 불일치, XML 의 id 가 실제 라벨링 순서와 다르게 기록된 문제임을 확인했다.",
            effect:
              "이후 각 단계의 결과를 시각적으로 확인한 뒤 다음으로 넘어가는 절차를 고정했다.",
            tags: ["클래스 인덱스", "디버깅"],
            tech: ["YOLOv8", "OpenCV", "CVAT"],
            details: [
              {
                heading: "증상과 원인",
                blocks: [
                  {
                    type: "table",
                    head: ["증상", "실제 원인"],
                    rows: [
                      [
                        "검출 위치는 정확한데 클래스 이름이 다르게 표시",
                        "어노테이션 파일과 설정 파일의 클래스 인덱스 정의 불일치",
                      ],
                      [
                        "마스크 모양은 정확한데 색상이 다르게 렌더링",
                        "XML 의 id 가 실제 라벨링 순서와 다르게 기록됨",
                      ],
                    ],
                  },
                  {
                    type: "text",
                    text: "둘 다 학습 산출물 labels.jpg 를 역추적해서야 찾았습니다. 검증 도구가 없었다면 '학습 결과가 낮다'로 뭉뚱그려졌을 문제입니다.",
                  },
                ],
              },
              {
                heading: "Bounding box 역산",
                blocks: [
                  {
                    type: "text",
                    text: "정규화 레이블을 이미지 위에 그리려면 픽셀 좌표로 되돌려야 합니다. 이 역산이 맞는지 확인하는 것이 첫 도구의 목적이었습니다.",
                  },
                  {
                    type: "code",
                    code: `Cx = nCx × IW        BW = nW × IW
Cy = nCy × IH        BH = nH × IH

좌상단 = (Cx − BW/2, Cy − BH/2)
우하단 = 좌상단 + (BW, BH)`,
                  },
                ],
              },
              {
                heading: "GT / predict 비교 출력 규격",
                blocks: [
                  {
                    type: "code",
                    code: `출력 크기 :  너비 = 이미지1 × 2,  높이 = 이미지1 동일
표시 항목 :  bounding box, class name, 하단 파일명`,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "2. 반복 학습 및 조건 실험",
        when: "기간 내내 · 4/8",
        tagline:
          "도구를 만드는 작업과 병행해, 기간 내내 조건을 바꿔가며 학습을 반복했습니다.",
        metric: "전체 mAP 0.14~0.25 정체",
        problemLabel: "학습 환경 구축",
        problemList: [
          "원격 서버에 CUDA · conda · 가상환경 · PyTorch 및 필요 패키지를 설치해 학습 환경을 직접 구축",
          "초기에 YOLOv9 로 시도했으나 s 모델이 미공개 상태(c, e 만 release)여서 YOLOv8 로 전환",
          "데이터셋 설정에서 names 를 리스트로 주면 실제 라벨링 인덱스와 어긋나 dict 형태로 명시",
        ],
        solutionLabel: "바꿔본 조건",
        solutionBlocks: [
          {
            title: "전처리 (4/8)",
            points: [
              "초음파 영상은 노이즈와 음영으로 경계가 흐릿해, sharpen 함수를 구현하고 별도 데이터셋을 만들어 원본과 비교 학습",
              "Mean / Median / Gaussian filter 와 Thresholding 도 노이즈 저감·영역 분리 방향으로 검토",
            ],
          },
          {
            title: "모델 · 가중치",
            points: [
              "yolov8s.pt 와 yolov8n.pt 를 비교",
              "백본 후보로 EfficientNet 도 별도로 학습해 비교",
            ],
          },
          {
            title: "학습 하이퍼파라미터",
            points: [
              "optimizer — Adam / AdamW / SGD / NAdam / RAdam / RMSProp",
              "learning rate 0.001 / 0.005 / 0.01, freeze layer 1 / 3 / 10",
              "augmentation — U-Net 논문 기준(shift · rotate · zoom · flip)과 YOLO-NAS 기준 gaussian noise",
            ],
          },
        ],
        troublesLabel: "결과",
        troubles: [
          {
            title: "수치는 움직이는데 방향이 없었다",
            problem:
              "전체 mAP 는 여러 run 에 걸쳐 0.14~0.25 구간을 벗어나지 않았고, 클래스별 등락 방향은 run 마다 뒤집혔다. 같은 학습에서 Iliac Artery 가 0.127 → 0.439 로 급등하는 동안 Iliac Vein 은 0으로 붕괴했다.",
            solution:
              "run 별·클래스별 지표를 정리해, 조건을 바꾸면 수치가 움직이기는 하지만 방향이 일정하지 않다는 것을 확인했다.",
            effect:
              "'성능이 안 나온다'가 아니라 '조정이 일관되게 반영되지 않는다'로 문제를 다시 볼 근거가 됐다. 이 기록이 6번 항목의 출발점이다.",
            tags: ["실험 기록", "mAP"],
            tech: ["YOLOv8", "PyTorch"],
            details: [
              {
                heading: "학습 조건",
                blocks: [
                  {
                    type: "table",
                    head: ["항목", "값"],
                    rows: [
                      ["가중치", "yolov8s.pt / yolov8n.pt 비교"],
                      ["epoch / lr", "100 / 0.005 (initial = final)"],
                      ["freeze layer", "1 / 3 / 10"],
                      [
                        "optimizer",
                        "Adam, AdamW, SGD, NAdam, RAdam, RMSProp",
                      ],
                      ["learning rate", "0.001 / 0.005 / 0.01"],
                      [
                        "augmentation",
                        "U-Net 논문 기준 — shift 0.05 / rotate 0.2° / zoom 0.05 / horizontal flip · YOLO-NAS(CardioLab) 기준 — gaussian noise",
                      ],
                    ],
                  },
                ],
              },
              {
                heading: "run 별 전체 mAP50",
                blocks: [
                  {
                    type: "table",
                    head: ["run", "조건", "all"],
                    rows: [
                      ["01", "epoch 1", "0.245 (Appendix 0.265)"],
                      ["02", "epoch 1/3 → 2/3 → 3/3", "0.167 → 0.146 → 0.14"],
                      ["03", "epoch 1/3 → 2/3", "0.151 → 0.164"],
                      ["04", "—", "0.149"],
                    ],
                  },
                ],
              },
              {
                heading: "클래스별 mAP50 (run 02 / 03 / 04)",
                blocks: [
                  {
                    type: "table",
                    head: ["클래스", "02", "03", "04"],
                    rows: [
                      ["all", "0.167", "0.164", "0.149"],
                      ["Terminal Ileum", "0.235", "0.0701", "0.0858"],
                      ["Psoas", "0.257", "0.453", "0.416"],
                      ["Cecum", "0.303", "0.224", "0.26"],
                      ["Iliac Artery", "0.137", "0.0243", "0.0148"],
                      ["Iliac Vein", "0.0005", "0.0232", "0"],
                      ["Appendix", "0.073", "0.192", "0.118"],
                    ],
                  },
                  {
                    type: "text",
                    text: "클래스별 등락 방향이 run 마다 뒤집힙니다. Psoas 가 오르면 Terminal Ileum 이 떨어지고, 다음 run 에서 역전됩니다.",
                  },
                ],
              },
              {
                heading: "별도 기록 (60 epoch, 04/02 → 04/03)",
                blocks: [
                  {
                    type: "table",
                    head: ["클래스", "04/02", "04/03"],
                    rows: [
                      ["all", "0.149", "0.205"],
                      ["Iliac Artery", "0.127", "0.439"],
                      ["Psoas", "0.284", "0.372"],
                      ["Appendix", "0.187", "0.184"],
                      ["Cecum", "0.221", "0.197"],
                      ["Terminal Ileum", "0.0513", "0.0388"],
                      ["Iliac Vein", "0.0228", "0"],
                    ],
                  },
                  {
                    type: "text",
                    text: "같은 학습에서 한 클래스가 3배 이상 오르는 동안 다른 클래스는 0으로 떨어집니다. 조정과 결과 사이에 설명 가능한 상관이 없었습니다.",
                  },
                ],
              },
              {
                heading: "데이터셋 설정에서 어긋나는 지점",
                blocks: [
                  {
                    type: "code",
                    code: `path:  .../appendix_dataset/
train: appendix_train.txt
val:   appendix_valid.txt
test:  appendix_test.txt

nc: 6
names:
  0: Terminal ileum
  1: Psoas
  2: cecum
  3: Iliac artery
  4: Iliac vein
  5: Appendix`,
                  },
                  {
                    type: "list",
                    items: [
                      "names 를 리스트로 주면 나열 순서대로 0부터 자동 매칭되어 실제 라벨링 인덱스와 어긋날 수 있다 — dict 형태로 명시",
                      "인덱스는 반드시 0부터 시작해야 한다 (1부터 시작 시 nc 불일치 오류)",
                      "json 어노테이션은 클래스 라벨이 1부터, txt 는 0부터라 변환 시 오프셋 보정이 필요했다",
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "3. Segmentation 전환 — 배포 제약에서 역산한 모델 선정",
        when: "4/11~12",
        tagline:
          "선정 기준을 성능이 아니라 장비 탑재 가능성에 두었습니다.",
        metric: "CPU ONNX 86ms vs TensorRT 1.2ms",
        problemLabel: "성능만으로 고를 수 없던 이유",
        problemList: [
          "논문 벤치마크의 정확도는 다른 도메인·다른 하드웨어에서 측정된 값이라 그대로 옮겨오지 않는다",
          "실시간 판독 화면에 올라가려면 정확도보다 추론 지연이 먼저 통과해야 한다",
          "다중 구조물 과제이므로 개체를 하나로 뭉뚱그리는 모델은 정확도와 무관하게 쓸 수 없다",
        ],
        solutionLabel: "후보별 판단",
        solutionBlocks: [
          {
            title: "도메인 적합성으로 1차 배제",
            points: [
              "STU-Net / nnU-Net — CT 학습 모델. CT 는 영상이 clear 한 반면 초음파는 노이즈가 지배적이라, 같은 의료영상이어도 전이 이점이 없다고 판단해 배제",
              "TU-Net (Transformer + U-Net, joint loss) — 초음파 segmentation 을 직접 다뤘으나 FPS·연산속도 미공개로 탑재 판단이 불가해 보류",
            ],
          },
          {
            title: "태스크 요건으로 2차 배제",
            points: [
              "FastSAM — 단일 GPU 83 FPS 로 실시간이 가능하나 단일 클래스만 지원(모든 개체를 하나로 인식)해 배제. MobileSAM 도 상동",
              "YOLACT — real-time instance segmentation, FPS 확보로 후보에 유지",
            ],
          },
          {
            title: "YOLOv8-seg 채택",
            points: [
              "bbox 와 segmentation 을 동시에 지원하고, 기존 학습 환경을 그대로 재사용할 수 있다",
              "논문 벤치마크가 아니라 실제 배포 조건에서 측정한 추론 속도를 기준으로 최종 판단",
            ],
          },
        ],
        troublesLabel: "판단 근거",
        troubles: [
          {
            title: "논문에 적힌 FPS 하나로는 탑재 여부를 판단할 수 없었다",
            problem:
              "후보 모델의 성능 지표는 저마다 다른 하드웨어·다른 배치 조건에서 측정된 값이었고, 아예 공개하지 않은 모델도 있었다.",
            solution:
              "배포 환경별로 추론 속도를 직접 측정해 비교했다. CPU ONNX 와 TensorRT 를 같은 배치 구간에서 재고, 그 값을 채택 기준으로 삼았다.",
            effect:
              "같은 모델이 배포 환경에 따라 지연 시간이 수십 배 차이 났다. 실측값 없이는 탑재 가능 여부를 말할 수 없다는 것이 확인됐다.",
            tags: ["ONNX", "TensorRT", "배포 제약"],
            tech: ["ONNX", "TensorRT", "YOLOv8-seg"],
            details: [
              {
                heading: "후보 모델 비교",
                blocks: [
                  {
                    type: "table",
                    head: ["후보", "판단", "근거"],
                    rows: [
                      [
                        "STU-Net / nnU-Net",
                        "배제",
                        "CT 학습 모델. CT 는 영상이 clear 한 반면 초음파는 노이즈가 지배적 → 같은 의료영상이어도 전이 이점 없음",
                      ],
                      [
                        "TU-Net (Transformer + U-Net, joint loss)",
                        "보류",
                        "초음파 segmentation 을 직접 다뤘으나 FPS·연산속도 미공개 → 탑재 판단 불가",
                      ],
                      [
                        "FastSAM",
                        "배제",
                        "단일 GPU 83 FPS 로 실시간 가능하나 단일 클래스만 지원 (모든 개체를 하나로 인식)",
                      ],
                      ["MobileSAM", "배제", "상동"],
                      [
                        "YOLACT",
                        "후보",
                        "real-time instance segmentation, FPS 확보",
                      ],
                      [
                        "YOLOv8-seg",
                        "채택",
                        "bbox + seg 동시 지원, 기존 학습 환경 재사용",
                      ],
                    ],
                  },
                ],
              },
              {
                heading: "추론 속도 실측 (batch 8~10)",
                blocks: [
                  {
                    type: "code",
                    code: `CPU ONNX  :  86.1 / 155.7 / 317.0 / 572.4        ms
TensorRT  :  1.21 / 1.47 / 2.18 / 2.79 / 4.02    ms`,
                  },
                  {
                    type: "text",
                    text: "논문 벤치마크가 아니라 실제 배포 조건에서의 측정값을 기준으로 판단했습니다. 배포 환경에 따라 지연 시간이 수십 배 차이 났습니다.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "4. GT 레이블 데이터셋 생성",
        when: "4/15 · 4/16 · 4/18 · 4/24~25",
        tagline:
          "Segmentation 학습에는 폴리곤 좌표 형태의 정답 레이블이 필요합니다. CVAT 어노테이션을 YOLO 학습 포맷으로 변환해 직접 생성했습니다.",
        metric: "XML 파싱 → 클래스별 txt 병합 전환",
        problemLabel: "변환에서 막힌 지점",
        problemList: [
          "제공받은 이미지는 이미 크롭된 상태(900×600)인데, 마스크 좌표는 원본(1280×720) 기준으로 기록되어 있었다",
          "XML 의 name·id 태그가 지정 클래스명·실제 라벨링 인덱스와 다르게 기록되어 있었다",
          "CVAT 가 미검출 구조물을 프레임 밖 좌표로 기록해, 정규화하면 유효 범위(0~1)를 벗어났다",
        ],
        solutionLabel: "해결 경로",
        solutionBlocks: [
          {
            title: "좌표계 정합 (4/16)",
            points: [
              "중앙 크롭을 가정해 계산했으나 실제 크롭은 가로가 비대칭(좌 200 / 우 180)이었다",
              "크롭은 종횡비 변경이 아니라 여백 제거이므로, 스케일링이 아닌 shift 로 처리해야 한다는 점을 확인",
            ],
          },
          {
            title: "방식 A — XML 파싱 (4/15)",
            points: [
              "XML 트리를 파싱해 클래스별 폴리곤 좌표를 추출하고, 크롭 좌표계로 변환한 뒤 정규화해 기록",
              "name 태그 패턴 치환, id 역참조 등 6건의 이슈를 규명해 대응했으나 프레임 밖 좌표는 XML 단계에서 선별하기 어려웠다",
            ],
          },
          {
            title: "방식 B — 클래스별 txt 병합 (4/18)",
            points: [
              "XML 파싱 자체를 포기하고, CVAT 가 클래스별로 개별 출력하는 annotation txt 를 병합하는 방식으로 전환",
              "생성한 레이블은 mask 렌더링 함수로 확인한 뒤 학습에 투입",
            ],
          },
          {
            title: "단일 클래스 데이터셋 (4/24~25)",
            points: [
              "6개 클래스 중 Appendix 만 분리한 별도 데이터셋을 구성하고 클래스 id 를 0으로 통일",
              "객체가 없는 이미지는 빈(0KB) txt 로 유지해야 학습이 성립하며, 경로가 바뀌므로 listing txt 도 함께 재생성",
            ],
          },
        ],
        troublesLabel: "상세",
        troubles: [
          {
            title: "크롭된 이미지와 원본 기준 좌표가 어긋났다",
            problem:
              "제공받은 이미지는 이미 크롭된 상태(900×600)인데 마스크 좌표는 원본(1280×720) 기준이라, 그대로 렌더링하면 위치가 어긋났다.",
            solution:
              "중앙 크롭을 가정해 계산했으나 맞지 않았고, 실제로는 가로 제거량이 비대칭(좌 200 / 우 180)이었다. 픽셀 단위로 shift 한 뒤 크롭 해상도로 재정규화했다.",
            effect:
              "크롭은 종횡비를 바꾸는 조작이 아니라 여백을 잘라내는 조작이므로 스케일링이 아닌 shift 로 처리해야 한다는 점을 확인했다.",
            tags: ["좌표계 정합"],
            tech: ["Python", "OpenCV"],
            details: [
              {
                heading: "중앙 크롭 가정 → 실패",
                blocks: [
                  {
                    type: "code",
                    code: `1280 / 2 = 640      900 / 2 = 450      640 − 450 = 190
 720 / 2 = 360      600 / 2 = 300      360 − 300 =  60`,
                  },
                ],
              },
              {
                heading: "실제 크롭 값 — 가로가 비대칭",
                blocks: [
                  {
                    type: "code",
                    code: `가로 제거량 380  →  좌 200 / 우 180
세로 제거량 120  →  상  60 / 하  60`,
                  },
                ],
              },
              {
                heading: "최종 처리",
                blocks: [
                  {
                    type: "code",
                    code: `픽셀 shift :  x' = x − 200        y' = y − 60
정규화     :  nX = x' / 900       nY = y' / 600

검산 : 원본 (689, 280) → 크롭 좌표 (489, 220)`,
                  },
                ],
              },
            ],
          },
          {
            title: "XML 파싱으로는 GT 를 만들 수 없었다",
            problem:
              "정규화 결과가 1을 초과하는 케이스가 나왔다. CVAT 가 미검출 구조물을 프레임 밖 좌표(예: x = 1100)로 기록하고 outside 태그로만 표시하는데, 이를 XML 단계에서 선별하기 어려웠다.",
            solution:
              "XML 파싱 자체를 포기하고, CVAT 가 클래스별로 개별 출력하는 annotation txt 를 병합해 최종 레이블을 생성하는 merge_separate_annote 로 전환했다.",
            effect:
              "구조적으로 막히는 지점을 우회하는 대신 입력 자체를 바꿔 해결했다. 생성한 레이블은 mask 렌더링 함수로 확인한 뒤 학습에 투입했다.",
            tags: ["GT 생성", "CVAT"],
            tech: ["Python", "XML", "CVAT"],
            details: [
              {
                heading: "방식 A — XML 파싱에서 규명한 이슈",
                blocks: [
                  {
                    type: "code",
                    code: `CVAT XML  →  [class, x1, y1, x2, y2, ... xn, yn]  형태의 txt`,
                  },
                  {
                    type: "table",
                    head: ["#", "이슈", "대응"],
                    rows: [
                      [
                        "①",
                        "좌표 기준 불일치 (원본 vs 크롭본)",
                        "shift 후 재정규화",
                      ],
                      [
                        "②",
                        "정규화 기준",
                        "X / image_width, Y / image_height",
                      ],
                      [
                        "③",
                        "XML name 태그가 지정 클래스명이 아닌 CVAT 작업물 명으로 기록",
                        "re.sub 패턴 치환",
                      ],
                      [
                        "④",
                        "XML id 가 실제 라벨링 인덱스와 불일치",
                        "label 태그 순서에서 인덱스를 역참조",
                      ],
                      ["⑤", "파일 쓰기 모드 a / w", "덮어쓰기로 통일"],
                      ["⑥", "객체 구분 누락", "id 가 달라질 때마다 줄바꿈"],
                    ],
                  },
                ],
              },
              {
                heading: "드러난 구조적 한계",
                blocks: [
                  {
                    type: "code",
                    code: `(x − 200) / 900  →  결과가 1을 초과
원인: CVAT 가 미검출 구조물을 프레임 밖 좌표(예: x = 1100)로 기록
      XML 상 outside 태그 = 1  (interpolation 관련)`,
                  },
                ],
              },
              {
                heading: "방식 B — 클래스별 txt 병합",
                blocks: [
                  {
                    type: "code",
                    code: `class_0.txt ┐
class_1.txt ├→  merge_separate_annote  →  frame별 통합 label txt
    ⋮       ┘`,
                  },
                  {
                    type: "text",
                    text: "이후 6개 클래스 중 Appendix 만 분리한 단일 클래스 데이터셋도 구성했습니다. 클래스 id 를 0으로 통일하고, 객체가 없는 이미지는 빈(0KB) txt 로 유지해야 학습이 성립합니다. 경로가 바뀌므로 listing txt 도 함께 재생성했습니다.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "5. 데이터 처리 파이프라인",
        when: "4/21",
        tagline: "원본 영상에서 학습 데이터까지의 처리를 하나로 묶었습니다.",
        metric: "AVI → image → crop → annotation → train",
        problemLabel: "프레임별 크기 편차",
        problemList: [
          "1개 AVI 는 약 500 프레임이고, 앞뒤에는 학습에 쓸 수 없는 무효 구간이 있다",
          "같은 영상 안에서도 프레임마다 유효 영상 영역의 크기가 달랐다",
          "프레임별로 개별 크롭하면 데이터 크기가 제각각이 되고, 고정 크기로 자르면 일부 프레임의 유효 영역이 잘려나간다",
        ],
        solutionLabel: "처리 방식",
        solutionBlocks: [
          {
            title: "프레임 추출",
            points: [
              "1개 AVI 약 500 프레임 중 20~300번 구간만 사용해 앞뒤 무효 구간을 제외",
              "파일명을 000001~000XXX 형식으로 강제(0 최소 3개)해 문자열 정렬 오류를 방지",
            ],
          },
          {
            title: "영상 단위 대표 크롭",
            points: [
              "프레임마다 largest contour 의 사각형 좌표를 산출한 뒤, 그중 최빈값을 해당 AVI 의 대표 크롭 크기로 채택",
              "영상 내부의 일관성은 유지하면서 영상 간 편차는 개별 대응할 수 있다",
            ],
          },
          {
            title: "기록",
            points: [
              "프레임별 rectangle contour 는 txt 로 listing",
              "크롭 결과는 엑셀로 정리해 영상별 비교가 가능한 형태로 남김",
            ],
          },
        ],
        troublesLabel: "상세",
        troubles: [
          {
            title: "프레임별 크기 편차를 영상 단위 최빈값으로 흡수",
            problem:
              "프레임별로 개별 크롭하면 데이터 크기가 제각각이 되고, 고정 크기로 자르면 일부 프레임의 유효 영역이 잘려나간다.",
            solution:
              "contour 를 추출해 프레임마다 유효 영역의 사각형 좌표를 구한 뒤, 그중 최빈값을 그 영상의 대표 크롭 크기로 채택해 전 프레임에 동일하게 적용했다.",
            effect:
              "프레임별 노이즈에는 흔들리지 않으면서, 영상마다 다른 촬영 조건에는 각각 대응할 수 있게 됐다.",
            tags: ["OpenCV", "데이터 파이프라인"],
            tech: ["Python", "OpenCV"],
            details: [
              {
                heading: "처리 흐름",
                blocks: [
                  {
                    type: "code",
                    code: `AVI  →  image  →  crop  →  annotation  →  train`,
                  },
                ],
              },
              {
                heading: "대표 크롭 크기 산출",
                blocks: [
                  {
                    type: "code",
                    code: `1. cv2.findContours 로 contour 추출
2. boundingRect 로 두 끝 지점 → (startX, startY, boxW, boxH)
3. 모든 프레임의 largest contour 좌표 산출
4. 그중 최빈값(highest occurrence) 채택
5. 해당 AVI의 전 프레임을 동일 크기로 crop`,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "6. 병목의 재정의 — 모델이 아니라 정답 데이터",
        tagline:
          "지표가 오르지 않을 때 학습을 한 번 더 돌리는 대신, 어디가 막혔는지를 물었습니다.",
        metric: "조정과 결과 사이에 설명 가능한 상관이 없음",
        problemLabel: "관측",
        problemList: [
          "여러 run 에서 전체 mAP 가 0.14~0.25 구간을 벗어나지 못함",
          "클래스별 등락 방향이 run 마다 뒤바뀜 — Psoas ↑ ↔ Terminal Ileum ↓, 다음 run 에서 역전",
          "Iliac Vein 은 여러 run 에서 0에 가까운 값",
          "조정과 결과 사이에 설명 가능한 상관이 없음",
        ],
        solutionLabel: "가설 → 검증 → 확인",
        solutionBlocks: [
          {
            title: "가설 — 조정하는 쪽이 아니라 기준이 되는 쪽",
            points: [
              "성능이 낮은 것보다, 조정이 일관된 방향으로 반영되지 않는다는 점이 문제였다",
              "조정하는 쪽이 아니라 기준이 되는 쪽에 원인이 있을 가능성이 높다고 판단 — 문제가 모델이 아니라 정답 데이터에 있다",
            ],
          },
          {
            title: "검증 — 판단할 지식을 가진 사람을 직접 찾아감",
            points: [
              "초음파 영상에서 구조물 경계가 올바르게 그려졌는지는 임상 지식 없이 판단할 수 없었다",
              "사내 상주 임상의를 직접 찾아가 원본 영상과 레이블링 결과를 함께 검토해달라고 요청",
              "진행 중인 학습 방식과 결과를 설명하고 어디를 봐야 하는지 판단을 구함",
            ],
          },
          {
            title: "확인 — 학습 성립 요건 자체를 못 맞추고 있었다",
            points: [
              "GT 마스크가 실제 구조물 경계보다 과도하게 넓게 그려져 있었다",
              "이 상태로는 모델을 어떻게 조정해도 학습이 성립하지 않는다는 판단을 받음",
              "정답 데이터를 재구축하지 않는 한 진행 의미가 없다는 결론을 정리해 보고",
            ],
          },
        ],
        troublesLabel: "같은 시기에 확인된 제약",
        troubles: [
          {
            title: "성능·속도를 통과해도 제품에 못 들어가는 조건이 있었다",
            problem:
              "정확도와 추론 속도를 기준으로 YOLOv8-seg 를 채택해 학습까지 진행했는데, YOLOv8(Ultralytics)의 라이선스는 AGPL-3.0이었다.",
            solution:
              "상용 의료기기 제품에 탑재하려면 소스 공개 의무가 발생하거나 별도의 상용 라이선스 취득이 필요하다는 점을 확인해, 성능·속도 요건과 무관하게 제품 탑재가 불가하다는 사실을 정답 데이터 사안과 함께 정리해 보고했다.",
            effect:
              "속도와 정확도로 모델을 고르는 데까지는 갔지만, 제품에 들어가려면 라이선스처럼 기술 지표 바깥의 조건이 먼저 통과되어야 한다는 것을 이때 알게 됐다.",
            tags: ["AGPL-3.0", "제품 제약"],
            tech: ["YOLOv8", "Ultralytics"],
          },
        ],
      },
    ],
    features: [],
    closingLabel: "마무리",
    closing: [
      "이 프로젝트에서 만든 모델은 제품이 되지 못했습니다.",
      "두 달 동안 실제로 한 일은 모델을 학습시킨 것이 아니라 학습이 가능한 상태를 만드는 일이었습니다. 영상을 처리 가능한 형태로 정리하고, 정답 레이블을 직접 생성하고, 각 단계의 결과를 눈으로 확인할 수 있는 도구를 만들었습니다. 그 도구들이 있었기 때문에 좌표계 불일치도, 클래스 인덱스 오류도, 결국 정답 데이터의 문제도 발견할 수 있었습니다.",
      "지표가 오르지 않을 때 학습을 한 번 더 돌리는 대신 어디가 막혔는지 규명하는 것, 그리고 판단에 필요한 지식이 없을 때 그것을 가진 사람을 직접 찾아가는 것. 이 두 가지가 이 프로젝트에서 남은 것입니다.",
    ],
    writeupsLabel: "기술 블로그",
    writeups: [
      {
        title:
          "[YOLOv8] .yaml 파일 클래스 구성 (3/27) — 클래스 인덱스 매칭 오류의 원인·증상·검증법",
        href: "https://blog.naver.com/t3335150/223396924265",
      },
      {
        title: "YOLOv8-seg 세그멘테이션 학습 (4/15)",
        href: "https://blog.naver.com/t3335150/223415861451",
      },
      {
        title: "XML 파일을 txt로 변환 (4/15)",
        href: "https://blog.naver.com/t3335150/223416017978",
      },
      {
        title: "Nerve 데이터셋 (4/18)",
        href: "https://blog.naver.com/t3335150/223419636271",
      },
      {
        title: "Appendix 단일 클래스 Segmentation 학습 (4/24~25)",
        href: "https://blog.naver.com/t3335150/223426876321",
      },
      {
        title: "데이터 처리 파이프라인 — crop (4/21)",
        href: "https://blog.naver.com/t3335150/223427039001",
      },
    ],
  },
];

export function getLightProject(slug: string): LightProject | undefined {
  return lightProjects.find((p) => p.slug === slug);
}

export const lightProjectSlugs = lightProjects.map((p) => p.slug);
