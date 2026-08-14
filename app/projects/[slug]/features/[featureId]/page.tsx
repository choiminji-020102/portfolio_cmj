import { notFound } from "next/navigation";
import Link from "next/link";
import { getFeature, getChallenge, projects } from "@/lib/projects";
import { accentBlock, leadText, openCard, sectionTitle } from "@/lib/ui";
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
              {index + 1} / {project.features.length}
            </span>
            {prev ? (
              <Link
                href={`/projects/${slug}/features/${prev.id}`}
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
                href={`/projects/${slug}/features/${next.id}`}
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
          <p className="rail text-muted">주요 기능</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            {feature.title}
          </h1>
          <p className={`mt-4 max-w-3xl ${leadText}`}>{feature.summary}</p>
        </header>

        <section className="mt-16">
          <h2 className={sectionTitle}>기능 설명</h2>
          <p className={`mt-6 max-w-3xl whitespace-pre-line ${leadText}`}>
            {feature.description}
          </p>
        </section>

        {feature.screenshots && feature.screenshots.length > 0 && (
          <section className="mt-16">
            <h2 className={sectionTitle}>개선 전 / 후</h2>
            <div className="mt-8 flex flex-col gap-8">
              {["before", "after"].map((type) => {
                const shots = feature.screenshots!.filter((s) => s.type === type);
                if (shots.length === 0) return null;
                return (
                  <div key={type}>
                    <p
                      className={`rail ${
                        type === "before" ? "text-muted" : "text-tide"
                      }`}
                    >
                      {type === "before" ? "개선 전" : "개선 후"}
                    </p>
                    <div
                      className={`mt-3 grid gap-4 ${
                        shots.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                      }`}
                    >
                      {shots.map((s) => (
                        <figure
                          key={s.src}
                          className="overflow-hidden rounded-xl border border-line bg-surface"
                        >
                          {/* 캡처 원본 크기를 모르므로 next/image 대신 그대로 싣는다 */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.src}
                            alt={s.caption}
                            className="w-full object-contain bg-ground"
                          />
                          <figcaption className="rail border-t border-line px-4 py-2.5 text-muted">
                            {s.caption}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 핵심 로직 — 이 기능의 결론. 트러블 슈팅의 '설계 결정'과 같은 모양 */}
        <section className="mt-16">
          <h2 className={sectionTitle}>핵심 로직</h2>
          <p
            className={`mt-6 max-w-3xl whitespace-pre-line ${accentBlock} ${leadText}`}
          >
            {feature.coreLogic}
          </p>
        </section>

        {relatedChallenges.length > 0 && (
          <section className="mt-16">
            {/* '심화' — 이 절이 본문이 아니라 더 깊이 들어가는 갈래임을 밝힌다 */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className={sectionTitle}>관련 트러블 슈팅</h2>
              <span className="rail text-muted">심화</span>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              {relatedChallenges.map(({ challenge, index: ci }) => (
                <Link
                  key={challenge.id}
                  href={`/projects/${slug}/challenges/${challenge.id}`}
                  className={openCard}
                >
                  <div className="flex items-start gap-3">
                    <span className="rail text-tide shrink-0 mt-1">
                      {String(ci + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold tracking-tight group-hover:text-deep transition-colors">
                        {challenge.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {challenge.summary}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="text-tide flex-shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 앞뒤 항목 */}
        <div className="mt-16 flex justify-between gap-6 border-t border-line pt-8">
          {prev ? (
            <Link
              href={`/projects/${slug}/features/${prev.id}`}
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
              href={`/projects/${slug}/features/${next.id}`}
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
