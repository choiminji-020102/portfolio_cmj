/*
  min-hyuk 스타일 경량 프로젝트 상세.
  월간지(lib/projects.ts)는 문제·기능·챌린지·다이어그램의 깊은 구조를 쓰고,
  이쪽은 스크린샷 갤러리 + 기능 불릿 + 트러블슈팅의 가벼운 구조를 쓴다.

  screenshots 가 비어 있으면 갤러리는 플레이스홀더를 보여준다 — 자료가 오면 채운다.
*/
import type { CodeLang } from "./highlight";

export interface Trouble {
  title: string;
  body: string;
  image?: string;
}

/* 해결책을 제목+불릿으로 쪼갠 블록 (챗봇처럼 해결이 여러 갈래일 때) */
export interface SolutionBlock {
  /* 원문에 소제목이 없으면 비운다 — 없는 제목을 지어내지 않는다 */
  title?: string;
  points: string[];
  /* 불릿을 코드 앞에 둔다 (원문이 목록 → 코드 순서인 경우) */
  pointsFirst?: boolean;
  /* 블록을 닫는 문단 — 불릿이 아니라 서술로 끝나는 원문을 위해 */
  note?: string;
  /* 제목 바로 아래 붙는 그림 — 원문에서 소제목 다음에 오던 자리를 그대로 지킨다 */
  figure?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    caption?: string;
  };
  /* 그림과 불릿 사이에 끼는 계산 과정 */
  code?: string;
  /* code 의 언어. 주지 않으면 색을 입히지 않는다 (계산식·출력 예시용) */
  lang?: CodeLang;
  /* "side" — 코드와 그림을 좌우로 나란히, 그림 높이를 코드에 맞춘다.
     세로로 긴 그림(그래프 구조도)이 혼자 커지는 것을 막는다.
     기본(미지정)은 그림 → 코드 세로 배치 */
  layout?: "side";
}

/* 풀버전 상세 — 문서 순서 그대로 섞이는 블록들 */
export type TroubleBlock =
  | { type: "sub"; text: string } // 굵은 소제목 (1. 2. 등)
  | { type: "text"; text: string } // 문단
  | { type: "code"; code: string; lang?: CodeLang } // 코드 블록
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
  /* 표(table)가 문제와 원인을 다 담는 항목은 두 줄을 비운다 — 같은 말을 두 번 쓰지 않는다 */
  problem?: string;
  solution?: string;
  effect: string;
  tags?: string[];
  tech?: string[]; // 풀버전 상단 기술 스택
  diagram?: "route"; // 곁들일 다이어그램
  /* 문제·해결 자리를 대신하는 표 — 서랍에 넣지 않고 본문에 펼쳐둔다 */
  table?: { head: string[]; rows: string[][] };
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
  /* 항목 전체에 걸리는 표 (후보 비교 등) — 트러블에 억지로 끼우지 않고 본문에 펼친다.
     note 는 표를 받아 닫는 문장 */
  table?: {
    label?: string;
    head: string[];
    rows: string[][];
    note?: string;
  };
  /* 본문 아래 풀폭 설명 그림 — 글로 풀면 길어지는 좌표계·파이프라인 구조를 대신한다.
     오른쪽 사이드에 붙는 image(240px)와 달리 본문 폭을 다 쓴다 */
  figures?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    caption?: string;
  }[];
  troubles?: TroubleItem[]; // 트러블슈팅·기술적 의사결정
  /** troubles 섹션 라벨. 기본값 '트러블슈팅 · 기술적 의사결정' */
  troublesLabel?: string;
  /** 이 항목을 다룬 외부 글 — 하단 목록과 별개로, 읽는 자리에서 바로 넘어갈 수 있게 */
  writeups?: { title: string; href: string }[];
}

/* 여러 절로 나뉘는 구현 상세 — AI / 백엔드 / 트러블슈팅처럼
   같은 카드 모양을 쓰되 큰 제목으로 갈라야 하는 묶음 */
export interface FeatureGroup {
  label: string;
  /** 묶음 첫머리 리드 문장 */
  intro?: string;
  items?: AiFeature[];
  /** 카드까지 갈 것 없이 불릿으로 끝나는 절 */
  points?: string[];
}

export interface LightProject {
  slug: string;
  title: string;
  badge: string;
  period: string;
  /* 진행 상태 — 메타 줄 세 번째 칸. 월간지 상세와 같은 자리를 쓴다 */
  status?: string;
  teamSize: string;
  /** 제목 바로 아래 한 줄 — 스크롤 없이 역할이 잡히게 한다 (요약보다 앞) */
  tagline?: string;
  summary: string;
  /** 요약이 여러 문단일 때 이어지는 나머지 — summary 는 메타 description 에도 쓰이므로 첫 문단만 담는다 */
  summaryMore?: string[];
  stack: string[];
  github?: string;
  homepage?: string;
  /** homepage 버튼 라벨. 기본값 '홈페이지' */
  homepageLabel?: string;
  /** 시연 영상 — GitHub 버튼 옆에 나란히. 상단에서 바로 결과물로 진입하는 통로 */
  demo?: string;
  /** demo 버튼 라벨. 기본값 '시연 영상' */
  demoLabel?: string;
  /** 발표자료 PDF — 새 탭에서 열린다 (public/ 아래 경로) */
  slides?: string;
  /** slides 버튼 라벨. 기본값 '발표자료' */
  slidesLabel?: string;
  screenshots: string[];
  /** 과제 개요 — 대상·클래스·데이터·태스크 같은 사실 항목 */
  overview?: { label: string; value: string }[];
  /** overview 섹션 라벨. 기본값 '과제 개요' */
  overviewLabel?: string;
  /** 작업 타임라인 — 시점별로 무엇을 만들었는지 */
  timeline?: { when: string; what: string }[];
  /** 타임라인 아래 붙는 단서 문장 */
  timelineNote?: string;
  /** 과제 개요 아래 참고 이미지 — 검출 대상이 어떻게 생겼는지 보여준다 */
  overviewFigures?: {
    src: string;
    width: number;
    height: number;
    alt: string;
    /** 이미지에 라벨된 구조물 */
    caption?: string;
  }[];
  /** overviewFigures 라벨. 기본값 '참고 이미지' */
  overviewFiguresLabel?: string;
  /** 참고 이미지의 성격을 밝히는 문장 — 프로젝트 데이터로 오해되지 않게 한다 */
  overviewFiguresNote?: string;
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
  /** 배경 안에 펼치는 표 — 기존 대안과 그 한계처럼 배경의 근거가 표인 경우 */
  backgroundTable?: { label?: string; head: string[]; rows: string[][] };
  /** 배경을 닫는 문단들 — 표 아래로 이어지는 결론 */
  backgroundClosing?: string[];
  /** 배경 마지막에 짚는 기능 축 — 담당 항목은 mine 으로 표시한다 */
  backgroundScope?: { label: string; text: string; mine?: boolean }[];
  /** 팀 프로젝트에서 본인이 담당한 역할 (리드 문장) */
  myRole?: string;
  /** myRole 섹션 라벨. 기본값 '내가 맡은 역할' */
  myRoleLabel?: string;
  /** 내가 맡은 역할 — 담당 축(영역) */
  myRoleAreas?: { title: string; desc: string }[];
  /** 내가 맡은 역할 — 작업 범위(순서) */
  myRolePipeline?: string[];
  /** 내가 맡은 역할 — 구조·흐름 다이어그램 (mermaid 원문) */
  myRoleDiagrams?: { caption?: string; chart: string }[];
  /** 결과물 — "무엇을 만들었나"를 화면으로 먼저 보여주는 구간.
      코드·모델 배치 같은 기술 상세보다 앞에 온다.
      note 는 캡처 앞(리드 문장 아래)에 놓인다 */
  showcase?: {
    label: string;
    intro?: string;
    shots: {
      src: string;
      width: number;
      height: number;
      /** 화면 이름 */
      title: string;
      /** 그 화면이 하는 일 한 줄 */
      desc: string;
      /** 2단 배치에서 어느 칸에 놓을지. 하나라도 지정하면 2단이 된다.
          세로로 긴 캡처를 2번 칸에 혼자 두면 짧은 캡처 여러 장과 높이가 맞는다.
          기본값 1 (좁은 화면에서는 칸 구분 없이 원래 순서대로 쌓인다) */
      column?: 1 | 2;
    }[];
    /** 캡처 아래 붙는 단서 문장 */
    note?: string;
  };
  /** 핵심 AI 기능 상세 (문제→해결→수치) */
  aiFeatures?: AiFeature[];
  /** aiFeatures 섹션 라벨. 기본값 '핵심 AI 기능' */
  aiFeaturesLabel?: string;
  /** 절이 여러 개로 갈리는 구현 상세 — aiFeatures 와 같은 카드를 큰 제목으로 묶는다 */
  featureGroups?: FeatureGroup[];
  features: string[];
  /** features 섹션 라벨. 기본값 '그 외 기능' */
  featuresLabel?: string;
  /** features 목록 위에 붙는 리드 문장 */
  featuresIntro?: string;
  /** 기존 서비스 대비 차별점 */
  differentiators?: string[];
  /** 활용한 공공데이터·외부 데이터 */
  dataSources?: string[];
  troubles?: Trouble[];
  /** 사용 기술 — 구분별 표. 회고 바로 앞, 본문을 닫는 자리에 온다
      (상단 '과제 개요'(overview)와 달리 문서 후반의 기술 정리용) */
  techStack?: { label: string; value: string }[];
  /** techStack 섹션 라벨. 기본값 '사용 기술' */
  techStackLabel?: string;
  /** 마무리 회고 — 결과가 아니라 무엇이 남았는지 */
  closing?: string[];
  /** 회고를 갈래로 나눠 쓰는 경우 (잘한 점 / 아쉬운 점 / 더 해본다면) */
  closingGroups?: { title: string; points: string[] }[];
  /** closing 섹션 라벨. 기본값 '마무리' */
  closingLabel?: string;
  /** 작업 중 정리한 외부 글(기술 블로그 등) — 본문에서 덜어낸 상세의 근거 */
  writeups?: { title: string; href: string }[];
  /** writeups 섹션 라벨. 기본값 '작업 기록' */
  writeupsLabel?: string;
  /** writeups 목록 아래 붙는 단서 문장 */
  writeupsNote?: string;
}

