import Image from "next/image";
import Link from "next/link";
import type { LightProject } from "@/lib/projectDetails";
import ProjectGallery from "./ProjectGallery";
import GitHubIcon from "./GitHubIcon";
import RagDiagram from "./RagDiagram";
import RouteDiagram from "./RouteDiagram";

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

        {/* 내가 맡은 역할 */}
        {project.myRole && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">내가 맡은 역할</h2>
            <div className="mt-6 rounded-xl border border-tide/40 bg-tide/8 p-5 sm:p-6">
              <p className="text-[0.95rem] leading-relaxed">{project.myRole}</p>
            </div>
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
                  {feature.tagline && (
                    <p className="mt-1.5 text-sm text-muted">{feature.tagline}</p>
                  )}
                  <div className="mt-5 grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-start">
                    {/* 왼쪽 — 문제/해결 글 */}
                    <div className="space-y-6 text-[0.95rem] leading-relaxed">
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

                    {/* 오른쪽 — 시연 영상 (없으면 사진). 박스를 영상 폭에 맞춤 */}
                    {feature.video ? (
                      <div className="mx-auto lg:ml-auto lg:mr-0 w-fit rounded-xl bg-ground/60 border border-line p-3">
                        <video
                          src={feature.video}
                          poster={feature.image}
                          muted
                          loop
                          autoPlay
                          playsInline
                          controls
                          className="w-[240px] h-auto rounded-lg"
                        />
                      </div>
                    ) : (
                      feature.image && (
                        <div className="mx-auto lg:ml-auto lg:mr-0 w-fit rounded-xl bg-ground/60 border border-line p-3">
                          <Image
                            src={feature.image}
                            alt={`${feature.name} 화면`}
                            width={480}
                            height={506}
                            className="w-[240px] h-auto"
                          />
                        </div>
                      )
                    )}
                  </div>

                  {/* 구조 다이어그램 — 아래 풀폭 (챗봇) */}
                  {feature.diagram === "rag" && (
                    <div className="mt-6 rounded-xl bg-ground/60 border border-line p-4 sm:p-6">
                      <RagDiagram />
                    </div>
                  )}

                  {/* 트러블슈팅 · 기술적 의사결정 — 구분선으로 나눈 세로 흐름 */}
                  {feature.troubles && feature.troubles.length > 0 && (
                    <div className="mt-10 border-t-2 border-tide/30 pt-6">
                      <p className="font-semibold text-deep mb-1">
                        트러블슈팅 · 기술적 의사결정
                      </p>
                      <div className="divide-y divide-line">
                        {feature.troubles.map((trouble, ti) => (
                          <div key={trouble.title} className="py-6">
                            <h4 className="flex flex-wrap gap-x-2.5 gap-y-1 items-baseline leading-snug">
                              <span className="rail text-tide shrink-0">
                                {String(ti + 1).padStart(2, "0")}
                              </span>
                              <span className="font-semibold">
                                {trouble.title}
                              </span>
                              {trouble.stars && (
                                <span className="text-tide text-xs tracking-tight">
                                  {"★".repeat(trouble.stars)}
                                </span>
                              )}
                            </h4>

                            <dl className="mt-3 pl-8 space-y-2 text-[0.9rem] leading-relaxed">
                              {[
                                ["문제", trouble.problem, "text-muted"],
                                ["해결", trouble.solution, "text-deep"],
                                ["효과", trouble.effect, "text-tide"],
                              ].map(([label, text, color]) => (
                                <div key={label} className="flex gap-2.5">
                                  <dt
                                    className={`rail shrink-0 w-8 font-semibold ${color}`}
                                  >
                                    {label}
                                  </dt>
                                  <dd className="text-ink/85">{text}</dd>
                                </div>
                              ))}
                            </dl>

                            {trouble.diagram === "route" && (
                              <div className="mt-5 pl-8">
                                <RouteDiagram />
                              </div>
                            )}

                            {trouble.tags && trouble.tags.length > 0 && (
                              <ul className="mt-3 pl-8 flex flex-wrap gap-1.5">
                                {trouble.tags.map((tag) => (
                                  <li
                                    key={tag}
                                    className="rail rounded-md bg-ground border border-line px-2 py-0.5 text-muted"
                                  >
                                    #{tag}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
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
