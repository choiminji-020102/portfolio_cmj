import MermaidDiagram from "./MermaidDiagram";

/*
  Backend 요청 경로 - 발표자료 29쪽 구성도.
  CloudFront → Nginx → Spring Cloud Gateway → MSA 서비스.
  색은 담당 아키텍처 도식과 같은 규칙(진입 계층 = 청록, 서비스 = 파랑, 저장소 = 황색).
*/
const CHART = `%%{init: {"theme":"base","themeVariables":{"fontFamily":"IBM Plex Sans KR, sans-serif","fontSize":"16px","primaryColor":"#ffffff","primaryTextColor":"#1a132f","primaryBorderColor":"#c9c7d0","lineColor":"#4d6d9f","clusterBkg":"#ffffff","clusterBorder":"#c9c7d0"},"flowchart":{"curve":"basis","padding":16,"nodeSpacing":28,"rankSpacing":50}}}%%
graph LR
    U[👤 User] --> CF[☁️ CloudFront<br/>엣지 캐시 · 오리진 통합]
    CF -->|"/"| S3F[🪣 S3 Frontend]
    CF -->|"/media/*"| S3C[🪣 S3 Content Private<br/>Signed Cookies / URL]
    CF -->|"/api/*"| NG[🌐 Nginx<br/>TLS 종료 · 리버스 프록시]
    NG --> GW[🔐 Spring Cloud Gateway<br/>JWT 검증 · 블랙리스트]
    subgraph MSA["MSA 서비스"]
        AU[Auth]
        ST[Store]
        SH[Shorts]
        CO[Content]
        SN[SNS]
        AN[Analytics]
    end
    GW --> AU
    GW --> ST
    GW --> SH
    GW --> CO
    GW --> SN
    GW --> AN
    AU --> RD[🗝️ Redis<br/>RefreshToken · Blacklist]
    SH --> FA[⚡ FastAPI 생성]
    CO --> S3M[🪣 S3 Media<br/>업데이트 · 삭제 · 썸네일]
    classDef edge fill:#e3f1f5,stroke:#61a4bc,stroke-width:1.5px,color:#1a132f
    classDef svc fill:#e8f0fa,stroke:#4d6d9f,stroke-width:1.5px,color:#1a132f
    classDef store fill:#fbf0dc,stroke:#c99a3b,stroke-width:1.5px,color:#1a132f
    class CF,NG,GW edge
    class AU,ST,SH,CO,SN,AN,FA svc
    class S3F,S3C,S3M,RD store
    style MSA fill:#f6f9fd,stroke:#4d6d9f,stroke-dasharray:4 3`;

export default function BackendChainDiagram() {
  return (
    <div className="mt-3 rounded-xl border border-line bg-surface p-3 sm:p-4">
      <MermaidDiagram chart={CHART} />
    </div>
  );
}
