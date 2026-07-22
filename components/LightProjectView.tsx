import Image from "next/image";
import Link from "next/link";
import type { LightProject } from "@/lib/projectDetails";
import ProjectGallery from "./ProjectGallery";

export default function LightProjectView({
  project,
}: {
  project: LightProject;
}) {
  return (
    <div className="min-h-screen bg-ground">
      {/* 상단바 */}
      <div className="border-b border-line sticky top-0 z-10 bg-ground/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center">
          <Link
            href="/#projects"
            className="rail inline-flex items-center gap-2 text-muted hover:text-ink transition-colors"
          >
            <span aria-hidden="true">←</span> 프로젝트 목록으로
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 sm:py-14">
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
                  GitHub ↗
                </a>
              )}
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className="rail inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 hover:bg-surface transition-colors"
                >
                  홈페이지 ↗
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

        {/* 주요 기능 개발 */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">주요 기능 개발</h2>
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
