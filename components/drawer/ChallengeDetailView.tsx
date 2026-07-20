import type { Project } from "@/lib/projects";
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

export default function ChallengeDetailView({ project, challengeId, onNavigate }: Props) {
  const index = project.challenges.findIndex((c) => c.id === challengeId);
  const challenge = project.challenges[index];
  const prev = index > 0 ? project.challenges[index - 1] : null;
  const next = index < project.challenges.length - 1 ? project.challenges[index + 1] : null;

  if (!challenge) return null;

  return (
    <div className="px-8 py-10">
      {/* 상단 내비게이션 */}
      <div className="flex items-center justify-end mb-8">
        <div className="flex items-center gap-1">
          <span className="text-xs text-stone-400 mr-2">
            {index + 1} / {project.challenges.length}
          </span>
          {prev ? (
            <button
              onClick={() => onNavigate(prev.id)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title={prev.title}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <span className="p-1.5 text-stone-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          )}
          {next ? (
            <button
              onClick={() => onNavigate(next.id)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title={next.title}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <span className="p-1.5 text-stone-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* 헤더 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
            {index + 1}
          </span>
          <span className="text-xs text-stone-400 font-medium uppercase tracking-widest">Challenge</span>
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900 leading-tight mb-3 tracking-tight">
          {challenge.title}
        </h2>
        <p className="text-stone-500 leading-relaxed">{challenge.summary}</p>
      </div>

      {/* Problem */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Problem</h3>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
          <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{challenge.problem}</p>
        </div>
      </div>

      {/* Design Decision */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Design Decision</h3>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{challenge.decision}</p>
        </div>
      </div>

      {/* Diagram */}
      {challenge.diagramId && (
        <div className="mb-6">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Diagram</h3>
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
      <div className="mb-6">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Implementation</h3>
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
      <div className="mb-10">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Result</h3>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
          <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{challenge.result}</p>
        </div>
      </div>

      {/* 하단 내비게이션 */}
      <div className="flex justify-between pt-8 border-t border-stone-200">
        {prev ? (
          <button
            onClick={() => onNavigate(prev.id)}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 font-medium transition-colors max-w-[45%]"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="truncate">{prev.title}</span>
          </button>
        ) : <div />}
        {next ? (
          <button
            onClick={() => onNavigate(next.id)}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 font-medium transition-colors max-w-[45%] text-right"
          >
            <span className="truncate">{next.title}</span>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : <div />}
      </div>
    </div>
  );
}
