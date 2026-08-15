"use client";
import { useState } from "react";
import type { Project } from "@/lib/projects";
import { openCard, sectionTitle } from "@/lib/ui";
import DrawerShell from "./drawer/DrawerShell";
import ChallengeDetailView from "./drawer/ChallengeDetailView";
import ProjectFeatureCard from "./ProjectFeatureCard";

interface Props {
  project: Project;
}

export default function ProjectInteractive({ project }: Props) {
  /* 서랍은 트러블 슈팅 전용이다 — 기능은 본문에 펼쳐 두었다 */
  const [openId, setOpenId] = useState<string | null>(null);

  const close = () => setOpenId(null);

  return (
    <>
      {/* 주요 기능 — 눌러서 여는 목록이 아니라 카드로 펼친다 */}
      <section className="mt-16">
        <h2 className={sectionTitle}>주요 기능</h2>
        <div className="mt-8 space-y-6">
          {project.features.map((feature) => (
            <ProjectFeatureCard
              key={feature.id}
              feature={feature}
              project={project}
              onSelectChallenge={setOpenId}
            />
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
                onClick={() => setOpenId(c.id)}
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
      <DrawerShell open={openId !== null} onClose={close} viewKey={openId ?? ""}>
        {openId && (
          <ChallengeDetailView
            project={project}
            challengeId={openId}
            onNavigate={setOpenId}
          />
        )}
      </DrawerShell>
    </>
  );
}
