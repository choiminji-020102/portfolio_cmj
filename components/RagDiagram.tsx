/*
  소담이 챗봇의 RAG + Query Routing 파이프라인.
  발표자료의 손그림 맵을 사이트 톤(청록·카드·IBM Plex)으로 재현했다.
  각 단계에 아이콘을 붙여 텍스트를 읽지 않아도 흐름이 눈에 들어오게 했다.
*/
import {
  HiDocumentText,
  HiCircleStack,
  HiMagnifyingGlass,
  HiArrowsRightLeft,
  HiSparkles,
} from "react-icons/hi2";

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
  icon,
  title,
  desc,
  tone = "plain",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
  tone?: "plain" | "accent";
  children?: React.ReactNode;
}) {
  const cls =
    tone === "accent" ? "border-tide/40 bg-tide/8" : "border-line bg-surface";
  const iconCls =
    tone === "accent" ? "bg-tide/15 text-deep" : "bg-ground text-muted";
  return (
    <div className={`w-full max-w-sm rounded-xl border px-5 py-4 ${cls}`}>
      <div className="flex items-center gap-3">
        <span
          className={`shrink-0 grid place-items-center w-9 h-9 rounded-lg ${iconCls}`}
          aria-hidden="true"
        >
          {icon}
        </span>
        <div>
          <p className="font-semibold text-[0.95rem] leading-tight">{title}</p>
          {desc && <p className="rail mt-1 text-muted">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

const ROUTES = ["낙농 전문 지식", "농장 기록 조회", "일반 대화", "무관 질문"];

export default function RagDiagram() {
  return (
    <div className="flex flex-col items-center">
      <Box
        icon={<HiDocumentText className="w-5 h-5" />}
        title="낙농 전문 지식 문서"
        desc="이미지 · PDF · TXT · 텍스트"
      />

      <Arrow label="SPLITTING & EMBEDDING" />

      <Box
        icon={<HiCircleStack className="w-5 h-5" />}
        title="Vector DB"
        desc="문서를 벡터로 저장"
      />

      <Arrow label="관련 문서 검색" />

      <Box
        icon={<HiArrowsRightLeft className="w-5 h-5" />}
        title="Query Routing"
        desc="사용자 질문을 4가지 유형으로 자동 분류"
        tone="accent"
      >
        <ul className="mt-3 flex flex-wrap gap-1.5 pl-12">
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

      <Box
        icon={<HiSparkles className="w-5 h-5" />}
        title="GPT"
        desc="검색한 문서를 근거로, 출처와 함께 답변 생성"
      />
    </div>
  );
}
