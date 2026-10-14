/*
  웹서비스 적용 기술(7.x) 절의 Mermaid 도식.
  init 지시문이 있으면 MermaidDiagram 이 기본 테마를 덮어쓰지 않는다.
  흐름은 sns-service / analytics-service 코드에서 확인한 것만 그린다.
*/
const flowInit = `%%{init: {"theme":"base","themeVariables":{"fontFamily":"IBM Plex Sans KR, sans-serif","fontSize":"16px","primaryColor":"#ffffff","primaryTextColor":"#1a132f","primaryBorderColor":"#c9c7d0","lineColor":"#4d6d9f"},"flowchart":{"curve":"linear","nodeSpacing":40,"rankSpacing":60,"padding":14}}}%%`;

const seqInit = `%%{init: {"theme":"base","themeVariables":{"fontFamily":"IBM Plex Sans KR, sans-serif","fontSize":"12px","primaryColor":"#e8f0fa","primaryTextColor":"#1a132f","primaryBorderColor":"#4d6d9f","lineColor":"#4d6d9f","signalColor":"#1a132f","signalTextColor":"#1a132f","actorBkg":"#e8f0fa","actorBorder":"#4d6d9f","actorTextColor":"#1a132f","noteBkgColor":"#ffffff","noteBorderColor":"#c9c7d0","noteTextColor":"#1a132f"},"sequence":{"useMaxWidth":false,"mirrorActors":false,"messageFontSize":11,"actorFontSize":11,"noteFontSize":11,"width":104,"height":30,"actorMargin":30,"boxMargin":5,"noteMargin":5,"messageMargin":22,"showSequenceNumbers":true}}}%%`;

const styles = `
    classDef core fill:#c7d6ee,stroke:#2f4a73,stroke-width:2px,color:#1a132f
    classDef infra fill:#fbf0dc,stroke:#c99a3b,stroke-width:1.5px,color:#1a132f
    classDef ext fill:#fbe7ea,stroke:#cf6f7b,stroke-width:1.5px,color:#1a132f
    classDef ghost fill:#f6f6f8,stroke:#b9b7c2,stroke-dasharray:4 3,color:#6b6880`;

/* 7.1 - 비즈니스 서비스(Spring Boot)와 AI 서버(FastAPI)의 분리.
   AI 서버를 부르는 서비스는 shorts / sns / analytics 코드(AiShortsAdapter, fastapi base-url, AiAnalysisAdapter)에서 확인했다 */
export const msaChart = `%%{init: {"theme":"base","themeVariables":{"fontFamily":"IBM Plex Sans KR, sans-serif","fontSize":"16px","primaryColor":"#ffffff","primaryTextColor":"#1a132f","primaryBorderColor":"#c9c7d0","lineColor":"#4d6d9f","clusterBkg":"#ffffff","clusterBorder":"#c9c7d0"},"flowchart":{"curve":"linear","nodeSpacing":18,"rankSpacing":80,"padding":14,"subGraphTitleMargin":{"top":10,"bottom":10}}}}%%
graph LR
    C["👤 Client"] --> GW["🔐 Spring Cloud Gateway<br/>JWT 검증"]
    subgraph BIZ["⚙️ Business Services (Spring Boot)"]
        AU["Auth<br/>인증 · 인가"]
        ST["Store<br/>매장 관리"]
        CO["Content<br/>콘텐츠 · 미디어"]
        SH["Shorts<br/>숏폼 제작"]
        SN["SNS<br/>SNS 연동 · 게시"]
        AN["Analytics<br/>분석 · 통계"]
    end
    AI["🤖 AI Service<br/>FastAPI · LangGraph<br/>게시물 · 숏폼 · 분석 생성"]
    GW --> BIZ
    SH -->|숏폼 생성| AI
    SN -->|게시물 생성| AI
    AN -->|댓글 · 성과 분석| AI
    classDef gw fill:#c7d6ee,stroke:#2f4a73,stroke-width:2px,color:#1a132f
    classDef biz fill:#e8f0fa,stroke:#4d6d9f,stroke-width:1.5px,color:#1a132f
    classDef ai fill:#e3f1f5,stroke:#61a4bc,stroke-width:2px,color:#1a132f
    class GW gw
    class AU,ST,CO,SH,SN,AN biz
    class AI ai
    style BIZ fill:#f6f9fd,stroke:#4d6d9f,stroke-dasharray:4 3`;

