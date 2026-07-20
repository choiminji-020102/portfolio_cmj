import { notFound } from "next/navigation";
import Link from "next/link";
import { getFeature, getChallenge, projects } from "@/lib/projects";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; featureId: string }>;
}

export async function generateStaticParams() {
  return projects.flatMap((p) =>
    p.features.map((f) => ({ slug: p.slug, featureId: f.id }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, featureId } = await params;
  const result = getFeature(slug, featureId);
  if (!result) return {};
  return {
    title: `${result.feature.title} | ${result.project.title}`,
    description: result.feature.summary,
  };
}

export default async function FeaturePage({ params }: Props) {
  const { slug, featureId } = await params;
  const result = getFeature(slug, featureId);
  if (!result) notFound();

  const { feature, project, index, prev, next } = result;

  const relatedChallenges = feature.relatedChallengeIds
    .map((id) => getChallenge(slug, id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getChallenge>>[];

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
              {index + 1} / {project.features.length}
            </span>
            {prev ? (
              <Link
                href={`/projects/${slug}/features/${prev.id}`}
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
                href={`/projects/${slug}/features/${next.id}`}
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
            <span className="text-xs text-stone-400 font-medium uppercase tracking-widest">Feature</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 leading-tight mb-4 tracking-tight">
            {feature.title}
          </h1>
          <p className="text-stone-500 leading-relaxed">{feature.summary}</p>
        </div>

        {/* Description */}
        <div className="mb-7">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">기능 설명</h2>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{feature.description}</p>
          </div>
        </div>

        {/* Screenshots */}
        {feature.screenshots && feature.screenshots.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">개선 전 / 후</h2>
            <div className="flex flex-col gap-6">
              {["before", "after"].map((type) => {
                const shots = feature.screenshots!.filter((s) => s.type === type);
                if (shots.length === 0) return null;
                return (
                  <div key={type}>
                    <p className={`text-xs font-semibold mb-3 ${type === "before" ? "text-stone-400" : "text-amber-600"}`}>
                      {type === "before" ? "개선 전" : "개선 후"}
                    </p>
                    <div className={`grid gap-4 ${shots.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
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

        {/* Core Logic */}
        <div className="mb-10">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">핵심 로직</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">{feature.coreLogic}</p>
          </div>
        </div>

        {/* Related Challenges */}
        {relatedChallenges.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest">관련 기술적 챌린지</h2>
              <div className="h-px flex-1 bg-stone-200" />
              <span className="text-xs text-stone-400">심화</span>
            </div>
            <div className="flex flex-col gap-3">
              {relatedChallenges.map(({ challenge, index: ci }) => (
                <Link
                  key={challenge.id}
                  href={`/projects/${slug}/challenges/${challenge.id}`}
                  className="group border border-stone-200 rounded-2xl p-5 hover:border-amber-300 hover:bg-amber-50/40 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                      {ci + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-stone-900 mb-1 group-hover:text-amber-600 transition-colors text-sm">
                        {challenge.title}
                      </h3>
                      <p className="text-stone-500 text-sm leading-relaxed">{challenge.summary}</p>
                    </div>
                    <span className="text-stone-300 group-hover:text-amber-400 transition-colors flex-shrink-0 mt-0.5">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom navigation */}
        <div className="flex justify-between pt-8 border-t border-stone-200">
          {prev ? (
            <Link
              href={`/projects/${slug}/features/${prev.id}`}
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
              href={`/projects/${slug}/features/${next.id}`}
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
