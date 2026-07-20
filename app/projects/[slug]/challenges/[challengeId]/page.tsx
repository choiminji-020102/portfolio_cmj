import { notFound } from "next/navigation";
import Link from "next/link";
import { getChallenge, projects } from "@/lib/projects";
import SubscriptionPeriodDiagram from "@/components/diagrams/SubscriptionPeriodDiagram";
import SendGroupingDiagram from "@/components/diagrams/SendGroupingDiagram";
import DuplicatePreventionDiagram from "@/components/diagrams/DuplicatePreventionDiagram";
import Cafe24SyncDiagram from "@/components/diagrams/Cafe24SyncDiagram";
import PauseDesignDiagram from "@/components/diagrams/PauseDesignDiagram";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; challengeId: string }>;
}

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
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-stone-200 sticky top-0 z-10 bg-white/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href={`/projects/${slug}`}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {project.title}
          </Link>

          <div className="flex items-center gap-1">
            <span className="text-xs text-stone-400 mr-2">
              {index + 1} / {project.challenges.length}
            </span>
            {prev ? (
              <Link
                href={`/projects/${slug}/challenges/${prev.id}`}
                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                title={prev.title}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            ) : (
              <span className="p-1.5 text-stone-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
            )}
            {next ? (
              <Link
                href={`/projects/${slug}/challenges/${next.id}`}
                className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                title={next.title}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <span className="p-1.5 text-stone-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
              {index + 1}
            </span>
            <span className="text-xs text-stone-400 font-medium uppercase tracking-widest">Challenge</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 leading-tight mb-4 tracking-tight">
            {challenge.title}
          </h1>
          <p className="text-stone-500 leading-relaxed">{challenge.summary}</p>
        </div>

        {/* Problem */}
        <div className="mb-7">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Problem</h2>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{challenge.problem}</p>
          </div>
        </div>

        {/* Design Decision */}
        <div className="mb-7">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Design Decision</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{challenge.decision}</p>
          </div>
        </div>

        {/* Diagram */}
        {challenge.diagramId && (
          <div className="mb-7">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Diagram</h2>
            <div className="border border-stone-200 rounded-2xl p-6 bg-white">
              {challenge.diagramId === "subscription-period" && <SubscriptionPeriodDiagram />}
              {challenge.diagramId === "send-grouping" && <SendGroupingDiagram />}
              {challenge.diagramId === "duplicate-prevention" && <DuplicatePreventionDiagram />}
              {challenge.diagramId === "cafe24-sync" && <Cafe24SyncDiagram />}
              {challenge.diagramId === "pause-design" && <PauseDesignDiagram />}
            </div>
          </div>
        )}

        {/* Implementation */}
        <div className="mb-7">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Implementation</h2>
          <div className="flex flex-col gap-4">
            {challenge.steps.map((step, i) => (
              <div key={i} className="border border-stone-200 rounded-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{step.description}</p>
                  </div>
                </div>
                {step.code && (
                  <div className="border-t border-stone-200">
                    <div className="flex items-center px-5 py-2 bg-stone-100 border-b border-stone-200">
                      <span className="text-xs font-mono text-stone-400">{step.code.language}</span>
                    </div>
                    <pre className="bg-stone-900 text-stone-100 p-5 text-xs leading-relaxed overflow-x-auto font-mono">
                      <code>{step.code.content}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="mb-12">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Result</h2>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{challenge.result}</p>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex justify-between pt-8 border-t border-stone-200">
          {prev ? (
            <Link
              href={`/projects/${slug}/challenges/${prev.id}`}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 font-medium transition-colors max-w-[45%]"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="truncate">{prev.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/projects/${slug}/challenges/${next.id}`}
              className="flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 font-medium transition-colors max-w-[45%] text-right"
            >
              <span className="truncate">{next.title}</span>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}
