/*
  소담이 챗봇의 RAG + Query Routing 파이프라인.
  두 단계로 나뉜다:
    1) 사전 준비(인덱싱) — 문서를 임베딩해 Vector DB에 저장
    2) 실시간 질문 처리 — 사용자 질문을 GPT가 Query Routing으로 분류하고,
       '낙농 전문 지식'이면 Vector DB에서 검색해 근거로 답변 생성
  발표자료 손그림 맵의 실제 흐름을 사이트 톤으로 재현했다.
*/
import {
  HiDocumentText,
  HiCircleStack,
  HiChatBubbleLeftRight,
  HiSparkles,
  HiChatBubbleBottomCenterText,
} from "react-icons/hi2";

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2" aria-hidden="true">
      {label && (
        <span className="rail text-muted text-center max-w-[16rem]">
          {label}
        </span>
      )}
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
    <div className={`w-full max-w-xl rounded-xl border px-5 py-4 ${cls}`}>
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
      {/* 1단계 — 사전 준비 */}
      <p className="eyebrow mb-4">STEP 1 · 사전 준비 (지식 인덱싱)</p>
      <Box
        icon={<HiDocumentText className="w-5 h-5" />}
        title="낙농 전문 지식 문서"
        desc="이미지 · PDF · TXT · 텍스트"
      />
      <Arrow label="SPLITTING & EMBEDDING" />
      <Box
        icon={<HiCircleStack className="w-5 h-5" />}
        title="Vector DB"
        desc="문서를 벡터로 저장해 검색에 대비"
      />

      {/* 단계 구분 */}
      <div className="my-7 w-full max-w-xl border-t border-dashed border-line" />

      {/* 2단계 — 실시간 질문 처리 */}
      <p className="eyebrow mb-4">STEP 2 · 실시간 질문 처리</p>
      <Box
        icon={<HiChatBubbleLeftRight className="w-5 h-5" />}
        title="사용자 질문"
        desc="챗봇에 입력된 질의"
      />
      <Arrow />
      <Box
        icon={<HiSparkles className="w-5 h-5" />}
        title="GPT · Query Routing"
        desc="질문을 4가지 유형으로 자동 분류"
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
      <Arrow label="'낙농 전문 지식'이면 Vector DB에서 관련 문서 검색" />
      <Box
        icon={<HiSparkles className="w-5 h-5" />}
        title="GPT · 답변 생성"
        desc="검색한 문서를 근거로, 출처와 함께 답변"
      />
      <Arrow />
      <Box
        icon={<HiChatBubbleBottomCenterText className="w-5 h-5" />}
        title="출처 포함 답변"
        desc="근거 문서의 출처와 함께 사용자에게 전달"
      />
    </div>
  );
}
