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

/* 풀버전 상세 — 아코디언에 펼쳐지는 심화 블록 */
export interface TroubleDetail {
  /** 소제목 + 문단 (원인 분석, 해결 방법 비교, 적용 후, 배운 점 등) */
  heading: string;
  paragraphs?: string[];
  /** 표 (해결 방법 비교 등): 헤더 행 + 본문 행들 */
  table?: { head: string[]; rows: string[][] };
  /** 코드 블록 */
  code?: string;
}

/* 트러블슈팅·기술적 의사결정 — 슬림(문제→해결→효과) + 풀버전(details) */
export interface TroubleItem {
  title: string;
  stars?: number; // 중요도 (1~5)
  problem: string;
  solution: string;
  effect: string;
  tags?: string[];
  diagram?: "route"; // 곁들일 다이어그램
  details?: TroubleDetail[]; // 아코디언 풀버전
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
            title: "배포·실행 환경 차이 — Vector DB 생성 & 캐시 무효화",
            stars: 5,
            problem:
              "로컬에서는 정상 동작하던 RAG가 배포 환경에서 Chroma Vector DB 생성에 실패했고, 캐시가 있어도 Vector DB를 매 요청마다 다시 로드해 불필요한 파일 접근과 재임베딩이 반복됐습니다.",
            solution:
              "절대경로를 프로젝트 기준 상대경로로 변경해 환경 의존성을 제거하고, _vectordb = None 초기화를 제거해 인메모리 캐시를 복구했으며, 경로·빈 문서에 대한 예외 처리를 추가했습니다.",
            effect:
              "로컬과 배포 환경에서 동일하게 동작하는 구조를 구축하고, 첫 요청 이후에는 Vector DB를 재사용해 반복적인 로딩과 재임베딩을 제거했습니다.",
            tags: ["배포환경", "벡터DB", "캐싱", "RAG"],
            details: [
              {
                heading: "원인 ① — 배포 환경에서 Vector DB 생성 실패",
                paragraphs: [
                  "persist_dir 기본 경로를 \"/RAG/chroma\"로 설정했는데, 앞의 / 때문에 프로젝트 내부가 아닌 파일 시스템 루트 경로를 의미하게 됐습니다. 배포 환경에서는 그 위치에 디렉터리를 생성할 권한이 없어 Vector DB 생성이 실패했습니다. 로컬과 배포 환경의 파일 시스템·권한 차이를 고려하지 못한 것이 원인이었습니다.",
                ],
                code: `persist_dir="/RAG/chroma"   # 앞의 / → 파일시스템 루트 경로`,
              },
              {
                heading: "원인 ② — 캐시가 동작하지 않는 구조",
                paragraphs: [
                  "Vector DB를 한 번만 생성해 재사용하려고 전역 캐시(_vectordb)를 뒀지만, 함수가 호출될 때마다 _vectordb = None이 실행되고 있었습니다. 이 때문에 아래 캐시 분기가 항상 거짓이 되어 DB를 매 요청마다 다시 로드했습니다. 캐시를 구현했음에도 실제로는 전혀 활용되지 않는 구조였습니다.",
                ],
                code: `global _vectordb
_vectordb = None            # 매 호출마다 캐시 초기화

if _vectordb:               # → 항상 거짓이 되어 캐시 미사용
    return _vectordb`,
              },
              {
                heading: "해결 — 상대경로 · 캐시 복원 · 예외 처리",
                code: `# 1) 저장 경로를 상대경로로
- persist_dir="/RAG/chroma"
+ persist_dir="RAG/chroma"

# 2) 불필요한 초기화 제거 → 최초 1회만 생성, 이후 메모리 재사용
- _vectordb = None
+ # _vectordb = None

# 3) 예외 처리 추가 (로그 출력 후 재발생 → 원인 즉시 확인)
+ if not os.path.exists(source_folder):
+     raise FileNotFoundError(...)
+ if len(raw_documents) == 0:
+     raise ValueError("문서가 비어 있습니다.")`,
              },
              {
                heading: "적용 결과",
                paragraphs: [
                  "프로젝트 기준 상대경로를 사용해 로컬과 배포 환경 모두 동일한 방식으로 동작합니다.",
                  "Vector DB 캐시가 정상 동작해 첫 로딩 이후에는 DB를 다시 생성하거나 로드하지 않습니다.",
                  "문서 경로 오류·빈 문서 같은 예외를 사전 검증해 문제 원인을 빠르게 파악할 수 있는 구조를 만들었습니다.",
                ],
              },
              {
                heading: "배운 점",
                paragraphs: [
                  "배포 환경에서는 파일 경로와 권한까지 고려한 설계가 필요하다는 점을 배웠습니다.",
                  "캐시는 단순히 구현하는 것이 아니라 실제로 동작하는지 검증하는 과정이 중요하다는 것 — _vectordb = None 한 줄 때문에 캐시가 완전히 무력화돼 있었고, 성능 문제의 원인은 새로운 기능이 아니라 기존 로직을 정확히 분석하는 과정에서 발견할 수 있었습니다.",
                ],
              },
            ],
          },
          {
            title: "질문 라우팅 아키텍처 재설계 — 응답 품질 & UX 개선",
            stars: 5,
            problem:
              "모든 질문을 하나의 응답 흐름에서 처리해 데이터 소스가 혼재됐고, 무관 질문을 차단하는 과정에서는 정상적인 UX 대화까지 함께 차단되는 Over-blocking이 발생했습니다.",
            solution:
              "Intent Classifier와 LangGraph 조건부 라우팅으로 질문을 역할별 노드(RAG·Cow Info·General·Irrelevant)에 분기하고, general 노드의 책임을 재정의해 UX 대화를 분리했습니다.",
            effect:
              "질문 유형별 데이터 소스가 명확히 분리돼 답변 품질이 안정화됐고, 서비스 정체성과 사용자 경험을 모두 유지하는 라우팅 구조를 구축했습니다.",
            tags: ["LangGraph", "라우팅설계", "의도분류", "RAG"],
            diagram: "route",
            details: [
              {
                heading: "문제 상황",
                paragraphs: [
                  "소담이 챗봇은 하나의 서비스 안에서 성격이 서로 다른 질문 — 낙농 일반 지식, 사용자 농장의 특정 소 조회, 챗봇과의 자연스러운 대화 — 을 처리해야 했습니다. 초기에는 질문 유형을 구분하지 않고 하나의 응답 흐름에서 모두 처리했습니다.",
                  "이로 인해 두 가지 문제가 생겼습니다. ① '103번 소 상태 알려줘'(특정 소 조회)와 '젖소 발정 주기는?'(일반 지식)처럼 필요한 데이터 소스가 다른 질문이 같은 경로에서 처리돼 답변 품질이 일정하지 않았습니다. ② '로또 번호 알려줘', '오늘 점심 뭐 먹지?'처럼 서비스와 무관한 질문에도 LLM이 그대로 응답하면서 낙농 전문 챗봇이라는 정체성이 흐려졌습니다.",
                ],
              },
              {
                heading: "원인 분석",
                paragraphs: [
                  "근본 원인은 질문의 의도(Intent)를 먼저 판별하는 단계가 없었다는 것이었습니다. 질문마다 필요한 데이터 소스가 다른데, 구분 없이 하나의 응답 흐름으로 처리하니 적절한 소스를 고르지 못했습니다. 결국 의도보다 응답 생성이 먼저 이루어지는 구조 자체가 문제였습니다.",
                ],
                table: {
                  head: ["질문 유형", "필요한 데이터"],
                  rows: [
                    ["낙농 일반 지식", "RAG 문서 검색"],
                    ["특정 소 조회", "농장 DB"],
                    ["자연스러운 대화", "대화 Context"],
                  ],
                },
              },
              {
                heading: "해결 1 — 질문 분류(Classifier)를 독립 노드로 분리",
                paragraphs: [
                  "응답 생성 이전에 의도를 분류하는 classify_question_route 노드를 그래프 시작 단계에 뒀습니다. 분류는 창의성보다 항상 같은 결과를 내는 일관성이 중요하다고 판단해 temperature=0으로 설정했고, rag·cow_info·general·irrelevant 4종 중 하나만 반환하게 했습니다.",
                ],
                code: `llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
chain = prompt | llm | StrOutputParser()
result = chain.invoke({"question": state["current_question"]})`,
              },
              {
                heading: "해결 2 — 유형별 전용 노드로 라우팅",
                paragraphs: [
                  "분류 결과에 따라 add_conditional_edges()로 질문을 서로 다른 처리 노드에 연결했습니다. 각 노드가 하나의 책임(RAG 검색 / 농장 DB 조회 / UX 대화 / 무관 차단)만 수행하도록 설계했습니다.",
                ],
                code: `builder.add_conditional_edges("classifier", route_by_answer_type, {
    "rag":        "rag_response",        # RAG 문서 검색
    "cow_info":   "cow_info_graph",      # 농장 DB 조회
    "general":    "general_response",    # UX 대화
    "irrelevant": "irrelevant_response", # 무관 질문 차단
})`,
              },
              {
                heading: "해결 3 — 새 문제: Over-blocking",
                paragraphs: [
                  "실제 테스트에서 예상 못한 문제가 나왔습니다. 무관 질문만 차단하려던 irrelevant가 '고마워', '너 누구야?', '내가 아까 뭐 물어봤지?'처럼 챗봇으로서 자연스럽게 응답해야 할 UX 대화까지 모두 차단하고 있었습니다. '낙농 관련 질문에만 답변할 수 있습니다'가 반환되면서 오히려 사용자 경험이 저하됐습니다.",
                ],
              },
              {
                heading: "해결 4 — 해결 방법 검토",
                paragraphs: [
                  "처음엔 UX 대화용 새 노드를 추가할까 고려했습니다. 하지만 분석해 보니 처리 노드가 부족한 게 아니라 질문 유형의 경계가 잘못 정의된 것이 원인이었습니다. 노드를 계속 추가하면 그래프만 복잡해지고 역할이 중복될 수 있어, 새 노드 대신 기존 노드의 책임을 다시 정의하기로 했습니다.",
                ],
              },
              {
                heading: "해결 5 — General 노드 역할 재정의 (핵심)",
                paragraphs: [
                  "기존에 단순 일반 대화 정도로 뒀던 general을 '낙농 질문은 아니지만 챗봇으로서 반드시 응답해야 하는 UX 대화 전담 노드'로 재정의했습니다. 최종 경계는 — 낙농 관련→rag, 특정 소 조회→cow_info, 기억·감사·인사·소개 등 UX 대화→general, 로또·주식·정치 등 무관→irrelevant. 이로써 '내가 아까 뭐 물어봤지?', '고마워' 같은 질문이 general로 라우팅돼 정상 응답됩니다.",
                ],
              },
              {
                heading: "해결 6 — Cow 정보 분류 기준 정밀화",
                paragraphs: [
                  "멀티턴 대화에서 개체 조회가 자연스럽게 이어지도록 cow_info 분류 기준도 개선했습니다(커밋 0de1fea, 37f642e). 기존엔 '103번 소' 정도만 인식했지만, 12자리 이표번호·'그 소'·'그 아이'까지 cow_info로 분류하도록 확장해, '103번 소 상태 알려줘' → '그 소 어제 분만했어?' 같은 후속 질문도 같은 개체 조회 흐름으로 라우팅됩니다.",
                ],
              },
              {
                heading: "해결 7 — LLM 오출력 방어",
                paragraphs: [
                  "분류를 LLM이 수행하므로 정의되지 않은 문자열이 반환될 가능성도 고려해, 4종 외의 값이 오면 irrelevant로 처리하는 방어 로직을 넣었습니다.",
                ],
                code: `if result not in {"rag", "cow_info", "general", "irrelevant"}:
    result = "irrelevant"`,
              },
              {
                heading: "적용 결과",
                paragraphs: [
                  "질문을 응답 생성 이전에 먼저 분류하고, 결과에 따라 적절한 데이터 소스로 연결하는 라우팅 아키텍처를 구축했습니다.",
                  "무관 질문을 사전 차단해 낙농 전문 챗봇이라는 서비스 정체성을 유지했습니다.",
                  "general 노드 재정의로 Over-blocking을 해결하고 자연스러운 UX 대화를 유지했습니다.",
                  "지시어와 12자리 이표번호까지 인식하도록 분류 기준을 확장해 멀티턴 대화 정확도를 높였습니다.",
                  "질문 유형과 노드 책임을 명확히 분리해, 새 유형이 추가돼도 분류 규칙과 처리 노드만 확장하면 되는 구조를 갖췄습니다.",
                ],
              },
              {
                heading: "배운 점",
                paragraphs: [
                  "가장 중요했던 것은 '4가지로 분류한 것' 자체가 아니라, 라우팅 구조를 설계하는 과정에서 생긴 문제를 다시 설계로 해결한 경험이었습니다. irrelevant를 추가하면 무관 질문이 해결될 줄 알았지만, 정상 UX 대화까지 차단되는 부작용을 확인했고, 원인이 노드 개수가 아니라 질문 경계와 각 노드의 책임 정의에 있다는 걸 발견했습니다.",
                  "새 노드를 계속 추가하는 대신 기존 노드의 역할을 재정의해 그래프를 단순하게 유지하면서 사용자 경험과 확장성을 함께 확보했습니다. 또 LLM 기반 라우팅에서는 분류 정확도뿐 아니라 예상 못한 출력에 대한 방어까지 함께 설계해야 안정적이라는 걸 배웠습니다.",
                ],
              },
            ],
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
            details: [
              {
                heading: "해결 방법 비교",
                table: {
                  head: ["항목", "프롬프트 내부 처리", "LangGraph 노드 분기"],
                  rows: [
                    ["응답 속도", "빠름 (한 번에 처리)", "느림 (재분기 필요)"],
                    ["유지보수", "쉬움", "복잡"],
                    ["의도 제어", "'없으면 지식으로' 지시로 명확", "흐름 중첩 위험"],
                    ["구현 난이도", "낮음", "높음 (상태 추가 전달)"],
                  ],
                },
              },
              {
                heading: "왜 프롬프트 처리인가",
                paragraphs: [
                  "no-hit는 별도 노드로 분기할 만큼 복잡한 상태 전이가 아니라, 프롬프트 한 곳에서 조건부 지시로 처리할 수 있는 케이스라고 판단했습니다. 노드를 늘리면 그래프만 복잡해질 뿐 얻는 게 없었습니다.",
                ],
              },
              {
                heading: "핵심 코드",
                code: `context = context.strip() or "※ 참고할 문서가 없습니다."   # 빈 검색결과를 명시적 신호로

# 프롬프트
"""아래 참고 자료를 우선 사용하되,
자료가 비었거나 답을 찾을 수 없으면 알고 있는 지식·상식으로 답해도 됩니다.
[참고 자료]
{context}"""`,
              },
              {
                heading: "배운 점",
                paragraphs: [
                  "RAG의 완성도는 잘 찾을 때가 아니라 못 찾을 때의 동작에서 갈린다는 것, 그리고 모든 예외를 노드로 쪼갤 필요는 없고 처리 위치(프롬프트 vs 그래프)를 비용 대비로 고르는 게 설계라는 걸 배웠습니다.",
                ],
              },
            ],
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
            details: [
              {
                heading: "핵심 코드",
                code: `chat_memory_store: Dict[Tuple[str, str], List[str]] = {}

def append_chat_memory(user_id, chat_id, question, answer):
    key = (user_id, chat_id)
    memory = chat_memory_store.get(key, [])   # 없으면 빈 리스트
    memory += [f"사용자: {question}", f"소담이: {answer}"]
    chat_memory_store[key] = memory`,
              },
              {
                heading: "배운 점",
                paragraphs: [
                  "메모리를 어떤 키와 자료구조로 들고 있느냐가 멀티턴 품질과 확장성을 좌우한다는 것, LLM에겐 dict보다 사람이 읽는 대화 텍스트가 더 잘 맞는다는 것을 배웠습니다.",
                ],
              },
            ],
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
            details: [
              {
                heading: "핵심 코드",
                code: `base_name = os.path.splitext(file_name)[0]   # 확장자 제거한 파일명만 metadata로
documents.append(Document(page_content=chunk, metadata={"source": base_name}))

# 출력 규칙: 중복 제거 · 기호 제거 · 질문 언어별 [출처]/[Source] 분기`,
              },
              {
                heading: "반복 개선 과정",
                paragraphs: [
                  "한 번에 끝나지 않고 커밋 c2f4e1a → 5961f94 → 83f0337 → b945b5a → 5d29b8a로 이어진 관찰→수정의 반복이었습니다.",
                ],
              },
              {
                heading: "배운 점",
                paragraphs: [
                  "근거를 '보여주는 것'과 '보기 좋게 보여주는 것'은 별개이며, 사용자에게 닿는 마지막 한 줄까지 다듬는 게 제품 완성도입니다. 여러 커밋에 걸쳐 관찰→수정을 반복한 과정 자체가 실무에 가까웠습니다.",
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
