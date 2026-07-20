"use client";
import { useState } from "react";
import type { Project } from "@/lib/projects";
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
      {/* Key Features */}
      <div className="mb-12">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">Key Features</h2>
        <div className="flex flex-col gap-3">
          {project.features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setView({ type: "feature", id: feature.id })}
              className="group border border-stone-200 rounded-2xl p-5 hover:border-amber-300 hover:bg-amber-50/40 transition-all duration-200 text-left w-full"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-900 mb-1 group-hover:text-amber-600 transition-colors text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{feature.summary}</p>
                </div>
                <span className="text-stone-300 group-hover:text-amber-400 transition-colors flex-shrink-0 mt-0.5">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Challenges & Solutions */}
      {project.challenges.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">Challenges & Solutions</h2>
          <div className="flex flex-col gap-3">
            {project.challenges.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setView({ type: "challenge", id: c.id })}
                className="group border border-stone-200 rounded-2xl p-5 hover:border-amber-300 hover:bg-amber-50/40 transition-all duration-200 text-left w-full"
              >
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-stone-900 mb-1 group-hover:text-amber-600 transition-colors text-sm">
                      {c.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{c.summary}</p>
                  </div>
                  <span className="text-stone-300 group-hover:text-amber-400 transition-colors flex-shrink-0 mt-0.5">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
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
