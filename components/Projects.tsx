import Link from "next/link";
import { projects } from "@/lib/projects";

function ExternalLinkIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Projects
          </p>
          <h2 className="text-3xl font-bold text-stone-900">주요 프로젝트</h2>
        </div>

        {projects.length === 0 ? (
          <p className="text-stone-400 text-sm">아직 등록된 프로젝트가 없습니다.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.slug}
                className="group bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="h-1 bg-amber-500 rounded-t-2xl" />

                <div className="p-6 flex flex-col flex-1">
                  <Link href={`/projects/${project.slug}`} className="block mb-2">
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-stone-500 text-sm leading-relaxed mb-5 flex-1">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-medium transition-colors"
                    >
                      <GitHubIcon />
                      GitHub
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                      >
                        Live Demo
                        <ExternalLinkIcon />
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="ml-auto text-xs text-stone-400 hover:text-amber-600 font-medium transition-colors"
                    >
                      자세히 →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
