/*
  소담이 챗봇의 RAG + Query Routing 파이프라인.
  발표자료의 손그림 맵을 사이트 톤(청록·카드·IBM Plex)으로 재현했다.
  순수 HTML/CSS — 세로 흐름 + Query Routing 4갈래 분기.
*/

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2" aria-hidden="true">
      {label && <span className="rail text-muted">{label}</span>}
      <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
        <path
          d="M7 0v16M1 11l6 6 6-6"
          stroke="var(--muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Box({
  children,
  tone = "plain",
}: {
  children: React.ReactNode;
  tone?: "plain" | "accent";
}) {
  const cls =
    tone === "accent"
      ? "border-tide/40 bg-tide/8"
      : "border-line bg-surface";
  return (
    <div
      className={`w-full max-w-sm rounded-xl border px-5 py-4 text-center ${cls}`}
    >
      {children}
    </div>
  );
}

const ROUTES = ["낙농 전문 지식", "농장 기록 조회", "일반 대화", "무관 질문"];

export default function RagDiagram() {
  return (
    <div className="flex flex-col items-center">
      <Box>
        <p className="font-semibold text-[0.95rem]">낙농 전문 지식 문서</p>
        <p className="rail mt-1.5 text-muted">이미지 · PDF · TXT · 텍스트</p>
      </Box>

      <Arrow label="SPLITTING & EMBEDDING" />

      <Box>
        <p className="font-semibold text-[0.95rem]">Vector DB</p>
        <p className="rail mt-1.5 text-muted">문서를 벡터로 저장</p>
      </Box>

      <Arrow label="관련 문서 검색" />

      <Box tone="accent">
        <p className="font-semibold text-[0.95rem]">Query Routing</p>
        <p className="text-sm text-muted mt-1">
          사용자 질문을 4가지 유형으로 자동 분류
        </p>
        <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
          {ROUTES.map((r) => (
            <li
              key={r}
              className="rail rounded-md border border-tide/30 bg-surface px-2 py-0.5"
            >
              {r}
            </li>
          ))}
        </ul>
      </Box>

      <Arrow label="유형별 응답 경로 분기" />

      <Box>
        <p className="font-semibold text-[0.95rem]">GPT</p>
        <p className="text-sm text-muted mt-1">
          검색한 문서를 근거로, 출처와 함께 답변 생성
        </p>
      </Box>
    </div>
  );
}
