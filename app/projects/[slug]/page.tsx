import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, projects } from "@/lib/projects";
import { getLightProject, lightProjects } from "@/lib/projectDetails";
import ProjectInteractive from "@/components/ProjectInteractive";
import LightProjectView from "@/components/LightProjectView";
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

const statusColor: Record<string, string> = {
  "완료": "bg-stone-100 text-stone-600 border-stone-200",
  "진행 중": "bg-amber-50 text-amber-700 border-amber-200",
  "유지보수": "bg-stone-100 text-stone-600 border-stone-200",
};

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
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
      {/* Top bar */}
      <div className="border-b border-stone-200 sticky top-0 z-10 bg-ground/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/#projects"
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            포트폴리오로 돌아가기
          </Link>
          <div className="flex gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 font-medium transition-colors"
            >
              <GitHubIcon />
              GitHub
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Demo
                <ExternalIcon />
              </a>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-14">

        {/* Hero */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${statusColor[project.status]}`}>
              {project.status}
            </span>
            <span className="text-xs text-stone-400 font-medium">{project.period}</span>
            <span className="text-xs text-stone-300">·</span>
            <span className="text-xs text-stone-400 font-medium">
              {project.teamSize === 1 ? "개인 프로젝트" : `팀 프로젝트 (${project.teamSize}인)`}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-stone-900 mb-4 leading-tight tracking-tight">
            {project.title}
          </h1>
          <p className="text-lg text-stone-500 leading-relaxed mb-6">{project.summary}</p>

          <div className="inline-flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5">
            <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-semibold text-stone-600">내 역할</span>
            <span className="text-sm text-stone-500">{project.role}</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-12">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-stone-900 text-stone-100 text-sm font-medium rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <hr className="border-stone-200 mb-12" />

        {/* Problem & Solution */}
        <div className="mb-12">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">Problem & Solution</h2>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2 px-1 mb-1">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Problem</span>
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Solution</span>
            </div>
            {project.problemSolutions.map((item, i) => (
              <div key={i} className="grid grid-cols-2 rounded-2xl border border-stone-200 overflow-hidden">
                <div className="p-5 bg-stone-50 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-300">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xs font-bold text-stone-600">{item.title}</span>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {item.problem.map((point, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-stone-300 flex-shrink-0 mt-0.5 text-xs">—</span>
                        <span className="text-xs text-stone-500 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 bg-amber-50/70 border-l border-stone-200 flex flex-col justify-center gap-1.5">
                  {item.solution.map((point, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-amber-400 flex-shrink-0 mt-0.5 text-xs font-bold">→</span>
                      <span className="text-xs text-stone-700 leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ProjectInteractive project={project} />

        {/* Results */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">Results & Impact</h2>
          <ul className="flex flex-col gap-3">
            {project.results.map((result) => (
              <li key={result} className="flex items-start gap-3">
                <span className="text-amber-500 mt-0.5 flex-shrink-0 font-bold">→</span>
                <span className="text-stone-700 text-sm leading-relaxed">{result}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
