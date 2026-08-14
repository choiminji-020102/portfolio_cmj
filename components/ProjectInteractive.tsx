"use client";
import { useState } from "react";
import type { Project } from "@/lib/projects";
import { openCard, sectionTitle } from "@/lib/ui";
import DrawerShell from "./drawer/DrawerShell";
import ChallengeDetailView from "./drawer/ChallengeDetailView";
import FeatureDetailView from "./drawer/FeatureDetailView";

type DrawerView =
  | { type: "challenge"; id: string }
  | { type: "feature"; id: string };

interface Props {
  project: Project;
}

export default function ProjectInteractive({ project }: Props) {
  const [view, setView] = useState<DrawerView | null>(null);

  const close = () => setView(null);

  const viewKey = view ? `${view.type}-${view.id}` : "";

  return (
    <>
      {/* 주요 기능 — 카드를 누르면 우측 패널에서 상세가 열린다 */}
      <section className="mt-16">
        <h2 className={sectionTitle}>주요 기능</h2>
        <div className="mt-8 flex flex-col gap-3">
          {project.features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setView({ type: "feature", id: feature.id })}
              className={openCard}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold tracking-tight group-hover:text-deep transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {feature.summary}
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
      </section>

      {/* 트러블 슈팅 — 번호는 기능 카드 안의 트러블 목록과 같은 표기를 쓴다 */}
      {project.challenges.length > 0 && (
        <section className="mt-16">
          <h2 className={sectionTitle}>트러블 슈팅</h2>
          <div className="mt-8 flex flex-col gap-3">
            {project.challenges.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setView({ type: "challenge", id: c.id })}
                className={openCard}
              >
                <div className="flex items-start gap-3">
                  <span className="rail text-tide shrink-0 mt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold tracking-tight group-hover:text-deep transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {c.summary}
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
        </section>
      )}

      {/* 우측 슬라이딩 패널 */}
      <DrawerShell open={view !== null} onClose={close} viewKey={viewKey}>
        {view?.type === "challenge" && (
          <ChallengeDetailView
            project={project}
            challengeId={view.id}
            onNavigate={(id) => setView({ type: "challenge", id })}
          />
        )}
        {view?.type === "feature" && (
          <FeatureDetailView
            project={project}
            featureId={view.id}
            onNavigate={(id) => setView({ type: "feature", id })}
            onSelectChallenge={(id) => setView({ type: "challenge", id })}
          />
        )}
      </DrawerShell>
    </>
  );
}
