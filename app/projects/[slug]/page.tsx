import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, projects } from "@/lib/projects";
import { getLightProject, lightProjects } from "@/lib/projectDetails";
import { actionButton, bullet, card, leadText, sectionTitle, tagChip } from "@/lib/ui";
import ProjectInteractive from "@/components/ProjectInteractive";
import LightProjectView from "@/components/LightProjectView";
import GitHubIcon from "@/components/GitHubIcon";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    ...projects.map((p) => ({ slug: p.slug })),
    ...lightProjects.map((p) => ({ slug: p.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug) ?? getLightProject(slug);
  if (!project) return {};
  return { title: `${project.title} | Portfolio`, description: project.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  // 경량(min-hyuk 스타일) 프로젝트는 별도 뷰로 렌더
  const light = getLightProject(slug);
  if (light) return <LightProjectView project={light} />;

  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-ground">
      {/* 상단바 — 다른 상세 페이지와 같은 한 줄 */}
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
        {/* 헤더 — 메타 → 제목 → 역할 한 줄 → 요약 → 태그 → 링크.
            상태·기간·팀은 배지 대신 제목 위 메타 줄로 모은다 */}
        <header className="border-b border-line pb-10">
          <p className="rail text-muted">
            {project.period}
            <span className="mx-2 text-line">·</span>
            {project.teamSize === 1
              ? "개인 프로젝트"
              : `팀 프로젝트 (${project.teamSize}인)`}
            <span className="mx-2 text-line">·</span>
            {project.status}
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            {project.title}
          </h1>

          {/* 역할 — 다른 상세의 tagline 자리. 스크롤 없이 맡은 범위가 잡히도록 */}
          <p className="rail mt-4 text-muted">내 역할</p>
          <p className="mt-1 max-w-3xl text-lg font-semibold leading-snug text-deep">
            {project.role}
          </p>

          <p className={`mt-4 max-w-3xl ${leadText}`}>{project.summary}</p>

          {/* 외부 링크 — 비공개 저장소는 github 가 빈 문자열이다.
              그대로 렌더하면 href="" 라 현재 페이지가 다시 열린다 */}
          {(project.github || project.demo) && (
            <div className="mt-7 flex flex-wrap gap-2.5">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className={actionButton}
                >
                  <GitHubIcon className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className={`${actionButton} border-tide bg-tide/15`}
                >
                  데모 ↗
                </a>
              )}
            </div>
          )}
        </header>

        {/* 사용 기술 — 헤더 칩으로 올리지 않고 절로 둔다.
            같은 태그를 헤더와 본문에서 두 번 보여주지 않기 위해서다 */}
        <section className="mt-16">
          <h2 className={sectionTitle}>사용 기술</h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className={tagChip}>
                {tag}
              </li>
            ))}
          </ul>
        </section>

        {/* 문제와 해결 — 항목마다 한 장. 문제/해결 라벨은 기능 카드와 같은 색을 쓴다 */}
        <section className="mt-16">
          <h2 className={sectionTitle}>문제와 해결</h2>
          <div className="mt-8 space-y-6">
            {project.problemSolutions.map((item, i) => (
              <div key={item.title} className={card}>
                <h3 className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 leading-snug">
                  <span className="rail text-tide shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </span>
                </h3>

                <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-10">
                  <div>
                    <p className="mb-2 font-semibold text-muted">문제</p>
                    <ul className="space-y-1.5">
                      {item.problem.map((point) => (
                        <li key={point} className={`${bullet} before:bg-muted/50`}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-deep">해결</p>
                    <ul className="space-y-1.5">
                      {item.solution.map((point) => (
                        <li key={point} className={`${bullet} before:bg-tide`}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <ProjectInteractive project={project} />

        {/* 성과 — 박스 대신 불릿. 다른 상세의 마무리 절과 같은 모양 */}
        <section className="mt-16 border-t border-line pt-12">
          <h2 className={sectionTitle}>성과</h2>
          <ul className="mt-6 max-w-3xl space-y-3">
            {project.results.map((result) => (
              <li key={result} className={`${bullet} before:bg-tide`}>
                {result}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
