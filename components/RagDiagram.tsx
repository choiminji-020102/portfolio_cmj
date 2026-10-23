/*
  소담이 챗봇의 RAG + Query Routing 파이프라인.
  발표자료 12p 구조도를 가로형으로 재구성했다.

    위     - 사전 인덱싱: 문서 → Splitting/Embedding → Vector DB → 검색
    가운데 - Query Routing 4분기, '낙농 전문 지식'만 Vector DB 검색을 거친다
    아래   - 분기마다 처리가 다르다(graph.py 기준)
             낙농 전문 지식: 검색 문서 기반 GPT 답변 (rag_response)
             농장 기록 조회: Firebase 조회 값을 문장으로 조립, GPT 없음 (cow_info_graph)
             일반 대화: 이전 대화 기록을 참조한 GPT 답변 (general_response)
             무관 질문: 고정 문구로 거절, GPT 없음 (irrelevant_response)
    오른쪽 - 사용자 휴대폰: Query 입력 → Response 출력

  원본(분기가 하나의 GPT로 합쳐지는 형태)은 docs/archive/RagDiagram.original.tsx.bak

  글자 크기는 FS 하나로 통일하고, 아이콘은 scale(0.9)로 한 단계 줄였다.
*/

const FS = 16.5;

const DOCS = [
  { x: 20, fill: "#0f9d58", label: "", grid: true }, // 스프레드시트
  { x: 66, fill: "#e8453c", label: "PDF" },
  { x: 112, fill: "#2b2f3a", label: "TXT" },
  { x: 158, fill: "#2f7cf6", label: "", lines: true }, // 문서
];

const ROUTES = [
  { x: 490, label: "낙농 전문 지식" },
  { x: 628, label: "농장 기록 조회" },
  { x: 766, label: "일반 대화" },
  { x: 904, label: "무관 질문" },
];

/* 분기별 처리 설명 - 한 줄 9자 안팎(분기 간격 138에 맞춤) */
const HANDLERS = [
  { x: 490, lines: ["검색 문서 기반", "답변 생성"] },
  { x: 628, lines: ["DB 값으로 응답", "(GPT 없음)"] },
  { x: 766, lines: ["이전 대화 참조", "대화 응답"] },
  { x: 904, lines: ["정해진 거절 문구", "(GPT 없음)"] },
];

