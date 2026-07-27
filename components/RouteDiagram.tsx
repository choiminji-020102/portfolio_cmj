/*
  챗봇 LangGraph의 Query Routing 분기 다이어그램.
  실제 graph.py 구조: START → classifier → 4분기(조건부) → 각 응답 → END.
  cow_info만 별도 서브그래프.
*/

function Down() {
  return (
    <svg
      width="12"
      height="16"
      viewBox="0 0 12 16"
      fill="none"
      className="my-1.5"
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
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md rounded-lg border border-line bg-surface px-4 py-2.5 text-center">
        <span className="text-[0.9rem] font-medium">사용자 질문</span>
      </div>

      <Down />

      <div className="w-full max-w-md rounded-lg border border-tide/40 bg-tide/8 px-4 py-2.5 text-center">
        <p className="text-[0.9rem] font-semibold">classifier</p>
        <p className="rail mt-0.5 text-muted">
          GPT로 질문을 4가지 유형으로 분류 (answer_route)
        </p>
      </div>

      <Down />
      <p className="rail text-muted mb-2">조건부 분기 (4갈래)</p>

      <ul className="w-full max-w-md space-y-2">
        {ROUTES.map((r) => (
          <li
            key={r.node}
            className="rounded-lg border border-line bg-surface px-4 py-2.5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rail text-tide">{r.node}</span>
              <span className="text-[0.9rem] font-medium">{r.label}</span>
              {r.badge && (
                <span className="rail rounded border border-line px-1.5 py-0.5 text-muted">
                  {r.badge}
                </span>
              )}
            </div>
            <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">
              {r.desc}
            </p>
          </li>
        ))}
      </ul>

      <Down />

      <div className="w-full max-w-md rounded-lg border border-line bg-surface px-4 py-2.5 text-center">
        <span className="text-[0.9rem] font-medium">답변 생성 → END</span>
      </div>
    </div>
  );
}
