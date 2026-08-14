import { notFound } from "next/navigation";
import Link from "next/link";
import { getChallenge, projects } from "@/lib/projects";
import { accentBlock, leadText, sectionTitle } from "@/lib/ui";
import type { CodeLang } from "@/lib/highlight";
import CodeBlock from "@/components/CodeBlock";
import SubscriptionPeriodDiagram from "@/components/diagrams/SubscriptionPeriodDiagram";
import SendGroupingDiagram from "@/components/diagrams/SendGroupingDiagram";
import DuplicatePreventionDiagram from "@/components/diagrams/DuplicatePreventionDiagram";
import Cafe24SyncDiagram from "@/components/diagrams/Cafe24SyncDiagram";
import PauseDesignDiagram from "@/components/diagrams/PauseDesignDiagram";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; challengeId: string }>;
}

/* 하이라이터가 아는 언어만 넘긴다 — 그 외(sql 등)는 색 없이 그대로 */
const HIGHLIGHTED: CodeLang[] = ["python", "java", "json"];
const toLang = (name: string) =>
  (HIGHLIGHTED as string[]).includes(name) ? (name as CodeLang) : undefined;

export async function generateStaticParams() {
  return projects.flatMap((p) =>
    p.challenges.map((c) => ({ slug: p.slug, challengeId: c.id }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, challengeId } = await params;
  const result = getChallenge(slug, challengeId);
  if (!result) return {};
  return {
    title: `${result.challenge.title} | ${result.project.title}`,
    description: result.challenge.summary,
  };
}

export default async function ChallengePage({ params }: Props) {
  const { slug, challengeId } = await params;
  const result = getChallenge(slug, challengeId);
  if (!result) notFound();

  const { challenge, project, index, prev, next } = result;

  return (
    <div className="min-h-screen bg-ground">
      {/* 상단바 — 왼쪽은 돌아가기, 오른쪽은 형제 항목 사이 이동 */}
      <div className="border-b border-line sticky top-0 z-10 bg-ground/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link
            href={`/projects/${slug}`}
            className="rail inline-flex items-center gap-2 text-muted hover:text-ink transition-colors min-w-0"
          >
            <span aria-hidden="true">←</span>
            <span className="truncate">{project.title}</span>
          </Link>

          <div className="rail flex items-center gap-3 shrink-0">
            <span>
              {index + 1} / {project.challenges.length}
            </span>
            {prev ? (
              <Link
                href={`/projects/${slug}/challenges/${prev.id}`}
                title={prev.title}
                className="text-tide hover:text-deep transition-colors"
              >
                ←
              </Link>
            ) : (
              <span className="text-line">←</span>
            )}
            {next ? (
              <Link
                href={`/projects/${slug}/challenges/${next.id}`}
                title={next.title}
                className="text-tide hover:text-deep transition-colors"
              >
                →
              </Link>
            ) : (
              <span className="text-line">→</span>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-14">
        <header className="border-b border-line pb-10">
          <p className="rail text-muted">
            트러블 슈팅
            <span className="mx-2 text-line">·</span>
            {String(index + 1).padStart(2, "0")}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {challenge.title}
          </h1>
          <p className={`mt-4 max-w-3xl ${leadText}`}>{challenge.summary}</p>
        </header>

        <section className="mt-16">
          <h2 className={sectionTitle}>문제</h2>
          <p className={`mt-6 max-w-3xl whitespace-pre-line ${leadText}`}>
            {challenge.problem}
          </p>
        </section>

        {/* 설계 결정 — 이 페이지의 결론. 좌측선으로 본문에서 한 단계 들어올린다 */}
        <section className="mt-16">
          <h2 className={sectionTitle}>설계 결정</h2>
          <p
            className={`mt-6 max-w-3xl whitespace-pre-line ${accentBlock} ${leadText}`}
          >
            {challenge.decision}
          </p>
        </section>

        {challenge.diagramId && (
          <section className="mt-16">
            <h2 className={sectionTitle}>구조</h2>
            <div className="mt-6 rounded-xl border border-line bg-surface p-3 sm:p-4">
              {challenge.diagramId === "subscription-period" && <SubscriptionPeriodDiagram />}
              {challenge.diagramId === "send-grouping" && <SendGroupingDiagram />}
              {challenge.diagramId === "duplicate-prevention" && <DuplicatePreventionDiagram />}
              {challenge.diagramId === "cafe24-sync" && <Cafe24SyncDiagram />}
              {challenge.diagramId === "pause-design" && <PauseDesignDiagram />}
            </div>
          </section>
        )}

        <section className="mt-16">
          <h2 className={sectionTitle}>구현</h2>
          <div className="mt-8 space-y-8">
            {challenge.steps.map((step, i) => (
              <div key={i} className="border-l-2 border-tide/40 pl-4">
                <p className="flex gap-2.5 text-[0.95rem] leading-relaxed whitespace-pre-line">
                  <span className="rail text-tide shrink-0 pt-0.5">
                    {String(i + 1).padStart(2, "0")}
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
        </section>

        <section className="mt-16">
          <h2 className={sectionTitle}>결과</h2>
          <p className={`mt-6 max-w-3xl whitespace-pre-line ${leadText}`}>
            {challenge.result}
          </p>
        </section>

        {/* 앞뒤 항목 */}
        <div className="mt-16 flex justify-between gap-6 border-t border-line pt-8">
          {prev ? (
            <Link
              href={`/projects/${slug}/challenges/${prev.id}`}
              className="rail inline-flex items-center gap-2 text-muted hover:text-ink transition-colors max-w-[45%]"
            >
              <span aria-hidden="true" className="text-tide">
                ←
              </span>
              <span className="truncate">{prev.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/projects/${slug}/challenges/${next.id}`}
              className="rail inline-flex items-center gap-2 text-muted hover:text-ink transition-colors max-w-[45%]"
            >
              <span className="truncate">{next.title}</span>
              <span aria-hidden="true" className="text-tide">
                →
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}
