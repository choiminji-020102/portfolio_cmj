import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, projects } from "@/lib/projects";
import { getLightProject, lightProjects } from "@/lib/projectDetails";
import { actionButton, bullet, card, leadText, sectionTitle, tagChip } from "@/lib/ui";
import LightProjectView from "@/components/LightProjectView";
import ProjectFeatureCard from "@/components/ProjectFeatureCard";
import ChallengeSection from "@/components/ChallengeSection";
import GitHubIcon from "@/components/GitHubIcon";
import type { Metadata } from "next";

/* 문제·해결 본문 — 산문이면 빈 줄로 문단을 나누고, 불릿 배열이면 그대로 점을 찍는다 */
function ProblemSolutionBody({ value }: { value: string | string[] }) {
  if (Array.isArray(value)) {
    return (
      <ul className="space-y-1.5">
        {value.map((point) => (
          <li key={point} className={`${bullet} before:bg-tide`}>
            {point}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div className="space-y-3.5">
      {value.split("\n\n").map((para) => (
        <p key={para} className="text-[0.95rem] leading-relaxed">
          {para}
        </p>
      ))}
    </div>
  );
}

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
        {/* 헤더 — 메타 → 제목 → 한 줄 요약 → 요약 → 태그 → 링크.
            다른 상세(LightProjectView)와 같은 순서·같은 자리를 쓴다 */}
        <header className="border-b border-line pb-10">
          <p className="rail text-muted">
            {project.period}
            <span className="mx-2 text-line">·</span>
            {project.teamSize}
            <span className="mx-2 text-line">·</span>
            {project.status}
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            {project.title}
          </h1>

          {/* 한 줄 요약 — 스크롤하지 않고도 역할이 파악되도록 제목에 바로 붙인다 */}
          <p className="mt-3 max-w-3xl text-lg font-semibold leading-snug text-deep">
            {project.tagline}
          </p>

          <p className={`mt-4 max-w-3xl ${leadText}`}>{project.summary}</p>

          {/* 태그 */}
          <ul className="mt-7 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className={tagChip}>
                {tag}
              </li>
            ))}
          </ul>

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
                  <span aria-hidden="true">▶</span>
                  시연 영상
                </a>
              )}
            </div>
          )}
        </header>

        {/* 성과 — 세부(문제·기능·트러블)보다 먼저 읽히도록 헤더 바로 아래 둔다 */}
        <section className="mt-16">
          <h2 className={sectionTitle}>성과</h2>
          <ul className="mt-6 max-w-3xl space-y-3">
            {project.results.map((result) => (
              <li key={result} className={`${bullet} before:bg-tide`}>
                {result}
              </li>
            ))}
          </ul>
        </section>

        {/* 담당 범위 — 다른 상세의 '내가 맡은 역할' 절과 같은 자리·같은 구성 */}
        <section className="mt-16">
          <h2 className={sectionTitle}>담당 범위</h2>
          <p className={`mt-6 max-w-3xl ${leadText}`}>{project.role}</p>

          <div className="mt-8">
            <p className="rail text-muted">작업 범위 · 전 과정</p>
            <div className="mt-3 flex flex-wrap items-center gap-y-2 text-[0.95rem]">
              {project.rolePipeline.map((step, i) => (
                <span key={step} className="inline-flex items-center">
                  {i > 0 && (
                    <span aria-hidden="true" className="mx-2 text-tide">
                      →
                    </span>
                  )}
                  <span className="rounded-md border border-line bg-surface px-3 py-1 text-ink">
                    {step}
                  </span>
                </span>
              ))}
            </div>
          </div>
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

                {typeof item.problem === "string" ||
                typeof item.solution === "string" ? (
                  /* 산문 항목 — 좌우로 나누면 분량이 어긋나므로 전체 폭에 세로로 편다 */
                  <div className="mt-6 grid max-w-[52em] gap-y-7 sm:grid-cols-[3.25rem_1fr] sm:gap-x-7">
                    <p className="rail pt-[0.35em] sm:text-right">문제</p>
                    <ProblemSolutionBody value={item.problem} />

                    <p className="rail pt-[0.35em] sm:text-right">해결</p>
                    <ProblemSolutionBody value={item.solution} />

                    {item.result && (
                      <>
                        <p className="rail pt-[0.35em] font-semibold sm:text-right">
                          결과
                        </p>
                        <ProblemSolutionBody value={item.result} />
                      </>
                    )}
                  </div>
                ) : (
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
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 주요 기능 — 카드로 펼친다 */}
        <section className="mt-16">
          <h2 className={sectionTitle}>주요 기능</h2>
          <div className="mt-8 space-y-6">
            {project.features.map((feature) => (
              <ProjectFeatureCard
                key={feature.id}
                feature={feature}
                project={project}
              />
            ))}
          </div>
        </section>

        <ChallengeSection project={project} />
      </main>
    </div>
  );
}
