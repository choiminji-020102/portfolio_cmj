import type { Project } from "@/lib/projects";
import type { CodeLang } from "@/lib/highlight";
import CodeBlock from "@/components/CodeBlock";
import SubscriptionPeriodDiagram from "@/components/diagrams/SubscriptionPeriodDiagram";
import SendGroupingDiagram from "@/components/diagrams/SendGroupingDiagram";
import DuplicatePreventionDiagram from "@/components/diagrams/DuplicatePreventionDiagram";
import Cafe24SyncDiagram from "@/components/diagrams/Cafe24SyncDiagram";
import PauseDesignDiagram from "@/components/diagrams/PauseDesignDiagram";

interface Props {
  project: Project;
  challengeId: string;
  onNavigate: (id: string) => void;
}

/*
  드로어 안의 위계는 TroubleDetails(소담소담·삼성메디슨 서랍)와 같은 값을 쓴다.
  절 제목은 deep 볼드, 본문은 한 단계 작은 글. 페이지 쪽 h2(text-2xl)를 그대로
  가져오면 좁은 패널에서 제목만 눈에 들어온다.
*/
const drawerSection = "text-[0.95rem] font-bold tracking-tight text-deep";
const drawerBody = "text-[0.9rem] leading-relaxed text-ink whitespace-pre-line";
const navLink =
  "rail inline-flex items-center gap-2 text-muted hover:text-ink transition-colors max-w-[45%]";

/* 하이라이터가 아는 언어만 넘긴다 — 그 외(sql 등)는 색 없이 그대로 */
const HIGHLIGHTED: CodeLang[] = ["python", "java", "json"];
const toLang = (name: string) =>
  (HIGHLIGHTED as string[]).includes(name) ? (name as CodeLang) : undefined;

export default function ChallengeDetailView({ project, challengeId, onNavigate }: Props) {
  const index = project.challenges.findIndex((c) => c.id === challengeId);
  const challenge = project.challenges[index];
  const prev = index > 0 ? project.challenges[index - 1] : null;
  const next = index < project.challenges.length - 1 ? project.challenges[index + 1] : null;

  if (!challenge) return null;

  return (
    <div className="px-8 py-10">
      {/* 상단 내비게이션 */}
      <div className="rail flex items-center justify-end gap-3">
        <span>
          {index + 1} / {project.challenges.length}
        </span>
        {prev ? (
          <button
            onClick={() => onNavigate(prev.id)}
            title={prev.title}
            className="text-tide hover:text-deep transition-colors"
          >
            ←
          </button>
        ) : (
          <span className="text-line">←</span>
        )}
        {next ? (
          <button
            onClick={() => onNavigate(next.id)}
            title={next.title}
            className="text-tide hover:text-deep transition-colors"
          >
            →
          </button>
        ) : (
          <span className="text-line">→</span>
        )}
      </div>

      {/* 헤더 */}
      <div className="mt-8 border-b border-line pb-8">
        <p className="rail text-muted">
          트러블 슈팅
          <span className="mx-2 text-line">·</span>
          {String(index + 1).padStart(2, "0")}
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight">
          {challenge.title}
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
          {challenge.summary}
        </p>
      </div>

      <div className="mt-8">
        <h3 className={drawerSection}>문제</h3>
        <p className={`mt-3 ${drawerBody}`}>{challenge.problem}</p>
      </div>

      {/* 설계 결정 — 이 항목의 결론 */}
      <div className="mt-8">
        <h3 className={drawerSection}>설계 결정</h3>
        <p className={`mt-3 border-l-2 border-tide/60 pl-4 ${drawerBody}`}>
          {challenge.decision}
        </p>
      </div>

      {challenge.diagramId && (
        <div className="mt-8">
          <h3 className={drawerSection}>구조</h3>
          <div className="mt-3 rounded-xl border border-line bg-surface p-3 sm:p-4">
            {challenge.diagramId === "subscription-period" && <SubscriptionPeriodDiagram />}
            {challenge.diagramId === "send-grouping" && <SendGroupingDiagram />}
            {challenge.diagramId === "duplicate-prevention" && <DuplicatePreventionDiagram />}
            {challenge.diagramId === "cafe24-sync" && <Cafe24SyncDiagram />}
            {challenge.diagramId === "pause-design" && <PauseDesignDiagram />}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className={drawerSection}>구현</h3>
        <div className="mt-4 space-y-6">
          {challenge.steps.map((step, i) => (
            <div key={i} className="border-l-2 border-tide/40 pl-4">
              <p className={`flex gap-2.5 ${drawerBody}`}>
                <span className="rail text-tide shrink-0 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step.description}</span>
              </p>
              {step.code && (
                <div className="mt-3">
                  <p className="rail mb-1.5 text-muted">{step.code.language}</p>
                  <CodeBlock
                    code={step.code.content}
                    lang={toLang(step.code.language)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className={drawerSection}>결과</h3>
        <p className={`mt-3 ${drawerBody}`}>{challenge.result}</p>
      </div>

      {/* 하단 내비게이션 */}
      <div className="mt-10 flex justify-between gap-6 border-t border-line pt-8">
        {prev ? (
          <button onClick={() => onNavigate(prev.id)} className={navLink}>
            <span aria-hidden="true" className="text-tide">
              ←
            </span>
            <span className="truncate">{prev.title}</span>
          </button>
        ) : (
          <div />
        )}
        {next ? (
          <button onClick={() => onNavigate(next.id)} className={navLink}>
            <span className="truncate">{next.title}</span>
            <span aria-hidden="true" className="text-tide">
              →
            </span>
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
