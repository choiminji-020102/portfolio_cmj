import type { Challenge, Project } from "@/lib/projects";
import type { CodeLang } from "@/lib/highlight";
import { accentBlock, sectionTitle } from "@/lib/ui";
import CodeBlock from "./CodeBlock";
import ShotGrid from "./ShotGrid";
import SubscriptionPeriodDiagram from "./diagrams/SubscriptionPeriodDiagram";
import SendGroupingDiagram from "./diagrams/SendGroupingDiagram";
import DuplicatePreventionDiagram from "./diagrams/DuplicatePreventionDiagram";
import Cafe24SyncDiagram from "./diagrams/Cafe24SyncDiagram";
import PauseDesignDiagram from "./diagrams/PauseDesignDiagram";

/*
  트러블 슈팅 — 본문에 펼친다.
  예전에는 눌러야 열리는 서랍이었는데, 다른 프로젝트 상세는 모두 본문에 펴 두어
  같은 포트폴리오 안에서 읽는 방식이 갈렸다. 분량이 많은 쪽에 맞추는 대신
  소절 라벨(문제·설계 결정·구현·결과)로 위계를 잡아 스크롤로 훑을 수 있게 했다.
*/

/* 하이라이터가 아는 언어만 넘긴다 — 그 외(sql 등)는 색 없이 그대로 */
const HIGHLIGHTED: CodeLang[] = ["python", "java", "json"];
const toLang = (name: string) =>
  (HIGHLIGHTED as string[]).includes(name) ? (name as CodeLang) : undefined;

/* 소절 라벨 — 기능 카드의 '기능 설명'·'핵심 로직'과 같은 표기 */
const subLabel = "rail text-muted";
const body = "text-[0.95rem] leading-relaxed whitespace-pre-line";

/* 한 장을 그리는 부분 — 설계 결정과 트러블 슈팅이 같은 골격을 쓴다.
   번호는 붙이지 않는다. 목록의 순서가 정보를 담지 않아(어느 것부터 읽어도 된다)
   번호가 있으면 없는 흐름을 암시한다 */
function ChallengeCard({ challenge }: { challenge: Challenge }) {
  return (
          <div
            key={challenge.id}
            id={`trouble-${challenge.id}`}
            /* 기능 카드에서 앵커로 건너뛰므로 sticky 상단바 높이만큼 띄운다 */
            className="scroll-mt-20"
          >
            <h3 className="text-lg font-semibold leading-snug tracking-tight">
              {challenge.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {challenge.summary}
            </p>

            <div className="mt-5">
              <p className={subLabel}>문제</p>
              <p className={`mt-2 max-w-3xl ${body}`}>{challenge.problem}</p>
            </div>

            {/* 설계 결정 — 이 항목의 결론 */}
            <div className="mt-5">
              <p className={subLabel}>설계 결정</p>
              <p className={`mt-2 max-w-3xl ${accentBlock} ${body}`}>
                {challenge.decision}
              </p>
            </div>

            {challenge.diagramId && (
              <div className="mt-6">
                <p className={subLabel}>구조</p>
                <div className="mt-3 rounded-xl border border-line bg-surface p-3 sm:p-4">
                  {challenge.diagramId === "subscription-period" && (
                    <SubscriptionPeriodDiagram />
                  )}
                  {challenge.diagramId === "send-grouping" && (
                    <SendGroupingDiagram />
                  )}
                  {challenge.diagramId === "duplicate-prevention" && (
                    <DuplicatePreventionDiagram />
                  )}
                  {challenge.diagramId === "cafe24-sync" && <Cafe24SyncDiagram />}
                  {challenge.diagramId === "pause-design" && <PauseDesignDiagram />}
                </div>
              </div>
            )}

            <div className="mt-6">
              <p className={subLabel}>구현</p>
              <div className="mt-3 space-y-6">
                {challenge.steps.map((step, si) => (
                  <div key={si} className={accentBlock}>
                    <p className={`flex gap-2.5 ${body}`}>
                      <span className="rail text-tide shrink-0 pt-0.5">
                        {String(si + 1).padStart(2, "0")}
                      </span>
                      <span>{step.description}</span>
                    </p>
                    {step.code && (
                      <div className="mt-3">
                        <p className="rail mb-1.5 text-muted">
                          {step.code.language}
                        </p>
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

            <div className="mt-5">
              <p className={subLabel}>결과</p>
              <p className={`mt-2 max-w-3xl ${body}`}>{challenge.result}</p>
            </div>

            {/* 화면 기록 — 서술의 숫자를 눈으로 확인시키는 자리라 결과 뒤에 둔다.
                기능 카드의 '개선 전/후'와 같은 격자를 쓰되 라벨만 장애에 맞춘다 */}
            {challenge.screenshots && challenge.screenshots.length > 0 && (
              <div className="mt-6">
                <p className={subLabel}>화면 기록 — 누르면 크게 보인다</p>
                <ShotGrid
                  shots={challenge.screenshots}
                  labels={{ before: "증상", after: "해결 후" }}
                  layout="compare"
                />
              </div>
            )}
          </div>
  );
}

export default function ChallengeSection({ project }: { project: Project }) {
  if (project.challenges.length === 0) return null;

  /* 성격이 다른 둘을 한 목록에 두면 양쪽 다 흐려진다 —
     "왜 이렇게 만들었나"(설계 결정)와 "터져서 어떻게 고쳤나"(트러블 슈팅)는
     읽는 목적이 다르다. kind 를 쓰지 않는 프로젝트는 예전처럼 한 덩어리로 둔다 */
  const design = project.challenges.filter((c) => c.kind === "design");
  const incident = project.challenges.filter((c) => c.kind === "incident");
  const groups =
    design.length + incident.length === 0
      ? [{ title: "트러블 슈팅", list: project.challenges }]
      : [
          { title: "설계 결정", list: design },
          { title: "트러블 슈팅", list: incident },
        ].filter((g) => g.list.length > 0);

  return (
    <>
      {groups.map((group) => (
        <section key={group.title} className="mt-16">
          <h2 className={sectionTitle}>{group.title}</h2>
          <div className="mt-8 space-y-12">
            {group.list.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
