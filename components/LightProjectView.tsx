import Image from "next/image";
import Link from "next/link";
import type { LightProject } from "@/lib/projectDetails";
import ProjectGallery from "./ProjectGallery";
import GitHubIcon from "./GitHubIcon";
import RagDiagram from "./RagDiagram";

export default function LightProjectView({
  project,
}: {
  project: LightProject;
}) {
  return (
    <div className="min-h-screen bg-ground">
      {/* 상단바 */}
      <div className="border-b border-line sticky top-0 z-10 bg-ground/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <Link
            href="/#projects"
            className="rail inline-flex items-center gap-2 text-muted hover:text-ink transition-colors"
          >
            <span aria-hidden="true">←</span> 프로젝트 목록으로
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-14">
        {/* 스크린샷 갤러리 */}
        <ProjectGallery
          screenshots={project.screenshots}
          title={project.title}
          track={project.stack[0] ?? "Project"}
        />

        {/* 헤더 — 제목 + 배지 + 링크 */}
        <div className="mt-10 flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {project.title}
            </h1>
            <span className="rail rounded-full bg-tide/15 border border-tide/30 px-2.5 py-0.5">
              {project.badge}
            </span>
          </div>

          {(project.github || project.homepage) && (
            <div className="flex gap-2.5">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="rail inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 hover:bg-surface transition-colors"
                >
                  <GitHubIcon className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="rail inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 hover:bg-surface transition-colors"
                >
                  {project.homepageLabel ?? "홈페이지"} ↗
                </a>
              )}
            </div>
          )}
        </div>

        <p className="rail mt-3">
          {project.period}
          <span className="mx-2 text-line">·</span>
          {project.teamSize}
        </p>

        <p className="mt-5 text-base leading-relaxed text-muted max-w-2xl">
          {project.summary}
        </p>

        {/* 태그 */}
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <li
              key={item}
              className="rail bg-surface border border-line rounded-md px-2.5 py-1 text-ink/75"
            >
              {item}
            </li>
          ))}
        </ul>

        {/* 제안 배경 */}
        {project.background && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">제안 배경</h2>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-muted">
              {project.background}
            </p>
          </section>
        )}

        {/* 팀 구성 — 본인 역할 강조 */}
        {project.team && project.team.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">팀 구성</h2>
            <ul className="mt-6 space-y-3">
              {project.team.map((member) => (
                <li
                  key={member.name}
                  className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 rounded-xl border p-4 ${
                    member.mine
                      ? "border-tide/40 bg-tide/8"
                      : "border-line bg-surface"
                  }`}
                >
                  <span className="rail text-ink sm:w-32 shrink-0">
                    {member.name}
                    {member.mine && (
                      <span className="ml-1.5 text-tide">●</span>
                    )}
                  </span>
                  <span className="text-[0.95rem]">{member.role}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 핵심 AI 기능 — 문제 → 해결 → 수치 */}
        {project.aiFeatures && project.aiFeatures.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">핵심 AI 기능</h2>
            <div className="mt-8 space-y-6">
              {project.aiFeatures.map((feature) => (
                <div
                  key={feature.name}
                  className="rounded-2xl bg-surface border border-line p-6 sm:p-7"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {feature.name}
                    </h3>
                    {feature.metric && (
                      <span className="rail rounded-full bg-tide/15 border border-tide/30 px-2.5 py-0.5">
                        {feature.metric}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 space-y-6 text-[0.95rem] leading-relaxed">
                    {/* 문제 */}
                    {feature.problemList ? (
                      <div>
                        <p className="font-semibold text-muted mb-2">
                          {feature.problemLabel ?? "문제"}
                        </p>
                        <ul className="space-y-1.5">
                          {feature.problemList.map((p) => (
                            <li
                              key={p}
                              className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-muted/50"
                            >
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      feature.problem && (
                        <p>
                          <span className="font-semibold text-muted">
                            문제&nbsp;&nbsp;
                          </span>
                          {feature.problem}
                        </p>
                      )
                    )}

                    {/* 해결 */}
                    {feature.solutionBlocks ? (
                      <div>
                        <p className="font-semibold text-deep mb-3">
                          {feature.solutionLabel ?? "해결"}
                        </p>
                        <div className="space-y-4">
                          {feature.solutionBlocks.map((block) => (
                            <div
                              key={block.title}
                              className="border-l-2 border-tide/40 pl-4"
                            >
                              <p className="font-semibold">{block.title}</p>
                              <ul className="mt-1.5 space-y-1">
                                {block.points.map((pt) => (
                                  <li
                                    key={pt}
                                    className="relative pl-5 text-muted before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-tide"
                                  >
                                    {pt}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      feature.solution && (
                        <p>
                          <span className="font-semibold text-deep">
                            해결&nbsp;&nbsp;
                          </span>
                          {feature.solution}
                        </p>
                      )
                    )}
                  </div>

                  {/* 앱 화면 데모 */}
                  {feature.image && (
                    <div className="mt-7 rounded-xl bg-ground/60 border border-line p-4 sm:p-6">
                      <Image
                        src={feature.image}
                        alt={`${feature.name} 화면`}
                        width={814}
                        height={858}
                        className="w-full max-w-md mx-auto h-auto"
                      />
                    </div>
                  )}

                  {/* 구조 다이어그램 */}
                  {feature.diagram === "rag" && (
                    <div className="mt-5 rounded-xl bg-ground/60 border border-line p-6">
                      <RagDiagram />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 주요 기능 개발 */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">그 외 기능</h2>
          <ul className="mt-6 space-y-3">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="relative pl-5 text-[0.95rem] leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-deep"
              >
                {feature}
              </li>
            ))}
          </ul>
        </section>

        {/* 차별성 */}
        {project.differentiators && project.differentiators.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              기존 서비스와의 차별성
            </h2>
            <ul className="mt-6 space-y-3">
              {project.differentiators.map((item) => (
                <li
                  key={item}
                  className="relative pl-5 text-[0.95rem] leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-tide"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 활용 데이터 */}
        {project.dataSources && project.dataSources.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">활용 데이터</h2>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {project.dataSources.map((item) => (
                <li
                  key={item}
                  className="rounded-xl bg-surface border border-line p-4 text-sm leading-relaxed"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 트러블슈팅 */}
        {project.troubles && project.troubles.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              트러블 슈팅 경험
            </h2>
            <div className="mt-8 space-y-12">
              {project.troubles.map((trouble) => (
                <div key={trouble.title}>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {trouble.title}
                  </h3>
                  {trouble.image && (
                    <div className="relative aspect-[16/9] mt-5 rounded-2xl overflow-hidden border border-line bg-surface">
                      <Image
                        src={trouble.image}
                        alt={trouble.title}
                        fill
                        sizes="768px"
                        className="object-contain"
                      />
                    </div>
                  )}
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">
                    {trouble.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
