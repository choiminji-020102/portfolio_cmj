"use client";

import type { Feature, Project } from "@/lib/projects";
import { card } from "@/lib/ui";

/*
  기능 카드 — 본문에 펼쳐 보여준다.
  예전에는 목록을 눌러 서랍을 열어야 내용을 볼 수 있었는데, 기능 7개를 합쳐도
  3천 자 남짓이라 굳이 감출 이유가 없다. 반대로 트러블 슈팅은 코드·다이어그램까지
  합쳐 1만 자가 넘어 지금처럼 눌러서 여는 쪽을 유지한다.

  다른 프로젝트의 FeatureCard(AiFeature 용)와 같은 시각 언어를 쓰되,
  필드 구성이 달라(설명·핵심 로직·개선 전후) 별도로 둔다.
*/
export default function ProjectFeatureCard({
  feature,
  project,
  onSelectChallenge,
}: {
  feature: Feature;
  project: Project;
  onSelectChallenge: (id: string) => void;
}) {
  const related = feature.relatedChallengeIds
    .map((id) => {
      const i = project.challenges.findIndex((c) => c.id === id);
      return i >= 0 ? { challenge: project.challenges[i], index: i } : null;
    })
    .filter(Boolean) as { challenge: Project["challenges"][0]; index: number }[];

  const shots = (type: "before" | "after") =>
    feature.screenshots?.filter((s) => s.type === type) ?? [];

  return (
    <div className={card}>
      <h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        {feature.summary}
      </p>

      <div className="mt-5">
        <p className="rail text-muted">기능 설명</p>
        <p className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* 핵심 로직 — 이 기능의 결론. 트러블 슈팅의 '설계 결정'과 같은 표시 */}
      <div className="mt-5">
        <p className="rail text-muted">핵심 로직</p>
        <p className="mt-2 whitespace-pre-line border-l-2 border-tide/40 pl-4 text-[0.95rem] leading-relaxed">
          {feature.coreLogic}
        </p>
      </div>

      {feature.screenshots && feature.screenshots.length > 0 && (
        <div className="mt-6">
          <p className="rail text-muted">개선 전 / 후</p>
          <div className="mt-3 flex flex-col gap-5">
            {(["before", "after"] as const).map((type) => {
              const list = shots(type);
              if (list.length === 0) return null;
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
                    className={`mt-2 grid gap-4 ${
                      list.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                    }`}
                  >
                    {list.map((s) => (
                      <figure
                        key={s.src}
                        className="overflow-hidden rounded-xl border border-line bg-ground/60"
                      >
                        {/* 캡처 원본 크기를 모르므로 next/image 대신 그대로 싣는다 */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.src}
                          alt={s.caption}
                          className="w-full object-contain"
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

      {/* 이 기능에서 갈라져 나오는 트러블 슈팅 — 아래 목록의 같은 항목을 연다 */}
      {related.length > 0 && (
        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-t border-line pt-4">
          <span className="rail shrink-0 text-muted">관련 트러블 슈팅</span>
          {/* '심화' — 본문이 아니라 더 깊이 들어가는 갈래임을 밝힌다 */}
          <span className="rail order-last ml-auto shrink-0 text-muted">
            심화
          </span>
          {related.map(({ challenge, index }) => (
            <button
              key={challenge.id}
              type="button"
              onClick={() => onSelectChallenge(challenge.id)}
              className="rail inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-deep transition-colors hover:border-tide hover:bg-tide/10"
            >
              <span className="text-tide">
                {String(index + 1).padStart(2, "0")}
              </span>
              {challenge.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