/* 파란 로봇 - 중심은 x + 24 (몸통 60 × 0.8) */
function Robot({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(0.8)`}>
      <line x1="30" y1="-10" x2="30" y2="2" stroke="#2f7cf6" strokeWidth="3" />
      <circle cx="30" cy="-13" r="4" fill="#2f7cf6" />
      <rect x="0" y="2" width="60" height="48" rx="12" fill="#2f7cf6" />
      <rect x="-8" y="16" width="8" height="18" rx="4" fill="#2f7cf6" />
      <rect x="60" y="16" width="8" height="18" rx="4" fill="#2f7cf6" />
      <circle cx="19" cy="22" r="7" fill="#fff" />
      <circle cx="41" cy="22" r="7" fill="#fff" />
      <circle cx="19" cy="22" r="3.4" fill="#1b2733" />
      <circle cx="41" cy="22" r="3.4" fill="#1b2733" />
      <path
        d="M20 36q10 8 20 0"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

export default function RagDiagram() {
  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="4 10 1202 476"
        className="h-auto w-full min-w-[860px]"
        role="img"
        aria-label="소담이 챗봇의 RAG 및 Query Routing 파이프라인 구조도"
      >
        <defs>
          <marker
            id="rag-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 10 5 0 10z" fill="var(--ink)" />
          </marker>
        </defs>

        {/* ───────── 위 - 사전 인덱싱 (가로 흐름) ───────── */}
        {DOCS.map((d) => (
          <g key={d.x} transform={`translate(${d.x} 20) scale(0.8)`}>
            <path
              d="M0 0h34l14 14v42a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6z"
              fill={d.fill}
            />
            <path d="M34 0l14 14H34z" fill="#000" fillOpacity="0.18" />
            {d.label && (
              <text
                x="24"
                y="42"
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="700"
              >
                {d.label}
              </text>
            )}
            {d.grid && (
              <g stroke="#fff" strokeWidth="2.5" opacity="0.9">
                <line x1="10" y1="26" x2="38" y2="26" />
                <line x1="10" y1="36" x2="38" y2="36" />
                <line x1="10" y1="46" x2="38" y2="46" />
                <line x1="24" y1="22" x2="24" y2="50" />
              </g>
            )}
            {d.lines && (
              <g stroke="#fff" strokeWidth="2.5" opacity="0.9">
                <line x1="11" y1="28" x2="37" y2="28" />
                <line x1="11" y1="38" x2="37" y2="38" />
                <line x1="11" y1="48" x2="30" y2="48" />
              </g>
            )}
          </g>
        ))}

        {/* 아이콘 4개(20~196)의 중심 108 에 맞춘 캡션 - 두 줄 */}
        <text
          x="108"
          y="96"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={FS}
          fontWeight="600"
        >
          이미지, 텍스트 등의
        </text>
        <text
          x="108"
          y="118"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={FS}
          fontWeight="600"
        >
          낙농업 전문 지식 문서
        </text>

        <line
          x1="214"
          y1="45"
          x2="256"
          y2="45"
          stroke="var(--ink)"
          strokeWidth="2"
          markerEnd="url(#rag-arrow)"
        />

        <text
          x="312"
          y="39"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={FS}
          fontWeight="700"
        >
          Splitting
        </text>
        <text
          x="312"
          y="61"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={FS}
          fontWeight="700"
        >
          Embedding
        </text>

        <line
          x1="371"
          y1="45"
          x2="406"
          y2="45"
          stroke="var(--ink)"
          strokeWidth="2"
          markerEnd="url(#rag-arrow)"
        />

        {/* Vector DB - 주황 실린더 (438~503, 중심 470) */}
        <g transform="translate(420 22) scale(0.8)">
          <rect x="0" y="9" width="72" height="46" fill="#f07c2a" />
          <ellipse cx="36" cy="55" rx="36" ry="11" fill="#f07c2a" />
          <ellipse cx="36" cy="9" rx="36" ry="11" fill="#f9a05c" />
          <ellipse
            cx="36"
            cy="25"
            rx="36"
            ry="11"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
          />
          <ellipse
            cx="36"
            cy="40"
            rx="36"
            ry="11"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
          />
        </g>
        <text
          x="449"
          y="96"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={FS}
          fontWeight="700"
        >
          Vector DB
        </text>

        <line
          x1="496"
          y1="45"
          x2="530"
          y2="45"
          stroke="var(--ink)"
          strokeWidth="2"
          markerEnd="url(#rag-arrow)"
        />

        {/* 돋보기 - 검색 (손잡이가 아래 분기를 향한다) */}
        <g transform="translate(544 26) scale(0.8)">
          <circle
            cx="16"
            cy="16"
            r="15"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="3"
          />
          <line
            x1="5"
            y1="27"
            x2="-8"
            y2="42"
            stroke="var(--ink)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* 검색 결과 → '낙농 전문 지식' 분기의 GPT (분기선·라벨을 피해 왼쪽으로 돌아 들어간다) */}
        <path
          d="M533 68L420 230V361H454"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
          strokeLinejoin="round"
          markerEnd="url(#rag-arrow)"
        />

        {/* ───────── 오른쪽 - 사용자 휴대폰 ───────── */}
        <g>
          <rect
            x="1030"
            y="56"
            width="160"
            height="292"
            rx="24"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          {/* 노치 */}
          <path
            d="M1082 58h56v3a9 9 0 0 1-9 9h-38a9 9 0 0 1-9-9z"
            fill="var(--ink)"
          />
          {/* 홈 인디케이터 */}
          <rect
            x="1080"
            y="334"
            width="60"
            height="4"
            rx="2"
            fill="var(--ink)"
            opacity="0.35"
          />
        </g>

        {/* Query 말풍선 */}
        <g>
          <rect
            x="1054"
            y="92"
            width="98"
            height="38"
            rx="11"
            fill="var(--ground)"
            stroke="var(--ink)"
            strokeWidth="1.6"
          />
          <path
            d="M1124 129 L1142 148 L1136 129"
            fill="var(--ground)"
            stroke="var(--ink)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <text
            x="1103"
            y="117"
            textAnchor="middle"
            fill="var(--ink)"
            fontSize={FS}
          >
            Query
          </text>
        </g>

        {/* Response 말풍선 */}
        <g>
          <rect x="1048" y="192" width="124" height="42" rx="11" fill="#2f7cf6" />
          <text
            x="1110"
            y="219"
            textAnchor="middle"
            fill="#fff"
            fontSize={FS}
          >
            Response
          </text>
        </g>

        {/* Query → 라우팅 GPT */}
        <line
          x1="1048"
          y1="116"
          x2="745"
          y2="124"
          stroke="var(--ink)"
          strokeWidth="2"
          markerEnd="url(#rag-arrow)"
        />

        {/* ───────── 가운데 - 라우팅 (축 707) ───────── */}
        <Robot x={673} y={112} />
        <text
          x="697"
          y="172"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={FS}
          fontWeight="700"
        >
          GPT
        </text>
        <text
          x="697"
          y="191"
          textAnchor="middle"
          fill="var(--muted)"
          fontSize="14.5"
        >
          질문 의도 분류
        </text>

        <text
          x="697"
          y="218"
          textAnchor="middle"
          fill="#e8453c"
          fontSize={FS}
          fontWeight="700"
        >
          Query Routing
        </text>

        {/* 분기 바 */}
        <line
          x1="490"
          y1="240"
          x2="904"
          y2="240"
          stroke="var(--ink)"
          strokeWidth="2"
        />
        <line
          x1="697"
          y1="226"
          x2="697"
          y2="240"
          stroke="var(--ink)"
          strokeWidth="2"
        />
        {ROUTES.map((r) => (
          <line
            key={r.x}
            x1={r.x}
            y1="240"
            x2={r.x}
            y2="264"
            stroke="var(--ink)"
            strokeWidth="2"
          />
        ))}
        {ROUTES.map((r) => (
          <text
            key={r.label}
            x={r.x}
            y="288"
            textAnchor="middle"
            fill="var(--ink)"
            fontSize={FS}
            fontWeight="600"
          >
            {r.label}
          </text>
        ))}

        {/* ───────── 아래 - 분기별 처리 (합치지 않고 각자 끝낸다) ───────── */}
        {ROUTES.map((r) => (
          <line
            key={r.x}
            x1={r.x}
            y1="296"
            x2={r.x}
            y2="324"
            stroke="var(--ink)"
            strokeWidth="2"
            markerEnd="url(#rag-arrow)"
          />
        ))}

        {/* 낙농 전문 지식 - 검색 문서를 바탕으로 GPT 답변 */}
        <Robot x={ROUTES[0].x - 24} y={340} />
        <text
          x={ROUTES[0].x}
          y="402"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={FS}
          fontWeight="700"
        >
          GPT
        </text>

        {/* 농장 기록 조회 - DB 값을 문장으로 조립 (GPT 없음) */}
        <rect
          x={ROUTES[1].x - 46}
          y="334"
          width="92"
          height="44"
          rx="10"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
        />
        <text
          x={ROUTES[1].x}
          y="361"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={FS}
          fontWeight="700"
        >
          농장 DB
        </text>

        {/* 일반 대화 - 이전 대화 기록을 참조한 GPT 답변 */}
        <Robot x={ROUTES[2].x - 24} y={340} />
        <text
          x={ROUTES[2].x}
          y="402"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={FS}
          fontWeight="700"
        >
          GPT
        </text>

        {/* 무관 질문 - 고정 문구로 거절 (GPT 없음) */}
        <rect
          x={ROUTES[3].x - 46}
          y="334"
          width="92"
          height="44"
          rx="10"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
        />
        <text
          x={ROUTES[3].x}
          y="361"
          textAnchor="middle"
          fill="var(--ink)"
          fontSize={FS}
          fontWeight="700"
        >
          고정 문구
        </text>

        {/* 분기별 처리 설명 */}
        {HANDLERS.map((h) => (
          <g key={h.x}>
            <text
              x={h.x}
              y="426"
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="14.5"
            >
              {h.lines[0]}
            </text>
            <text
              x={h.x}
              y="446"
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="14.5"
            >
              {h.lines[1]}
            </text>
          </g>
        ))}

        {/* 네 경로가 각자 Response 로 모인다 */}
        {ROUTES.map((r) => (
          <line
            key={`out-${r.x}`}
            x1={r.x}
            y1="454"
            x2={r.x}
            y2="468"
            stroke="var(--ink)"
            strokeWidth="2"
          />
        ))}
        <path
          d="M490 468H1110V240"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2"
          markerEnd="url(#rag-arrow)"
        />
      </svg>
    </div>
  );
}
