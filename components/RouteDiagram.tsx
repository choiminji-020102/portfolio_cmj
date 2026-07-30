/*
  챗봇 LangGraph의 Query Routing 분기 다이어그램.
  실제 graph.py 구조: START → classifier → 4분기(조건부) → 각 응답 → END.
  cow_info만 별도 서브그래프.
*/

function Down() {
  return (
    <svg
      width="10"
      height="12"
      viewBox="0 0 12 16"
      fill="none"
      className="my-1"
      aria-hidden="true"
    >
      <path
        d="M6 0v12M1 8l5 5 5-5"
        stroke="var(--muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ROUTES = [
  {
    node: "rag_response",
    label: "낙농 지식",
    desc: "RAG로 문서 검색 → 못 찾으면 상식으로 답변(fallback)",
  },
  {
    node: "cow_info_graph",
    label: "농장 소 정보",
    desc: "이표번호·이름으로 개체 조회",
    badge: "서브그래프",
  },
  {
    node: "general_response",
    label: "UX 대화",
    desc: "인사·감정·이전 대화 참조·잡담",
  },
  {
    node: "irrelevant_response",
    label: "무관 질문",
    desc: "낙농과 무관하면 정중히 거절",
  },
];

export default function RouteDiagram() {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full max-w-xs rounded-lg border border-line bg-surface px-4 py-1.5 text-center">
        <span className="text-[0.85rem] font-medium">사용자 질문</span>
      </div>

      <Down />

      <div className="w-full max-w-xs rounded-lg border border-tide/40 bg-tide/8 px-4 py-1.5 text-center">
        <p className="text-[0.85rem] font-semibold">classifier</p>
        <p className="rail mt-0.5 text-muted">GPT로 질문을 4가지 유형으로 분류</p>
      </div>

      {/* 4갈래로 뻗는 분기선 */}
      <div className="relative h-5 w-full" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-2.5 w-px -translate-x-1/2 bg-muted" />
        <div className="absolute left-[12.5%] right-[12.5%] top-2.5 hidden h-px bg-muted sm:block" />
        <div className="absolute left-1/4 right-1/4 top-2.5 h-px bg-muted sm:hidden" />
        {[12.5, 37.5, 62.5, 87.5].map((left) => (
          <div
            key={left}
            className="absolute top-2.5 hidden h-2.5 w-px bg-muted sm:block"
            style={{ left: `${left}%` }}
          />
        ))}
        {[25, 75].map((left) => (
          <div
            key={left}
            className="absolute top-2.5 h-2.5 w-px bg-muted sm:hidden"
            style={{ left: `${left}%` }}
          />
        ))}
      </div>

      <ul className="grid w-full grid-cols-2 gap-1.5 sm:grid-cols-4">
        {ROUTES.map((r) => (
          <li
            key={r.node}
            className="flex flex-col rounded-lg border border-line bg-surface px-2.5 py-2"
          >
            <span className="rail block break-all text-tide">{r.node}</span>
            <span className="mt-0.5 text-[0.82rem] font-medium leading-snug">
              {r.label}
            </span>
            {r.badge && (
              <span className="rail mt-1 self-start rounded border border-line px-1.5 text-muted">
                {r.badge}
              </span>
            )}
            <p className="mt-1 text-[0.75rem] leading-snug text-muted">
              {r.desc}
            </p>
          </li>
        ))}
      </ul>

      <Down />

      <div className="w-full max-w-xs rounded-lg border border-line bg-surface px-4 py-1.5 text-center">
        <span className="text-[0.85rem] font-medium">답변 생성 → END</span>
      </div>
    </div>
  );
}
