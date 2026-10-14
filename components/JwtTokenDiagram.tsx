import MermaidDiagram from "./MermaidDiagram";

/* 토큰 흐름 - 요청 검증(Gateway)과 Refresh 롤링이 같은 Redis를 쓴다는 점만 보여 준다 */
const CHART = `%%{init: {"theme":"base","themeVariables":{"fontFamily":"IBM Plex Sans KR, sans-serif","fontSize":"16px","primaryColor":"#ffffff","primaryTextColor":"#1a132f","primaryBorderColor":"#c9c7d0","lineColor":"#4d6d9f"},"flowchart":{"curve":"linear","nodeSpacing":40,"rankSpacing":60,"padding":14}}}%%
graph LR
    C[👤 Client]
    GW[🔐 Gateway<br/>서명 · 만료 · 블랙리스트 검증]
    AU[🔑 Auth Service]
    subgraph RD["🗄️ Redis"]
        RT["Refresh Token 저장"]
        BL["Access jti 블랙리스트"]
    end
    C -->|Access JWT| GW
    GW -->|jti 조회| BL
    C -->|Refresh 요청| AU
    AU -->|Refresh Token Rotation| RT
    AU -.->|로그아웃 · Access 폐기 시<br/>jti 등록| BL
    classDef gw fill:#c7d6ee,stroke:#2f4a73,stroke-width:2px,color:#1a132f
    classDef infra fill:#fbf0dc,stroke:#c99a3b,stroke-width:1.5px,color:#1a132f
    class GW gw
    class RT,BL infra
    style RD fill:#fdf8ee,stroke:#c99a3b,stroke-dasharray:4 3`;

export default function JwtTokenDiagram() {
  return (
    <div className="rounded-xl border border-line bg-surface p-3 sm:p-4">
      <MermaidDiagram chart={CHART} />
    </div>
  );
}