/* 7.3 - 계층 분리와 플랫폼 확장 지점.
   Delegator(EnumMap)는 application 계층의 @Service 이고, 플랫폼별 UseCase 구현체가 supportSnsType() 으로 supportSnsType() 값으로 생성자에서 EnumMap 에 매핑된다.
   점선 노드는 아직 없는 플랫폼이 들어올 자리다 (구현된 것이 아니다) */
export const layerChart = `${flowInit}
graph LR
    IN["adapter.in<br/>REST Controller"] -->|SnsType| DEL
    subgraph APP["application"]
        DEL["Delegator<br/>EnumMap<br/>(SnsType → UseCase)"]
        YT["YouTube 서비스<br/>(UseCase 구현체)"]
        NEW["+ 새 플랫폼 서비스<br/>(UseCase 구현체 추가)"]
        DEL --> YT
        DEL -.->|"supportSnsType()<br/>→ 플랫폼 매핑"| NEW
    end
    YT --> OUT["adapter.out<br/>YouTube Data API 호출"]${styles}
    class DEL core
    class OUT ext
    class NEW ghost
    style APP fill:#f6f9fd,stroke:#4d6d9f,stroke-dasharray:4 3`;

/* 7.4 - OAuth state 발급 → 콜백 검증 (state 를 다루는 단계는 색 띠로 강조) */
export const oauthChart = `${seqInit}
sequenceDiagram
    participant U as 👤 사용자 / 브라우저
    participant S as ⚙️ sns-service
    participant D as 🗄️ DB
    participant G as 🌐 Google OAuth
    U->>S: 계정 연동 요청
    rect rgb(253,244,222)
    S->>D: state 발급 · 저장 (TTL 10분)
    end
    S-->>U: 인가 URL (state 포함)
    Note over U,G: Google 인증 · 동의 → 브라우저가 콜백 URL로 리다이렉트
    U->>S: 콜백 (code, state)
    rect rgb(253,244,222)
    S->>D: state 조회 · 만료 확인 · 즉시 삭제
    end
    S->>G: code로 토큰 교환
    S->>D: 토큰 저장`;

/* 7.5 - S3 스트리밍 → YouTube Resumable 업로드 */
export const uploadChart = `${flowInit}
graph LR
    S3["🪣 AWS S3<br/>영상 객체"] -->|스트리밍| SNS["⚙️ sns-service"]
    SNS -->|"Resumable Upload<br/>10MB 청크<br/>private + publishAt"| YT["▶️ YouTube"]
    YT -.->|"publishAt 시각에<br/>YouTube에서 공개"| PUB["예약 공개"]${styles}
    class SNS core
    class S3 infra
    class YT,PUB ext`;

/* 7.2 - 이벤트(단방향)와 요청/응답(Kafka request-reply)을 나눠 그린다.
   이벤트: sns-service 가 발행, analytics-service 가 구독 (PostEventConsumer).
   요청/응답: analytics-service 가 post-info.request 를 보내고(ReplyingKafkaTemplate, 60초 대기),
   sns-service(PostInfoRequestHandler)가 post-info.reply 로 응답한다 */
export const eventChart = `${seqInit}
sequenceDiagram
    participant SNS as ⚙️ sns-service
    participant K as 📨 Kafka
    participant AN as 📊 analytics-service
    rect rgb(245,249,252)
    Note over SNS,AN: 이벤트 - 단방향
    SNS->>K: post.created · post.deleted 발행
    K-->>AN: 구독
    end
    rect rgb(253,244,222)
    Note over SNS,AN: 요청 · 응답 - 게시물 정보 조회
    AN->>K: post-info.request
    K-->>SNS: 요청 전달
    SNS->>K: post-info.reply
    K-->>AN: 응답 전달 (60초 대기)
    end`;

/* 8.3 - 예약 게시: 업로드 시점에 private + publishAt 을 등록하고, 공개 전환은 YouTube 가 한다
   (YoutubeVideoInsertApi: setPrivacyStatus("private") + setPublishAt) */
export const scheduleChart = `${flowInit}
graph LR
    UP["⚙️ sns-service<br/>영상 업로드"] -->|"private + publishAt 등록"| YT["▶️ YouTube<br/>비공개 상태로 보관"]
    YT -.->|"예약 시각 도달"| PUB["공개 전환<br/>(YouTube가 실행)"]${styles}
    class UP core
    class YT,PUB ext`;
