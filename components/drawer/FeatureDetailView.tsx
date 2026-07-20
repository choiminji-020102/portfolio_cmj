import type { Project } from "@/lib/projects";

interface Props {
  project: Project;
  featureId: string;
  onNavigate: (id: string) => void;
  onSelectChallenge: (id: string) => void;
}

export default function FeatureDetailView({ project, featureId, onNavigate, onSelectChallenge }: Props) {
  const index = project.features.findIndex((f) => f.id === featureId);
  const feature = project.features[index];
  const prev = index > 0 ? project.features[index - 1] : null;
  const next = index < project.features.length - 1 ? project.features[index + 1] : null;

  const relatedChallenges = feature.relatedChallengeIds
    .map((id) => {
      const ci = project.challenges.findIndex((c) => c.id === id);
      return ci >= 0 ? { challenge: project.challenges[ci], index: ci } : null;
    })
    .filter(Boolean) as { challenge: Project["challenges"][0]; index: number }[];

  if (!feature) return null;

  return (
    <div className="px-8 py-10">
      {/* 상단 내비게이션 */}
      <div className="flex items-center justify-end mb-8">
        <div className="flex items-center gap-1">
          <span className="text-xs text-stone-400 mr-2">
            {index + 1} / {project.features.length}
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
        <div className="mb-4">
          <span className="text-xs text-stone-400 font-medium uppercase tracking-widest">Feature</span>
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900 leading-tight mb-3 tracking-tight">
          {feature.title}
        </h2>
        <p className="text-stone-500 leading-relaxed">{feature.summary}</p>
      </div>

      {/* 개선 전/후 스크린샷 */}
      {feature.screenshots && feature.screenshots.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">개선 전 / 후</h3>
          <div className="flex flex-col gap-6">
            {(["before", "after"] as const).map((type) => {
              const shots = feature.screenshots!.filter((s) => s.type === type);
              if (shots.length === 0) return null;
              return (
                <div key={type}>
                  <p className={`text-xs font-semibold mb-3 ${type === "before" ? "text-stone-400" : "text-amber-600"}`}>
                    {type === "before" ? "개선 전" : "개선 후"}
                  </p>
                  <div className={`grid gap-4 ${shots.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {shots.map((s) => (
                      <figure key={s.src} className="border border-stone-200 rounded-2xl overflow-hidden">
                        <img src={s.src} alt={s.caption} className="w-full object-contain bg-stone-50" />
                        <figcaption className="px-4 py-2.5 text-xs text-stone-500 border-t border-stone-100 bg-white">
                          {s.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 기능 설명 */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">기능 설명</h3>
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
          <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{feature.description}</p>
        </div>
      </div>

      {/* 핵심 로직 */}
      <div className="mb-10">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">핵심 로직</h3>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{feature.coreLogic}</p>
        </div>
      </div>

      {/* 관련 챌린지 */}
      {relatedChallenges.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">관련 기술적 챌린지</h3>
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-xs text-stone-400">심화</span>
          </div>
          <div className="flex flex-col gap-2">
            {relatedChallenges.map(({ challenge, index: ci }) => (
              <button
                key={challenge.id}
                onClick={() => onSelectChallenge(challenge.id)}
                className="group border border-stone-200 rounded-2xl p-5 hover:border-amber-300 hover:bg-amber-50/40 transition-all duration-200 text-left w-full"
              >
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                    {ci + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-stone-900 mb-1 group-hover:text-amber-600 transition-colors text-sm">
                      {challenge.title}
                    </h4>
                    <p className="text-stone-500 text-sm leading-relaxed">{challenge.summary}</p>
                  </div>
                  <span className="text-stone-300 group-hover:text-amber-400 transition-colors flex-shrink-0 mt-0.5">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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