export const lightProjects: LightProject[] = [
  /*
    다 맡케팅 상세 — files/다맡케팅-포트폴리오.md 가 바탕이지만 절 순서를 다시 짰다.
    읽는 사람이 스택을 먼저 확인하고 결과물을 본 뒤 기술 상세로 들어가도록:
      1 배경 · 2 담당 범위 · 3 사용 기술 · 4 결과물 · 5 AI · 6 백엔드 · 7 트러블슈팅 · 8 회고.
    원문 5절(프론트엔드)은 화면 캡처가 본문이라 4절 결과물로 흡수했다.
    캡처 4장과 demo.mp4 는 팀 시연 영상에서 뽑아 public/damatketing/ 에 둔다.
  */
  {
    slug: "damatketing",
    title: "다 맡케팅",
    badge: "KT AIVLE · 대상",
    period: "2025.07.07 — 2025.09.02 (약 2개월)",
    teamSize: "7명 (AI/백엔드 5, AI/프론트 2)",
    tagline:
      "7인 팀 프로젝트에서 SNS 마케팅 도메인을 AI 파이프라인부터 화면까지 담당",
    summary: "소상공인을 위한 AI 마케팅 자동화 플랫폼입니다.",
    stack: [
      "Python",
      "FastAPI",
      "LangChain",
      "LangGraph",
      "OpenAI API",
      "Java",
      "Spring Boot",
      "Kafka",
      "OAuth 2.0",
      "YouTube Data API",
      "AWS S3",
      "React",
      "Redux",
      "Docker",
      "MSA",
    ],
    github: "https://github.com/KT-AIVLE-04",
    demo: "/damatketing/demo.mp4",
    screenshots: [],
    backgroundLabel: "1. 프로젝트 배경",
    background:
      "소상공인은 마케팅에 쓸 인력도 시간도 부족합니다. 영업·재고·고객 응대가 우선이라 SNS 운영은 늘 뒤로 밀리고, 광고 영상을 외주로 맡기면 100만 원 이상의 비용이 듭니다. 그렇다고 기존 도구가 대안이 되지도 못합니다.",
    backgroundTable: {
      head: ["대안", "한계"],
      rows: [
        ["광고 대행사", "고비용, 소통 불투명, 업종 맞춤성 부족"],
        ["SNS 광고 툴", "광고 집행만 가능, 콘텐츠 제작 기능 없음"],
        ["AI 영상 제작 툴", "영상 생성만 가능, 전략 기획·성과 분석 부재"],
      ],
    },
    backgroundClosing: [
      "“콘텐츠를 만드는 것”과 “그걸 채널에 올려 성과를 보는 것”이 분리되어 있다는 게 핵심 문제였습니다. 그래서 광고 영상 생성 → SNS 게시 → 성과 분석까지 하나의 흐름으로 잇는 원스톱 플랫폼을 만들기로 했습니다.",
      "서비스는 세 개의 기능 축으로 구성되며, 그중 2번 SNS 게시글 관리 전 구간을 담당했습니다.",
    ],
    backgroundScope: [
      { label: "1", text: "홍보 영상(숏츠) 자동 제작" },
      { label: "2", text: "SNS 게시글 관리", mine: true },
      { label: "3", text: "성과 분석 및 리포트 작성" },
    ],
    myRoleLabel: "2. 담당 범위",
    myRole:
      "SNS 게시글 관리 축 하나를 FastAPI 에이전트 · Spring Boot 서비스 · React 화면의 세 계층에 걸쳐 맡았습니다. 계층별로 사람이 나뉘지 않아 프롬프트 설계부터 API 계약, 화면 상태 관리까지 하나로 이어집니다.",
    myRoleDiagrams: [
      {
        chart: `graph LR
    subgraph FE["Frontend (React)"]
        A[SNS 계정 연동]
        B[게시글 생성]
        C[게시글 관리]
    end
    subgraph BE["Backend (Spring Boot)"]
        D[sns-service<br/>OAuth · 게시 · 채널]
    end
    subgraph AI["AI Engine (FastAPI)"]
        E[게시글 생성 Agent<br/>LangGraph]
    end
    subgraph EXT["External"]
        F[YouTube Data API]
        G[OpenAI API]
    end
    A --> D
    B --> D
    C --> D
    D --> E
    D --> F
    E --> G`,
      },
      {
        caption: "전체 처리 흐름",
        chart: `sequenceDiagram
    autonumber
    actor U as 사용자
    participant BE as sns-service
    participant AI as FastAPI Agent
    participant YT as YouTube
    participant KF as Kafka

    rect rgb(243,240,255)
    Note over U,AI: 1단계 · AI 게시글 생성
    U->>BE: 콘텐츠 선택 + 키워드/업종/위치 입력
    BE->>BE: S3 Presigned URL 발급
    BE->>AI: 이미지 URL + 키워드 + 업종/위치/플랫폼
    AI->>AI: 콘텐츠 분석 → 트렌드 → 본문 → 해시태그
    AI-->>BE: 제목 · 본문 · 해시태그
    BE-->>U: 생성 결과 (편집 가능)
    end

    rect rgb(255,241,242)
    Note over U,KF: 2단계 · 게시 및 업로드
    U->>BE: 즉시 게시 또는 예약 게시
    BE->>YT: 영상 업로드 (+ publishAt)
    YT-->>BE: videoId
    BE->>BE: 게시글 메타데이터 DB 저장
    BE->>KF: 게시글 생성 이벤트 발행
    BE-->>U: 게시 완료
    end`,
      },
    ],
    showcase: {
      label: "4. 결과물",
      intro:
        "담당한 SNS 도메인의 화면 전반을 React 로 구현하고 Redux 로 상태를 관리했습니다. 계정을 연동하고, AI 로 게시글을 만들고, 플랫폼에 올려 관리하기까지가 한 흐름으로 이어집니다.",
      shots: [
        {
          src: "/damatketing/sns-connect-page.png",
          width: 1440,
          height: 1186,
          title: "SNS 계정 연동",
          desc: "플랫폼을 고르면 OAuth 팝업이 열리고, 연동이 끝나면 채널명·구독자·게시물·조회수가 카드에 표시됩니다. 연결 해제와 새로고침도 같은 카드에서 처리합니다.",
        },
        {
          src: "/damatketing/post-upload.png",
          width: 1400,
          height: 2432,
          column: 2,
          title: "새 게시물 업로드 — 네 단계 한 화면",
          desc: "① 콘텐츠 선택 → ② AI 게시글 작성 → ③ 게시 옵션 → ④ 플랫폼별 미리보기까지 한 페이지에서 끝납니다. 제목·본문·해시태그를 한 번에 만드는 버튼과 해시태그만 다시 뽑는 버튼을 나란히 두었고, 게시 시점에서 예약 게시를 고를 수 있습니다.",
        },
        {
          src: "/damatketing/post-manage-page.png",
          width: 1440,
          height: 682,
          title: "게시물 관리",
          desc: "게시한 글을 플랫폼별로 걸러 보고, 조회수·좋아요·댓글과 함께 상세를 조회·수정·삭제합니다.",
        },
      ],
    },
    featureGroups: [
      {
        label: "5. AI — 게시글 생성 에이전트",
        items: [
          {
            name: "5.1 왜 단일 프롬프트가 아니라 그래프인가",
            tagline:
              "게시글 생성은 성격이 다른 네 가지 일이 섞여 있습니다 — 이미지를 읽는 일, 외부 트렌드를 끌어오는 일, 문장을 쓰는 일, 규칙에 맞춰 태그를 고르는 일. 이걸 한 번의 호출로 처리하면 어느 단계가 잘못됐는지 짚어낼 수 없고, 일부만 다시 실행하는 것도 불가능합니다.",
            problemLabel: "택한 구조",
            problem:
              "역할 단위로 노드를 나누고 LangGraph StateGraph 로 연결했습니다. 그 결과 단계별로 모델과 temperature 를 다르게 배치할 수 있었고, 해시태그만 재생성하는 API 를 별도 노드 조합으로 만들 수 있었습니다. 각 노드는 하나의 책임만 지고, 앞 단계의 구조화된 출력이 다음 단계의 입력이 됩니다.",
            solutionLabel: "구현",
            solutionBlocks: [
              // 코드(좌)와 렌더된 그래프(우)를 나란히 — 세로로 긴 그림이라 코드 높이에 맞춘다
              {
                title: "그래프 구성",
                layout: "side",
                code: `workflow = StateGraph(SNSPostState)

workflow.add_node("content_analyzer", content_analyzer)
workflow.add_node("trend_analyzer", trend_analyzer)
workflow.add_node("post_generator", post_generator)
workflow.add_node("hashtag_generator", hashtag_generator)

workflow.add_edge(START, "content_analyzer")
workflow.add_edge("content_analyzer", "trend_analyzer")
workflow.add_edge("trend_analyzer", "post_generator")
workflow.add_edge("post_generator", "hashtag_generator")
workflow.add_edge("hashtag_generator", END)`,
                lang: "python",
                figure: {
                  src: "/damatketing/sns-post-graph.png",
                  width: 180,
                  height: 531,
                  alt: "SNS 게시글 생성 그래프 구조",
                },
                points: [
                  "LangGraph 를 택한 이유는 상태를 명시적으로 관리할 수 있어서입니다. Pydantic 모델로 State 를 정의해두면 각 노드가 무엇을 받아 무엇을 채우는지가 타입으로 드러나고, 중간 산출물을 그대로 검증·디버깅할 수 있습니다. 단순 체인으로 이었다면 중간에 무엇이 어떻게 넘어가는지 추적하기 어려웠을 겁니다.",
                ],
              },
              {
                title: "State 정의",
                code: `class SNSPostState(BaseModel):
    # 입력
    content_data: str
    sns_platform: Literal["instagram", "facebook", "youtube"]
    business_type: str
    user_keywords: List[str] = Field(default_factory=list)
    location: Optional[str] = None

    # 중간 생성물
    content_summary: Optional[ContentData] = None
    trend_analysis: Optional[TrendData] = None
    generated_post: Optional[PostData] = None
    hashtags: List[str] = Field(default_factory=list)`,
                lang: "python",
                points: [
                  "상태 갱신은 state.model_copy(update={...}) 로 처리해 이전 상태를 훼손하지 않도록 했습니다.",
                ],
              },
            ],
          },
          {
            name: "5.2 노드별 역할과 모델 배치",
            tagline:
              "작업 성격에 따라 모델과 temperature 를 다르게 뒀습니다. 전 구간에 상위 모델을 쓰면 비용과 응답 시간이 커지고, 전 구간에 경량 모델을 쓰면 트렌드 분석의 품질이 떨어졌습니다.",
            table: {
              head: ["노드", "역할", "모델", "temp", "선택 이유"],
              rows: [
                [
                  "content_analyzer",
                  "이미지에서 주제·분위기·타겟 추출",
                  "gpt-4o-mini",
                  "0.3",
                  "정형 추출 작업, 편차를 줄여야 함",
                ],
                [
                  "trend_analyzer",
                  "업종·지역·시기별 트렌드 8개 범주 도출",
                  "gpt-4o",
                  "0.7",
                  "폭넓은 지식과 발상이 필요한 유일한 단계",
                ],
                [
                  "post_generator",
                  "제목·본문 생성",
                  "gpt-4o-mini",
                  "0.5",
                  "앞 단계 입력이 충분해 경량 모델로 충분",
                ],
                [
                  "hashtag_generator",
                  "플랫폼별 해시태그 생성",
                  "gpt-4o-mini",
                  "0.7",
                  "다양성은 필요하나 후처리로 통제 가능",
                ],
              ],
            },
          },
          {
            name: "5.3 트렌드 분석 — 맥락을 강제하는 프롬프트",
            tagline:
              "“최신 트렌드를 반영해줘”라고만 하면 LLM 은 어느 업종에나 통하는 뻔한 답을 냅니다. 현재 날짜·업종·매장 위치·대상 플랫폼을 컨텍스트로 주입하고, 출력을 8개 범주로 강제해 매장 맥락에 밀착한 결과를 유도했습니다.",
            solutionLabel: "출력 강제",
            solutionBlocks: [
              {
                title: "출력 형식",
                code: `[출력 형식]
{
    "keywords": ["..."],        # 트렌딩 키워드
    "hashtags": ["..."],        # 인기 해시태그
    "memes": ["..."],           # 최신 밈
    "current_issues": ["..."],  # 시사 이슈
    "popular_topics": ["..."],  # 인기 주제
    "business_trend": ["..."],  # 업종 트렌드
    "season_trend": ["..."],    # 계절 트렌드
    "location_trend": ["..."]   # 지역 트렌드
}`,
                lang: "json",
                points: [
                  "범주를 나눈 것 자체가 장치입니다. 자유 서술로 두면 한두 방향으로 쏠리는데, 칸을 만들어두면 각 관점을 빠짐없이 채웁니다.",
                ],
              },
              {
                title: "실제 출력 예시 (의류 쇼핑몰 / 서울 잠실 / 8월)",
                code: `"keywords": ['맨투맨', '의류 쇼핑몰', '패션', '젊은 세대', '캐주얼 스타일']
"season_trend": ['가을 맞이 패션템', '편안하고 따뜻한 의류']
"location_trend": ['잠실의 패션 이벤트', '서울에서 즐기는 캐주얼 패션']`,
                lang: "json",
                points: [],
              },
            ],
          },
          {
            name: "5.4 API 구성 — 부분 실행 지원",
            tagline:
              "노드를 책임 단위로 나눠둔 덕에, 전체 파이프라인을 돌리지 않고 필요한 구간만 실행하는 API 를 만들 수 있었습니다. 사용자가 본문은 마음에 드는데 해시태그만 다시 뽑고 싶은 경우가 있어, 해시태그 전용 엔드포인트를 따로 열었습니다.",
            table: {
              head: ["엔드포인트", "기능", "실행 노드"],
              rows: [
                [
                  "POST /sns-post/agent/post",
                  "게시글 + 해시태그 전체 생성",
                  "4개 노드 전체",
                ],
                [
                  "POST /sns-post/agent/tag",
                  "기존 게시글 기준 해시태그만 재생성",
                  "trend_analyzer → hashtag_generator",
                ],
              ],
              note: "/tag 는 이미 작성된 제목·본문을 입력으로 받아 임시 State 를 구성한 뒤 두 노드만 직접 호출합니다. 이미지 분석과 본문 생성을 건너뛰므로 응답이 빠르고 API 호출 비용도 절반 이하로 줄었습니다.",
            },
          },
          {
            name: "5.5 해시태그 최적화",
            tagline:
              "플랫폼마다 해시태그 노출 알고리즘이 다릅니다. 과다 사용하면 스팸으로 분류되거나(Instagram), 아예 전부 무시됩니다(YouTube 는 15개 초과 시). 자료 조사를 거쳐 권장 개수와 우선순위 규칙을 정하고 프롬프트에 명시했습니다.",
            table: {
              head: ["플랫폼", "권장 개수", "우선순위 (중요 → 덜 중요)"],
              rows: [
                [
                  "Instagram",
                  "7~11개",
                  "핵심 콘텐츠 키워드 → 세분화/타겟(지역·속성) → 트렌드/인기 → 브랜드",
                ],
                [
                  "Facebook",
                  "2~3개",
                  "캠페인/이벤트 → 개인·커뮤니티 → 키워드+지역",
                ],
                [
                  "YouTube",
                  "3~5개",
                  "영상 주제 → 트렌드/빅키워드(#Shorts 등) → 세분화 타겟 → 브랜드/채널",
                ],
              ],
              note: "입력이 비었을 때의 처리도 규칙에 넣었습니다. 매장 위치가 없는데 지역 태그를 만들면 엉뚱한 지역이 붙기 때문에, location 이 비어 있으면 지역 태그를 생성하지 않도록 명시했습니다.",
            },
          },
        ],
      },
      {
        label: "6. 백엔드 — SNS 연동 및 게시",
        items: [
          {
            name: "6.1 확장을 고려한 연동 구조",
            problemLabel: "구조",
            problem:
              "팀 컨벤션인 헥사고날 구조(adapter.in / application / adapter.out)에 맞춰 계층을 분리하고, 플랫폼별 API 구현을 adapter.out 어댑터에 두어 외부 API 의존이 도메인으로 새어 들어오지 않도록 했습니다. 플랫폼 구분은 SnsType enum 으로 두어 플랫폼이 늘어날 때 추가 지점이 한곳에 모이도록 했습니다.",
          },
          {
            name: "6.2 OAuth 2.0 연동과 CSRF 방어",
            tagline:
              "인가 코드 방식으로 Google API 접근 권한을 받되, 콜백이 정상 요청인지 검증하기 위해 state 파라미터를 서버에서 발급·소비하도록 구현했습니다.",
            solutionLabel: "구현",
            solutionBlocks: [
              {
                code: `public String issue(Long userId, Long storeId) {
    String raw = userId + ":" + storeId + ":" + UUID.randomUUID();
    String state = Base64.getUrlEncoder().withoutPadding()
            .encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    repository.save(OAuthStateEntity.builder()
            .state(state).userId(userId).storeId(storeId)
            .expiresAt(Instant.now().plusSeconds(600)).build());
    return state;
}`,
                lang: "java",
                points: [
                  "10분 TTL — 오래된 state 가 재사용되지 않도록 만료 시각을 함께 저장",
                  "일회성 소비 — 검증 직후 삭제해 재사용을 원천 차단",
                  "사용자·매장 식별자 바인딩 — 콜백 시점에 어떤 매장의 연동인지 복원",
                ],
                note: "토큰은 별도 서비스에서 관리하며, API 호출 직전 ensureValidToken() 으로 만료를 확인하고 필요하면 refresh token 으로 갱신합니다.",
              },
            ],
          },
          {
            name: "6.3 영상 업로드와 예약 게시",
            solutionLabel: "구현",
            solutionBlocks: [
              {
                code: `VideoStatus status = new VideoStatus();
status.setPrivacyStatus("private");        // 예약 게시하려면 private + publishAt
if (publishAt != null) {
    status.setPublishAt(new DateTime(publishAt.toInstant().toEpochMilli()));
}
...
uploader.setDirectUploadEnabled(false);    // Resumable
uploader.setChunkSize(10 * 1024 * 1024);   // 10MB`,
                lang: "java",
                points: [
                  "예약 게시 — 비공개로 선업로드한 뒤 publishAt 을 지정해 플랫폼 스케줄링에 위임",
                  "대용량 처리 — S3 객체를 메모리에 적재하지 않고 스트리밍, 10MB 청크 Resumable 업로드로 중단 시 재개",
                ],
              },
            ],
          },
          {
            name: "6.4 서비스 간 연동",
            problemLabel: "구조",
            problem:
              "게시글 메타데이터가 필요한 성과 분석 서비스와는 Kafka 이벤트로 통신했습니다. 다른 서비스가 SNS 도메인 DB 를 직접 조회하지 않게 해 MSA 경계를 유지했습니다.",
          },
        ],
      },
      {
        label: "7. 트러블슈팅",
        items: [
          {
            name: "7.1 S3 Presigned URL 이 이미지로 인식되지 않던 문제",
            problem:
              "백엔드가 넘겨준 S3 Presigned URL 을 콘텐츠 분석 노드가 이미지로 처리하지 못하고 폴백으로 빠졌습니다. 확장자로 미디어 여부를 판별하고 있었는데, Presigned URL 은 쿼리스트링이 길게 붙고 경로에 확장자가 없는 경우가 있어 판별이 실패했습니다.",
            solution:
              "확장자 판별 앞에 신뢰 도메인 화이트리스트를 두어, 자사 CDN·S3 에서 온 URL 은 확장자와 무관하게 미디어로 처리하도록 했습니다.",
            solutionBlocks: [
              {
                code: `if 'aivle.r-e.kr' in domain or 's3.amazonaws.com' in domain or 'cdn.aivle' in domain:
    print("✅ AIVLE/S3 CDN 감지 - 미디어 파일로 처리")
elif ext and ext not in IMAGE_EXTS:
    ...  # 메타 요약으로 대체`,
                lang: "python",
                points: [],
              },
            ],
          },
          {
            name: "7.2 LLM 이 JSON 형식을 지키지 않는 문제",
            problem:
              "“순수 JSON 만 반환하라”고 명시해도 코드블록으로 감싸거나 설명 문장을 덧붙이는 경우가 있어 파싱이 깨졌습니다.",
            solution: "세 겹으로 방어했습니다.",
            solutionBlocks: [
              {
                pointsFirst: true,
                points: [
                  "시스템 프롬프트에 금지 사항을 구체적으로 명시 (마크다운 금지, 백틱 금지, 추가 필드 금지)",
                  "1차 파싱 실패 시 정규식으로 JSON 블록만 추출하는 관대한 파서로 재시도",
                  "그래도 실패하면 폴백 객체를 반환해 파이프라인이 멈추지 않도록 처리",
                ],
                code: `def _extract_json(text: str):
    try:
        return json.loads(text)
    except Exception:
        pass
    m = re.search(r"\\{.*\\}", text, re.DOTALL)   # 관대한 추출
    if m:
        try:
            return json.loads(m.group(0))
        except Exception:
            return None
    return None`,
                lang: "python",
                note: "순차 그래프에서는 앞 노드가 죽으면 뒤 노드가 전부 죽습니다. 품질이 조금 낮은 결과라도 흐름을 잇는 편이 낫다고 판단해, 이미지 분석에 실패해도 업종·키워드 기반의 최소 요약을 만들어 다음 노드로 넘겼습니다.",
              },
            ],
          },
          {
            name: "7.3 해시태그 규칙을 프롬프트만으로는 못 지키는 문제",
            problem:
              "프롬프트에 개수 제한과 형식을 명시해도 LLM 이 종종 어겼습니다. 개수를 초과하거나, # 을 붙이거나, 이모지·공백이 섞이거나, 표기만 다른 중복 태그가 나왔습니다.",
            solution:
              "프롬프트로 유도하고 코드로 강제하는 이중 구조로 바꿨습니다. LLM 출력은 신뢰하지 않고 후처리 단계를 반드시 거치게 했습니다.",
            solutionBlocks: [
              {
                code: `def _normalize_hashtags(raw):
    for t in raw or []:
        t = re.sub(r"\\s+", "", t)          # 공백 제거
        t = re.sub(r"[^\\w#가-힣]", "", t)   # 이모지·특수문자 제거
        if not t.startswith("#"):
            t = f"#{t}"
        norm.append(t.lower())             # 표기 통일 후 중복 제거
    ...

def _cap_by_platform(tags, platform):
    limits = {"instagram": (7, 11), "facebook": (2, 3), "youtube": (3, 5)}
    lo, hi = limits.get(platform, (3, 5))
    return tags[:hi]                       # 플랫폼 한도 강제`,
                lang: "python",
                points: [],
                note: "이 경험에서 LLM 출력에 대한 검증은 프롬프트가 아니라 코드의 책임이라는 걸 배웠습니다.",
              },
            ],
          },
          {
            name: "7.4 예약 게시를 어떻게 처리할 것인가",
            problemLabel: "고민",
            problem:
              "예약 시각에 맞춰 게시하려면 서버에 스케줄러를 두는 방식이 일반적입니다. 하지만 그러면 예약 시각에 서버가 내려가 있을 경우 게시가 통째로 누락됩니다. 재시도 로직과 중복 게시 방지까지 직접 관리해야 했습니다.",
            solution:
              "YouTube Data API 가 예약 공개를 지원한다는 점을 활용해, 영상을 비공개로 먼저 올려두고 공개 시각만 지정하는 방식으로 전환했습니다. 예약 이후의 책임을 플랫폼에 넘긴 셈입니다.",
            troublesLabel: "결과",
            troubles: [
              {
                title: "스케줄러를 만들지 않는 쪽을 택했다",
                effect:
                  "서버 가용성과 무관하게 예약이 보장되고, 스케줄러·재시도·중복 방지 로직이 전부 불필요해졌습니다. 다만 플랫폼이 예약 기능을 지원하지 않는 경우에는 쓸 수 없어, 향후 Instagram·Facebook 확장 시에는 별도 방식이 필요합니다.",
              },
            ],
          },
          {
            name: "7.5 OAuth 콜백 응답 형식",
            problem:
              "연동 완료 후 콜백이 JSON 을 반환하고 있어, 팝업 창에 원시 JSON 이 그대로 노출됐습니다. 사용자는 연동이 성공한 건지 알 수 없었습니다.",
            solution:
              "콜백 응답을 HTML 템플릿으로 바꿔 성공·실패 화면을 렌더링하도록 수정했습니다. 템플릿 로딩이 실패하는 경우를 대비해 인라인 fallback HTML 도 함께 두었습니다.",
          },
        ],
      },
    ],
    // 절 단위 본문은 featureGroups 가 다 담는다
    features: [],
    techStackLabel: "3. 사용 기술",
    techStack: [
      {
        label: "AI",
        value:
          "Python, FastAPI, LangChain, LangGraph, OpenAI API (GPT-4o / 4o-mini)",
      },
      {
        label: "Backend",
        value:
          "Java, Spring Boot, Kafka, OAuth 2.0, YouTube Data API, AWS S3, MySQL",
      },
      { label: "Frontend", value: "React, Redux" },
      { label: "Infra", value: "Docker, MSA" },
    ],
    closingLabel: "8. 회고",
    closingGroups: [
      {
        title: "잘한 점",
        points: [
          "책임 단위로 노드를 분리한 판단. 덕분에 단계별로 모델을 다르게 배치해 비용을 통제할 수 있었고, 해시태그만 재생성하는 API 도 노드 조합만으로 만들 수 있었습니다. 특정 단계의 품질이 떨어질 때 그 노드만 손보면 되어 개선도 수월했습니다.",
          "LLM 출력을 코드로 검증하는 습관을 얻었습니다. 프롬프트는 유도일 뿐 보장이 아니라는 전제로 후처리를 설계하게 됐습니다.",
          "예약 게시처럼 직접 만들지 않는 선택이 더 나은 경우가 있다는 것을 경험했습니다.",
        ],
      },
      {
        title: "아쉬운 점",
        points: [
          "Instagram·Facebook 연동 미완성 — 게시글·해시태그 생성 로직은 3개 플랫폼을 모두 지원하도록 만들었지만, 실제 계정 연동과 업로드는 YouTube 만 완료했습니다. 기간 내 우선순위 판단이었으나, 플랫폼별 노출 최적화를 설계해놓고 검증하지 못한 점이 아쉽습니다.",
          "정량 지표 부재 — 생성 소요 시간, 게시 성공률 같은 지표를 측정하지 않은 채 진행했습니다. 개선 전후를 숫자로 비교할 수 없어 판단의 근거를 정성적으로만 남기게 됐습니다. 다음 프로젝트에서는 최소한의 계측을 먼저 붙이려 합니다.",
          "에이전트 평가 체계 없음 — 생성 품질을 눈으로 확인하는 수준에 머물렀습니다. 정답 셋을 만들어두고 프롬프트 변경 시 회귀 검증을 하는 구조가 필요했습니다.",
        ],
      },
      {
        title: "더 해본다면",
        points: [
          "트렌드 분석에 실시간 검색 도구를 붙여 LLM 내부 지식의 한계를 보완",
          "조건부 엣지를 활용해, 콘텐츠 분석이 실패한 경우 다른 경로로 우회하는 그래프 설계",
          "생성 결과에 대한 사용자 피드백을 수집해 프롬프트 개선에 반영하는 루프 구성",
        ],
      },
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
    slides: "/sodam/presentation.pdf",
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

    아래 서술은 본인이 제공한 경력기술 문서를 유일한 출처로 삼는다.
    문서에 없는 것은 이전 판에 있었더라도 넣지 않는다 — 날짜별 작업 타임라인,
    run 별 mAP 표, 추론 속도(ONNX/TensorRT) 실측치가 그렇게 빠졌다.
  */
  {
    slug: "samsung-medison",
    title: "초음파 다중 구조물 검출 — 학습 데이터 구축 및 검증 도구 개발",
    badge: "삼성메디슨 · 인턴",
    period: "2024.03 — 2024.04",
    teamSize: "AI Vision 그룹 · 2개월",
    summary:
      "하복부 초음파 영상에서 6개 구조물을 검출하는 과제를 맡았습니다. 두 달간 조건을 바꿔가며 학습을 반복했지만 전체 mAP 는 좁은 구간을 벗어나지 못했고, 클래스별 등락 방향은 run 마다 뒤집혔습니다.",
    summaryMore: [
      "학습을 한 번 더 돌리는 대신, 조정과 결과 사이에 설명 가능한 상관이 없다는 점 자체를 문제로 봤습니다. 병목이 모델이 아니라 정답 데이터에 있다고 판단해 사내 임상의를 직접 찾아가 레이블을 함께 검토했고, GT 마스크가 실제 구조물 경계보다 과도하게 넓게 그려져 있으며 데이터 양도 부족해 현 상태로는 학습이 성립하지 않는다는 확인을 받았습니다. 같은 시기에 확인한 AGPL-3.0 라이선스 제약과 함께 보고했고, 해당 과제 라인은 중단됐습니다.",
      "두 달간 실제로 한 일은 모델을 학습시킨 것이 아니라 학습이 가능한 상태를 만드는 일이었습니다.",
    ],
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
          "초기 87개 폴더 (폴더 = 영상 1개, jpg 와 동명 txt 레이블 1:1 대응) → AVI 프레임 추출로 약 3만 장 규모 확장 (900×600)",
      },
      { label: "태스크", value: "Object Detection → Instance Segmentation" },
      { label: "수행", value: "단독 수행 · 외국인 사수와 영어로 협업" },
    ],
    timelineNote:
      "기간 내내 조건을 바꿔가며 학습을 반복했고, 아래 도구들은 대부분 그 반복 과정에서 막힌 지점을 풀기 위해 만든 것입니다.",
    overviewFiguresLabel: "검출 대상 구조물",
    /*
      아래 세 파일을 public/samsung-medison/ 에 저장하면 바로 뜬다.
      파일이 없으면 빌드가 실패하므로 저장 전에는 주석을 풀지 말 것.
        ref-appendix-iliac.png   — Appendix · Iliac artery · Iliac vein 라벨
        ref-caecum-appendix.png  — Caecum · Appendix · Iliac vein 라벨
        ref-cecum-ileum.png      — Cecum · Terminal ileum · Appendix 라벨
      width/height 는 원본 픽셀 크기에 맞춰 고칠 것 (지금 값은 비율 추정치).
    */
    /*
    overviewFigures: [
      {
        src: "/samsung-medison/ref-appendix-iliac.png",
        width: 393,
        height: 263,
        alt: "하복부 초음파 영상에서 Appendix, Iliac artery, Iliac vein 이 라벨된 참고 이미지",
        caption: "Appendix · Iliac artery · Iliac vein",
      },
      {
        src: "/samsung-medison/ref-caecum-appendix.png",
        width: 391,
        height: 270,
        alt: "하복부 초음파 영상에서 Caecum, Appendix, Iliac vein 이 라벨된 참고 이미지",
        caption: "Caecum · Appendix · Iliac vein",
      },
      {
        src: "/samsung-medison/ref-cecum-ileum.png",
        width: 511,
        height: 392,
        alt: "하복부 초음파 영상에서 Cecum, Terminal ileum, Appendix 가 라벨된 참고 이미지",
        caption: "Cecum · Terminal ileum · Appendix",
      },
    ],
    */
    overviewFiguresNote:
      "구조물이 초음파 영상에서 어떻게 보이는지 나타낸 공개 참고 이미지입니다. 과제에 사용한 학습 데이터가 아닙니다.",
    aiFeaturesLabel: "수행 내용",
    aiFeatures: [
      {
        name: "1. 검증 도구 구현",
        tagline:
          "학습을 돌려도 좌표 변환이 맞는지, 예측이 어디서 틀리는지 숫자만으로는 알 수 없었습니다. 확인할 수단부터 만들었습니다.",
        metric: "오류 2건 규명",
        problemLabel: "확인할 수 없던 것",
        problemList: [
          "정규화된 레이블 좌표가 실제 이미지 위 어디에 찍히는지",
          "예측이 어디서 틀렸는지 — 위치인지 클래스인지. 지표 하나로는 구분되지 않는다",
          "좌표계를 변환할 때마다 결과가 맞는지 검산할 방법",
        ],
        solutionLabel: "만든 도구",
        solutionBlocks: [
          {
            title: "Bounding box drawing",
            points: [
              "정규화 레이블을 픽셀 좌표로 역산해 이미지 위에 렌더링",
              "폴더 경로만 입력하면 전체가 자동 처리되도록 구성",
            ],
          },
          {
            title: "GT / predict 비교",
            points: [
              "정답 박스를 그린 GT 이미지와 YOLOv8 예측 결과를 cv2.hconcat 으로 가로 병합해 나란히 배치",
              "bounding box · class name · 하단 파일명을 함께 표시해 어긋난 지점을 바로 짚을 수 있게 함",
            ],
          },
          {
            title: "Mask 렌더링",
            points: [
              "Segmentation 전환 이후 cv2.polylines 로 폴리곤 좌표를 선으로 표시",
              "변환된 레이블 txt 가 옳은 좌표를 따왔는지 검증하는 데도 같은 함수를 사용",
            ],
          },
        ],
        troublesLabel: "이 도구들로 찾은 것 — 오류 2건",
        troubles: [
          {
            title: "증상과 원인이 달랐던 두 건",
            table: {
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
            effect:
              "둘 다 학습 산출물 labels.jpg 를 역추적해서야 찾았다. 증상만 보고는 원인을 좁힐 수 없었고, 검증 도구가 없었다면 '학습 결과가 낮다'로 뭉뚱그려졌을 문제였다. 이후 각 단계의 결과를 시각적으로 확인한 뒤 다음으로 넘어가는 절차를 고정했다.",
            tags: ["클래스 인덱스", "디버깅"],
            tech: ["YOLOv8", "OpenCV", "CVAT"],
          },
        ],
        writeups: [
          {
            title: "[YOLOv8] .yaml 파일 클래스 구성 — 인덱스 매칭 오류",
            href: "https://blog.naver.com/t3335150/223396924265",
          },
        ],
      },
      {
        name: "2. 반복 학습 및 조건 실험",
        tagline:
          "도구를 만드는 작업과 병행해, 기간 내내 조건을 바꿔가며 학습을 반복했습니다.",
        metric: "전체 mAP 0.14~0.25",
        problemLabel: "학습 환경 구축",
        problemList: [
          "원격 서버에 CUDA · conda · 가상환경 · PyTorch 및 필요 패키지를 직접 설치",
          "초기에 YOLOv9 로 시도했으나 s 모델이 미공개 상태(c, e 만 release)여서 YOLOv8 로 전환",
          "데이터셋 설정에서 names 를 리스트로 주면 실제 라벨링 인덱스와 어긋나 dict 형태로 명시",
        ],
        solutionLabel: "바꿔본 조건",
        solutionBlocks: [
          {
            title: "전처리",
            points: [
              "초음파 영상은 노이즈와 음영으로 경계가 흐릿해, sharpen 함수를 구현하고 별도 데이터셋을 만들어 원본과 비교 학습",
              "Mean / Median / Gaussian filter 와 Thresholding 도 노이즈 저감·영역 분리 방향으로 검토",
            ],
          },
          {
            title: "모델 · 가중치",
            points: [
              "yolov8s.pt 와 yolov8n.pt 를 비교",
              "백본 후보로 EfficientNet 도 함께 검토",
            ],
          },
          {
            title: "하이퍼파라미터",
            points: [
              "optimizer — Adam / AdamW / SGD / NAdam / RAdam / RMSProp",
              "learning rate — 0.001 / 0.005 / 0.01, freeze layer — 1 / 3 / 10",
              "augmentation — U-Net 논문 기준 shift · rotate · zoom · flip, YOLO-NAS 기준 gaussian noise",
            ],
          },
          {
            title: "클래스 구성",
            points: [
              "6개 구조물을 동시에 검출하는 것 자체가 문제인지 확인하기 위해, Appendix 만 분리한 단일 클래스 데이터셋을 별도로 구성해 학습",
              "클래스 id 를 0으로 통일하고, 객체가 없는 이미지도 빈(0KB) txt 로 남겨야 배경 이미지로 학습이 성립하므로 레이블 파일을 지우지 않고 유지",
              "데이터셋 경로가 바뀌므로 listing txt 도 함께 재생성",
            ],
          },
        ],
        troublesLabel: "결과",
        troubles: [
          {
            title: "수치는 움직이는데 방향이 없었다",
            problem:
              "전체 mAP 는 여러 run 에 걸쳐 0.14~0.25 구간을 벗어나지 않았고, 클래스별 등락 방향은 run 마다 뒤집혔다. 같은 학습에서 Iliac artery 가 0.127 → 0.439 로 급등하는 동안 Iliac vein 은 0으로 붕괴하는 식이었다.",
            solution:
              "run 별·클래스별 지표를 정리해, 조건을 바꾸면 수치가 움직이기는 하지만 방향이 일정하지 않다는 것을 확인했다. 클래스를 Appendix 하나로 줄인 데이터셋에서도 결과는 나아지지 않았다.",
            effect:
              "'성능이 안 나온다'가 아니라 '조정이 일관되게 반영되지 않는다'로 문제를 다시 볼 근거가 됐다. 이 기록이 6번 항목의 출발점이다.",
            tags: ["실험 기록", "mAP"],
            tech: ["YOLOv8", "PyTorch"],
          },
        ],
        writeups: [
          {
            title: "Appendix 단일 클래스 Segmentation 학습",
            href: "https://blog.naver.com/t3335150/223426876321",
          },
        ],
      },
      {
        name: "3. Segmentation 전환 — 모델 서베이",
        tagline:
          "Object detection 에서 instance segmentation 으로 태스크가 바뀌면서 쓸 모델을 정해야 했습니다. 논문 벤치마크의 정확도는 저마다 다른 도메인·다른 하드웨어에서 측정된 값이라 순위대로 고를 수 없었고, 아예 공개하지 않은 모델도 있었습니다. 그래서 이 과제에서 쓸 수 없는 조건을 먼저 걸러내는 방식으로 후보를 좁혔습니다.",
        metric: "YOLOv8-seg 채택",
        problemLabel: "이 과제에서 쓸 수 없는 조건",
        problemList: [
          "학습 도메인이 다르면(CT ↔ 초음파) 벤치마크 수치와 무관하게 전이 이점을 기대하기 어렵다",
          "클래스 구분 없이 마스크만 내는 모델은 6개 구조물을 각각 식별해야 하는 과제에 쓸 수 없다",
          "실시간 판독 기능이므로, 연산 속도를 공개하지 않은 모델은 탑재 여부를 판단할 수 없다",
        ],
        table: {
          label: "후보 비교",
          head: ["후보", "판단", "근거"],
          rows: [
            [
              "STU-Net",
              "배제",
              "CT 기반 TotalSegmentator 로 사전학습된 모델. 초음파는 노이즈가 지배적이라 전이 이점을 기대하기 어렵다고 판단",
            ],
            [
              "TU-Net (Transformer + U-Net)",
              "보류",
              "초음파 segmentation 을 직접 다뤘으나 FPS·연산속도 미공개 → 탑재 판단 불가",
            ],
            [
              "FastSAM",
              "배제",
              "개체별 마스크는 생성하지만 클래스 라벨이 없는 class-agnostic 모델 → 구조물 종류를 구분할 수 없음",
            ],
            [
              "MobileSAM",
              "배제",
              "단일 GPU 약 12ms(≈83 FPS)로 속도는 충분하나, 마찬가지로 클래스 라벨을 주지 않음",
            ],
            [
              "YOLACT",
              "후보",
              "real-time instance segmentation (Titan Xp 33.5 fps / COCO 29.8 mAP)",
            ],
            [
              "YOLOv8-seg",
              "채택",
              "bbox + seg 동시 지원, 기존 학습 환경 재사용 가능",
            ],
          ],
          note: "남은 후보 중에서는 bbox 와 segmentation 을 동시에 지원하고 기존 학습 환경을 그대로 재사용할 수 있다는 점에서 YOLOv8-seg 를 택했습니다.",
        },
        writeups: [
          {
            title: "YOLOv8-seg 세그멘테이션 학습",
            href: "https://blog.naver.com/t3335150/223415861451",
          },
        ],
      },
      {
        name: "4. GT 레이블 데이터셋 생성",
        tagline:
          "Segmentation 학습에는 폴리곤 좌표 형태의 정답 레이블이 필요합니다. CVAT 어노테이션을 YOLO 학습 포맷으로 변환해 직접 생성했습니다.",
        metric: "XML 파싱 → 클래스별 txt 병합",
        problemLabel: "막힌 지점",
        problemList: [
          "제공받은 이미지는 이미 크롭된 상태(900×600)인데, 마스크 좌표는 원본(1280×720) 기준으로 기록되어 있었다",
          "XML 의 name · id 태그가 지정 클래스명·실제 라벨링 인덱스와 다르게 기록되어 있었다",
          "outside 표시가 붙은 어노테이션도 좌표 필드가 채워져 있고 그 값이 이미지 범위를 벗어나, 정규화하면 유효 범위(0~1)를 넘었다",
        ],
        solutionLabel: "변환 방식",
        solutionBlocks: [
          {
            title: "좌표계 정합",
            figure: {
              src: "/samsung-medison/crop-coordinate-shift.svg",
              width: 680,
              height: 330,
              alt: "1280×720 원본에서 좌 200, 우 180 이 비대칭으로 잘려 900×600 이미지가 되었고, 원본 기준 좌표를 그대로 쓰면 위치가 어긋난다",
              caption: "원본 좌표와 크롭된 이미지의 어긋남",
            },
            code: `가정: 1280 / 2 = 640,  900 / 2 = 450  →  640 − 450 = 190
      720 / 2 = 360,  600 / 2 = 300  →  360 − 300 =  60
실제: 가로 제거량이 비대칭 (좌 200 / 우 180)`,
            points: [
              "중앙 크롭을 가정하고 계산했으나 맞지 않았다",
              "픽셀 단위로 shift 한 뒤 크롭 해상도로 재정규화했다",
              "크롭은 종횡비를 바꾸는 조작이 아니라 여백을 잘라내는 조작이므로, 스케일링이 아닌 shift 로 처리해야 한다는 점을 이때 확인했다",
            ],
          },
          {
            title: "방식 A — XML 파싱",
            points: [
              "XML 트리를 파싱해 클래스별 폴리곤 좌표를 추출하고, 크롭 좌표계로 변환한 뒤 정규화해 기록",
              "원본과 크롭본의 좌표 기준 차이 → shift 후 크롭 해상도로 재정규화",
              "정규화 기준 → X / image_width, Y / image_height",
              "name 태그가 지정 클래스명이 아닌 CVAT 작업물 명으로 기록됨 → re.sub 패턴 치환",
              "id 가 실제 라벨링 순서와 불일치 → label 태그 순서에서 인덱스를 역참조",
              "객체 단위 구분 → id 가 달라질 때마다 줄바꿈, 파일 쓰기 모드는 덮어쓰기로 통일",
            ],
          },
          {
            title: "드러난 구조적 한계",
            figure: {
              src: "/samsung-medison/cvat-outside-attribute.svg",
              width: 680,
              height: 360,
              alt: "outside 가 1이어도 좌표 필드는 채워져 있고, 그 값이 이미지 범위를 벗어나 정규화하면 1을 초과한다",
              caption: "outside 속성이 붙은 어노테이션의 좌표 문제",
            },
            points: [
              "정규화 결과가 1을 초과하는 케이스가 남았다",
              'track 방식으로 기록된 어노테이션에서 outside="1"(해당 프레임에 객체 없음)이 붙은 요소도 좌표 필드는 그대로 채워져 있었고, 그 값이 이미지 범위를 벗어나는 경우가 있었다 (예: x = 1100)',
              "좌표만으로는 유효한 어노테이션과 구분할 수 없어, XML 단계에서 선별하기 어려웠다",
            ],
          },
          {
            title: "방식 B — 클래스별 txt 병합",
            points: [
              "XML 파싱 자체를 포기하고, CVAT 가 클래스별로 개별 출력하는 annotation txt 를 병합하는 방식(merge_separate_annote)으로 전환",
              "구조적으로 막히는 지점을 우회하는 대신 입력 자체를 바꿔 해결",
              "생성한 레이블은 mask 렌더링 함수로 확인한 뒤 학습에 투입",
            ],
          },
        ],
        writeups: [
          {
            title: "XML 파일을 txt로 변환",
            href: "https://blog.naver.com/t3335150/223416017978",
          },
          {
            title: "Nerve 데이터셋",
            href: "https://blog.naver.com/t3335150/223419636271",
          },
        ],
      },
      {
        name: "5. 데이터 처리 파이프라인",
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
              "약 500 프레임 중 20~300번 구간만 사용해 앞뒤 무효 구간을 제외",
              "파일명을 000001~000XXX 형식으로 강제(0 최소 3개)해 문자열 정렬 오류를 방지",
            ],
          },
          {
            title: "영상 단위 대표 크롭",
            points: [
              "cv2.findContours 로 프레임마다 largest contour 를 찾고, boundingRect 로 사각형 좌표(startX, startY, boxW, boxH)를 산출",
              "한 AVI 의 전 프레임에서 가장 많이 나온 좌표를 그 영상의 대표 크롭 값으로 채택해 모든 프레임에 동일하게 적용",
              "크기뿐 아니라 위치까지 포함한 네 값을 묶어서 보므로, 프레임별 편차에는 흔들리지 않으면서 영상마다 다른 촬영 조건에는 각각 대응",
            ],
          },
          {
            title: "기록",
            points: [
              "프레임별 사각형 좌표는 frame num / startX / startY / boxW / boxH 형식으로 txt 에 listing",
              "크롭 정보는 엑셀로 정리해 영상별 비교가 가능한 형태로 보관",
            ],
          },
        ],
        figures: [
          {
            src: "/samsung-medison/pipeline-representative-crop.svg",
            width: 680,
            height: 356,
            alt: "AVI 에서 프레임을 추출해 크롭, 어노테이션, 학습으로 이어지는 파이프라인과, 프레임별 유효 영역 좌표의 최빈값을 영상 전체의 대표 크롭 값으로 채택하는 방식",
            caption: "데이터 처리 파이프라인과 영상 단위 대표 크롭",
          },
        ],
        writeups: [
          {
            title: "데이터 처리 파이프라인 — crop",
            href: "https://blog.naver.com/t3335150/223427039001",
          },
        ],
      },
      {
        name: "6. 병목의 재정의 — 모델이 아니라 정답 데이터",
        tagline:
          "지표가 오르지 않을 때 학습을 한 번 더 돌리는 대신, 어디가 막혔는지를 물었습니다.",
        metric: "조정과 결과 사이에 상관 없음",
        problemLabel: "관측",
        problemList: [
          "여러 run 에서 전체 mAP 가 0.14~0.25 구간을 벗어나지 못함",
          "클래스별 등락 방향이 run 마다 뒤바뀜 — Psoas ↑ ↔ Terminal ileum ↓, 다음 run 에서 역전",
          "Iliac vein 은 여러 run 에서 0에 가까운 값",
          "클래스를 Appendix 하나로 줄인 데이터셋에서도 개선되지 않음 — 클래스 수나 다중 구조물이라는 조건의 문제가 아님",
          "조정과 결과 사이에 설명 가능한 상관이 없음",
        ],
        solutionLabel: "가설 → 검증 → 확인 → 결과",
        solutionBlocks: [
          {
            title: "가설 — 조정하는 쪽이 아니라 기준이 되는 쪽",
            points: [
              "성능이 낮다는 것보다, 조정이 일관된 방향으로 반영되지 않는다는 점이 문제였다",
              "조정하는 쪽(모델·하이퍼파라미터)이 아니라 기준이 되는 쪽(정답 데이터)에 원인이 있을 가능성이 높다고 판단",
            ],
          },
          {
            title: "검증 — 판단할 지식을 가진 사람을 직접 찾아감",
            points: [
              "초음파 영상에서 구조물 경계가 올바르게 그려졌는지는 임상 지식 없이 판단할 수 없었다",
              "사내 상주 임상의를 직접 찾아가 원본 영상과 레이블링 결과를 함께 검토해달라고 요청",
              "진행 중인 학습 방식과 결과를 설명한 뒤 어디를 봐야 하는지 판단을 구함",
            ],
          },
          {
            title: "확인 — 학습 성립 요건 자체를 못 맞추고 있었다",
            points: [
              "GT 마스크가 실제 구조물 경계보다 과도하게 넓게 그려져 있었다",
              "외부 위탁 어노테이션이었으나 경계가 타이트하게 잡히지 않은 상태였다",
              "데이터 양 자체도 이 과제를 학습시키기에는 부족하다는 판단이었다",
              "이 상태로는 모델을 어떻게 조정해도 학습이 성립하지 않는다는 판단을 받음",
            ],
          },
          {
            title: "결과 — 보고, 그리고 중단",
            points: [
              "정답 데이터 사안과 라이선스 제약 두 가지를 함께 정리해 보고",
              "며칠 뒤 해당 과제 라인은 중단됐다 — 정답 데이터를 재구축하지 않는 한 진행 의미가 없다는 결론이었다",
            ],
          },
        ],
        troublesLabel: "같은 시기에 확인된 또 하나의 제약",
        troubles: [
          {
            title: "성능·속도를 통과해도 제품에 못 들어가는 조건이 있었다",
            problem:
              "도메인 적합성과 태스크 요건을 기준으로 YOLOv8-seg 를 채택해 학습까지 진행했는데, YOLOv8(Ultralytics)의 라이선스는 AGPL-3.0 이었다.",
            solution:
              "상용 의료기기 제품에 탑재하려면 소스 공개 의무가 발생하거나 별도의 상용 라이선스 취득이 필요하다는 점을 확인해, 성능·속도 요건과 무관하게 제품 탑재가 불가하다는 사실을 정답 데이터 사안과 함께 정리해 보고했다.",
            effect:
              "속도와 정확도로 모델을 고르는 데까지는 갔지만, 제품에 들어가려면 기술 지표 바깥의 조건이 먼저 통과되어야 한다는 것을 이때 알게 됐다.",
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
        title:
          "XML 파일을 txt로 변환 (4/15) — CVAT 어노테이션 파싱에서 규명한 이슈들",
        href: "https://blog.naver.com/t3335150/223416017978",
      },
      {
        title: "Nerve 데이터셋 (4/18)",
        href: "https://blog.naver.com/t3335150/223419636271",
      },
      {
        title: "데이터 처리 파이프라인 — crop (4/21)",
        href: "https://blog.naver.com/t3335150/223427039001",
      },
      {
        title: "Appendix 단일 클래스 Segmentation 학습 (4/24~25)",
        href: "https://blog.naver.com/t3335150/223426876321",
      },
    ],
    writeupsNote:
      "이 외에 ultralytics 오류 해결, thresholding, mAP 개념 등을 정리했습니다.",
  },
];

export function getLightProject(slug: string): LightProject | undefined {
  return lightProjects.find((p) => p.slug === slug);
}

export const lightProjectSlugs = lightProjects.map((p) => p.slug);
