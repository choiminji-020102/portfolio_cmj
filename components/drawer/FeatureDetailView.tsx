import type { Project } from "@/lib/projects";
import { openCard } from "@/lib/ui";

interface Props {
  project: Project;
  featureId: string;
  onNavigate: (id: string) => void;
  onSelectChallenge: (id: string) => void;
}

/* 위계 값은 ChallengeDetailView 와 같다 — 두 서랍이 같은 문서로 읽혀야 한다 */
const drawerSection = "text-[0.95rem] font-bold tracking-tight text-deep";
const drawerBody = "text-[0.9rem] leading-relaxed text-ink whitespace-pre-line";
const navLink =
  "rail inline-flex items-center gap-2 text-muted hover:text-ink transition-colors max-w-[45%]";

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
      <div className="rail flex items-center justify-end gap-3">
        <span>
          {index + 1} / {project.features.length}
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
        <p className="rail text-muted">주요 기능</p>
        <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight">
          {feature.title}
        </h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
          {feature.summary}
        </p>
      </div>

      {/* 개선 전/후 스크린샷 */}
      {feature.screenshots && feature.screenshots.length > 0 && (
        <div className="mt-8">
          <h3 className={drawerSection}>개선 전 / 후</h3>
          <div className="mt-4 flex flex-col gap-6">
            {(["before", "after"] as const).map((type) => {
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
                      shots.length > 1 ? "grid-cols-2" : "grid-cols-1"
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
        </div>
      )}

      {/* 기능 설명 */}
      <div className="mt-8">
        <h3 className={drawerSection}>기능 설명</h3>
        <p className={`mt-3 ${drawerBody}`}>{feature.description}</p>
      </div>

      {/* 핵심 로직 — 이 기능의 결론 */}
      <div className="mt-8">
        <h3 className={drawerSection}>핵심 로직</h3>
        <p className={`mt-3 border-l-2 border-tide/60 pl-4 ${drawerBody}`}>
          {feature.coreLogic}
        </p>
      </div>

      {/* 관련 트러블 슈팅 */}
      {relatedChallenges.length > 0 && (
        <div className="mt-8">
          {/* '심화' — 이 절이 본문이 아니라 더 깊이 들어가는 갈래임을 밝힌다 */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className={drawerSection}>관련 트러블 슈팅</h3>
            <span className="rail text-muted">심화</span>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {relatedChallenges.map(({ challenge, index: ci }) => (
              <button
                key={challenge.id}
                onClick={() => onSelectChallenge(challenge.id)}
                className={openCard}
              >
                <div className="flex items-start gap-3">
                  <span className="rail text-tide shrink-0 mt-1">
                    {String(ci + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold tracking-tight group-hover:text-deep transition-colors">
                      {challenge.title}
                    </h4>
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
              </button>
            ))}
          </div>
        </div>
      )}

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
