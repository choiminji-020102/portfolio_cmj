import Image from "next/image";
import Link from "next/link";
import type { LightProject } from "@/lib/projectDetails";
import { AwardBadge } from "./AwardMark";
import DataTable from "./DataTable";
import FeatureCard from "./FeatureCard";
import GitHubIcon from "./GitHubIcon";
import MermaidDiagram from "./MermaidDiagram";
import ShowcaseGallery from "./ShowcaseGallery";

// 외부 링크 버튼 — TroubleDetails의 강조 pill과 같은 tide 스타일을 쓴다
const actionButton =
  "rail inline-flex items-center gap-1.5 rounded-full border border-tide/50 bg-tide/8 px-4 py-2 font-semibold text-deep transition-colors hover:border-tide hover:bg-tide/15";

/*
  리드 문단 — 헤더 요약, 과제 배경, 내가 맡은 역할이 모두 이 하나를 쓴다.
  섹션마다 굵기·색이 달라지면 위계가 아니라 잡음으로 읽힌다.
*/
const leadText = "text-base leading-relaxed text-ink";

export default function LightProjectView({
  project,
}: {
  project: LightProject;
}) {
  // 제안 배경 막대그래프 세그먼트 색 (진→연)
  const barTones = ["bg-deep", "bg-deep/55", "bg-deep/35", "bg-deep/20"];
  // 원인 갈래가 없는 프로젝트는 배경을 1단으로 — 화살표와 빈 칸을 만들지 않는다
  const hasCauses = (project.backgroundCauses?.length ?? 0) > 0;
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
        {/* 헤더 — 메타 → 제목·배지 → 요약 → 태그 → 링크 (모두 왼쪽 축 정렬)
            앱 스크린샷은 최상단 갤러리 대신 각 AI 기능 카드에서 보여준다 */}
        <header className="border-b border-line pb-10">
          {/* 기간·팀을 제목 위 라벨로 — 제목이 블록의 시각 앵커가 되도록 */}
          <p className="rail text-muted">
            {project.period}
            <span className="mx-2 text-line">·</span>
            {project.teamSize}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {project.title}
            </h1>
            <AwardBadge badge={project.badge} />
          </div>

          {/* 한 줄 요약 — 스크롤하지 않고도 역할이 파악되도록 제목에 바로 붙인다 */}
          {project.tagline && (
            <p className="mt-3 max-w-3xl text-lg font-semibold leading-snug text-deep">
              {project.tagline}
            </p>
          )}

          <div className="mt-4 max-w-3xl space-y-3">
            <p className={leadText}>{project.summary}</p>
            {project.summaryMore?.map((para) => (
              <p key={para} className={leadText}>
                {para}
              </p>
            ))}
          </div>

          {/* 태그 */}
          <ul className="mt-7 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li
                key={item}
                className="rail bg-surface border border-line rounded-md px-2.5 py-1 text-ink/75"
              >
                {item}
              </li>
            ))}
          </ul>

          {/* 외부 링크 — 헤더를 닫는 액션 줄.
              시연 영상을 GitHub 옆에 두어 상단에서 바로 결과물로 들어갈 수 있게 한다 */}
          {(project.github ||
            project.demo ||
            project.slides ||
            project.homepage) && (
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
                  {project.demoLabel ?? "시연 영상"}
                </a>
              )}
              {project.slides && (
                <a
                  href={project.slides}
                  target="_blank"
                  rel="noreferrer"
                  className={actionButton}
                >
                  <span aria-hidden="true">◱</span>
                  {project.slidesLabel ?? "발표자료"}
                  <span className="text-muted">PDF</span>
                </a>
              )}
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noreferrer"
                  className={actionButton}
                >
                  {project.homepageLabel ?? "홈페이지"} ↗
                </a>
              )}
            </div>
          )}
        </header>

        {/* 과제 개요 — 사실 항목(좌) + 작업 타임라인(우).
            타임라인이 없으면 개요가 단독으로 폭을 다 쓴다 */}
        {project.overview && project.overview.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">
              {project.overviewLabel ?? "과제 개요"}
            </h2>
            <div
              className={`mt-6 grid gap-8 ${
                project.timeline?.length ? "lg:grid-cols-[1fr_auto]" : ""
              }`}
            >
              <dl className="divide-y divide-line border-y border-line">
                {project.overview.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-1 py-3.5 sm:grid-cols-[7rem_1fr] sm:gap-4"
                  >
                    <dt className="rail pt-0.5 text-muted">{row.label}</dt>
                    <dd className="text-[0.95rem] leading-relaxed text-ink">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {project.timeline && project.timeline.length > 0 && (
                <div className="lg:w-[19rem]">
                  <p className="rail text-muted">작업 타임라인</p>
                  <ol className="mt-3 space-y-0 border-l border-line pl-4">
                    {project.timeline.map((row) => (
                      <li key={row.when} className="relative py-1.5">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[1.3125rem] top-[0.85rem] h-1.5 w-1.5 rounded-full bg-tide"
                        />
                        <span className="rail mr-2 text-tide">{row.when}</span>
                        <span className="text-[0.9rem] leading-relaxed">
                          {row.what}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {project.timelineNote && (
              <p className="mt-6 border-l-2 border-tide/40 pl-4 text-[0.95rem] leading-relaxed text-muted">
                {project.timelineNote}
              </p>
            )}

            {/* 참고 이미지 — 검출 대상이 실제로 어떻게 보이는지.
                본인이 만든 산출물이 아니므로 성격을 반드시 밝힌다 */}
            {project.overviewFigures && project.overviewFigures.length > 0 && (
              <div className="mt-10">
                <p className="rail text-muted">
                  {project.overviewFiguresLabel ?? "참고 이미지"}
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {project.overviewFigures.map((fig) => (
                    <figure key={fig.src}>
                      <div className="overflow-hidden rounded-xl border border-line bg-ink/90">
                        <Image
                          src={fig.src}
                          alt={fig.alt}
                          width={fig.width}
                          height={fig.height}
                          sizes="(max-width: 640px) 100vw, 300px"
                          className="h-auto w-full"
                        />
                      </div>
                      {fig.caption && (
                        <figcaption className="rail mt-2 text-muted">
                          {fig.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
                {project.overviewFiguresNote && (
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {project.overviewFiguresNote}
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {/* 제안 배경 */}
        {project.background && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">
              {project.backgroundLabel ?? "제안 배경"}
            </h2>
            {/* 좌(리드+규모별 그래프) / 우(두 원인 = 텍스트+그래픽) — 같은 높이 */}
            <div
              className={`mt-6 grid gap-6 ${
                hasCauses
                  ? "lg:grid-cols-[1fr_auto_1fr] lg:items-stretch lg:gap-8"
                  : ""
              }`}
            >
              {/* 왼쪽 — 리드는 맨 위, 그래프는 맨 아래. 오른쪽 컬럼과 상·하단선을 맞춘다 */}
              <div className="flex flex-col justify-between gap-6">
                {/* 리드 — 위기 → 결과 */}
                <div>
                  <p className={leadText}>{project.background}</p>
                  {project.backgroundEffect && (
                    <p className={`mt-0.5 flex items-start gap-2 ${leadText}`}>
                      <span aria-hidden="true" className="text-tide">
                        →
                      </span>
                      {project.backgroundEffect}
                    </p>
                  )}
                </div>

                {/* 규모별 폐업 그래프 */}
                {project.backgroundChart && (
                  <Image
                    src={project.backgroundChart.src}
                    alt={project.backgroundChart.alt}
                    width={project.backgroundChart.width}
                    height={project.backgroundChart.height}
                    className="h-auto w-full rounded-lg"
                    unoptimized
                  />
                )}
              </div>

              {/* 파생 화살표 — 데스크톱 →, 모바일 ↓ */}
              {hasCauses && (
                <div
                  aria-hidden="true"
                  className="flex justify-center lg:self-center"
                >
                  <svg
                    viewBox="0 0 48 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-12 rotate-90 text-tide lg:rotate-0"
                  >
                    <line x1="1" y1="6" x2="42" y2="6" />
                    <polyline points="36,1.5 42,6 36,10.5" />
                  </svg>
                </div>
              )}

              {/* 오른쪽 — 두 원인: 각 원인 텍스트 아래에 해당 그래픽 */}
              {project.backgroundCauses &&
                project.backgroundCauses.length > 0 && (
                  <div className="flex flex-col gap-7">
                    {project.backgroundCauses.map((cause) => (
                      <div key={cause.index}>
                        <p className="text-[0.95rem] font-semibold leading-relaxed text-ink">
                          <span className="mr-2 font-mono font-normal text-deep tabular-nums">
                            원인 {cause.index})
                          </span>
                          {cause.title}
                        </p>
                        <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">
                          {cause.statLabel}{" "}
                          <span className="font-mono text-deep tabular-nums">
                            ({cause.stat})
                          </span>
                        </p>
                        {cause.image && (
                          <Image
                            src={cause.image.src}
                            alt={cause.image.alt}
                            width={cause.image.width}
                            height={cause.image.height}
                            className={`mt-3 h-auto w-full rounded-lg ${
                              cause.image.maxWidthClass ?? ""
                            }`}
                            unoptimized
                          />
                        )}
                        {cause.barChart && (
                          <div className="mt-3">
                            <div className="flex h-9 w-full overflow-hidden rounded-md">
                              {cause.barChart.segments.map((seg, i) => (
                                <div
                                  key={`seg-${i}`}
                                  style={{ flexGrow: seg.value }}
                                  className={`flex items-center justify-center text-xs font-semibold tabular-nums ${
                                    barTones[i] ?? "bg-deep/20"
                                  } ${i < 2 ? "text-white" : "text-ink/55"}`}
                                >
                                  {seg.value}%
                                </div>
                              ))}
                            </div>
                            <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink">
                              {cause.barChart.segments.map((seg, i) =>
                                seg.label ? (
                                  <span
                                    key={`leg-${i}`}
                                    className="inline-flex items-center gap-2"
                                  >
                                    <span
                                      className={`inline-block h-3 w-3 rounded-sm ${
                                        barTones[i] ?? "bg-deep/20"
                                      }`}
                                    />
                                    {seg.label}
                                    <span className="font-mono text-deep tabular-nums">
                                      {seg.value}%
                                    </span>
                                  </span>
                                ) : null,
                              )}
                            </div>
                          </div>
                        )}
                        {cause.surveyCard && (
                          <figure className="mt-3 w-full rounded-lg border border-line bg-surface p-4">
                            <figcaption className="border-y-[3px] border-double border-ink/25 py-2 text-center text-[0.95rem] font-bold tracking-tight text-ink">
                              {cause.surveyCard.title}
                            </figcaption>
                            <blockquote className="mt-3 text-[0.85rem] leading-relaxed text-ink/80">
                              {cause.surveyCard.quote}
                            </blockquote>
                            {cause.surveyCard.source && (
                              <p className="rail mt-3 text-right text-muted">
                                {cause.surveyCard.source}
                              </p>
                            )}
                          </figure>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* 기존 대안과 그 한계 — 배경의 근거가 표인 경우 */}
            {project.backgroundTable && (
              <div className="mt-6 max-w-3xl">
                {project.backgroundTable.label && (
                  <p className="rail mb-2 text-muted">
                    {project.backgroundTable.label}
                  </p>
                )}
                <DataTable
                  head={project.backgroundTable.head}
                  rows={project.backgroundTable.rows}
                />
              </div>
            )}

            {/* 표 아래로 이어지는 결론 */}
            {project.backgroundClosing &&
              project.backgroundClosing.length > 0 && (
                <div className="mt-6 max-w-3xl space-y-3">
                  {project.backgroundClosing.map((para) => (
                    <p key={para} className={leadText}>
                      {para}
                    </p>
                  ))}
                </div>
              )}

            {/* 기능 축 — 나란히 놓아 셋을 한눈에, 담당한 축만 강조한다 */}
            {project.backgroundScope && project.backgroundScope.length > 0 && (
              <ol className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
                {project.backgroundScope.map((item) => (
                  <li
                    key={item.label}
                    className={`flex flex-col items-center justify-center rounded-xl border px-4 py-3 text-center ${
                      item.mine
                        ? "border-tide/50 bg-tide/8"
                        : "border-line bg-surface"
                    }`}
                  >
                    <span
                      className={`rail font-mono ${
                        item.mine ? "text-tide" : "text-muted"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`mt-0.5 text-[0.95rem] leading-relaxed ${
                        item.mine ? "font-semibold text-ink" : "text-muted"
                      }`}
                    >
                      {item.text}
                    </span>
                    {item.mine && (
                      <span className="rail mt-1.5 text-tide">담당 영역</span>
                    )}
                  </li>
                ))}
              </ol>
            )}

            {/* 계기 · 목표 — 박스 없이 2단 (하단 역할 박스와 중복 방지) */}
            {(project.backgroundOrigin || project.backgroundGoal) && (
              <div className="mt-10 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-2">
                {project.backgroundOrigin && (
                  <div>
                    <p className="rail text-muted">계기</p>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">
                      {project.backgroundOrigin}
                    </p>
                  </div>
                )}
                {project.backgroundGoal && (
                  <div>
                    <p className="rail text-muted">목표</p>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">
                      {project.backgroundGoal}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* 내가 맡은 역할 */}
        {project.myRole && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              {project.myRoleLabel ?? "내가 맡은 역할"}
            </h2>
            <p className={`mt-6 ${leadText}`}>{project.myRole}</p>

            {/* 담당 축 — 3개 영역 */}
            {project.myRoleAreas && project.myRoleAreas.length > 0 && (
              <div className="mt-8">
                <p className="rail text-muted">담당 영역</p>
                <div className="mt-4 grid gap-6 sm:grid-cols-3">
                  {project.myRoleAreas.map((area) => (
                    <div
                      key={area.title}
                      className="border-t-2 border-tide/40 pt-3"
                    >
                      <p className="text-[0.95rem] font-semibold leading-snug text-ink">
                        {area.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {area.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 작업 범위 — 순서 파이프라인 */}
            {project.myRolePipeline && project.myRolePipeline.length > 0 && (
              <div className="mt-8">
                <p className="rail text-muted">작업 범위 · 전 과정</p>
                <div className="mt-3 flex flex-wrap items-center gap-y-2 text-[0.95rem]">
                  {project.myRolePipeline.map((step, i) => (
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
            )}

            {/* 구조 · 흐름 다이어그램 — 담당 구간이 어디에 걸쳐 있는지 */}
            {project.myRoleDiagrams && project.myRoleDiagrams.length > 0 && (
              <div className="mt-8 space-y-6">
                {project.myRoleDiagrams.map((d, i) => (
                  <figure key={i}>
                    {d.caption && (
                      <figcaption className="rail mb-2 text-muted">
                        {d.caption}
                      </figcaption>
                    )}
                    <div className="rounded-xl border border-line bg-surface p-3 sm:p-4">
                      <MermaidDiagram chart={d.chart} />
                    </div>
                  </figure>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 사용 기술 — 담당 범위 바로 뒤.
            읽는 사람은 스택을 초반에 확인하므로, 본문 끝이 아니라 여기서 한 번에 보여준다 */}
        {project.techStack && project.techStack.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              {project.techStackLabel ?? "사용 기술"}
            </h2>
            <div className="mt-6 max-w-3xl">
              <DataTable
                head={["구분", "기술"]}
                rows={project.techStack.map((t) => [t.label, t.value])}
              />
            </div>
          </section>
        )}

        {/* 결과물 — 기술 상세로 들어가기 전에 "무엇을 만들었나"를 화면으로 먼저 보여준다 */}
        {project.showcase && project.showcase.shots.length > 0 && (
          <section className="mt-16">
            {/* 제목 옆에 시연 영상 — 캡처를 보러 온 자리에서 바로 움직이는 화면으로 넘어갈 수 있게.
                버튼이 여기 있으면 "영상은 상단에 있다"는 안내문이 따로 필요 없다 */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold tracking-tight">
                {project.showcase.label}
              </h2>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="rail inline-flex items-center gap-1.5 rounded-full border border-tide bg-tide/15 px-3.5 py-1.5 font-semibold text-deep transition-colors hover:bg-tide/25"
                >
                  <span aria-hidden="true">▶</span>
                  {project.demoLabel ?? "시연 영상"}
                </a>
              )}
            </div>
            {project.showcase.intro && (
              <p className={`mt-4 max-w-3xl ${leadText}`}>
                {project.showcase.intro}
              </p>
            )}
            {/* 단서 문장 — 지금은 쓰는 곳이 없다 (시연 영상은 위 버튼이 대신한다) */}
            {project.showcase.note && (
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                {project.showcase.note}
              </p>
            )}
            {/* 캡처 격자 — 목록 배치와 클릭 확대는 클라이언트 쪽에서 (ShowcaseGallery) */}
            <ShowcaseGallery shots={project.showcase.shots} />
          </section>
        )}

        {/* 핵심 AI 기능 — 문제 → 해결 → 수치 */}
        {project.aiFeatures && project.aiFeatures.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              {project.aiFeaturesLabel ?? "핵심 AI 기능"}
            </h2>
            <div className="mt-8 space-y-6">
              {project.aiFeatures.map((feature) => (
                <FeatureCard key={feature.name} feature={feature} />
              ))}
            </div>
          </section>
        )}

        {/* 구현 상세 — 절이 여러 개로 갈릴 때. 카드 모양은 위와 같다 */}
        {project.featureGroups && project.featureGroups.length > 0 && (
          <>
            {project.featureGroups.map((group) => (
              <section key={group.label} className="mt-16">
                <h2 className="text-2xl font-bold tracking-tight">
                  {group.label}
                </h2>
                {group.intro && (
                  <p className={`mt-4 max-w-3xl ${leadText}`}>{group.intro}</p>
                )}
                {group.points && group.points.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {group.points.map((pt) => (
                      <li
                        key={pt}
                        className="relative pl-5 text-[0.95rem] leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-deep"
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
                {group.items && group.items.length > 0 && (
                  <div className="mt-8 space-y-6">
                    {group.items.map((feature) => (
                      <FeatureCard key={feature.name} feature={feature} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </>
        )}

        {/* 주요 기능 개발 */}
        {project.features.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              {project.featuresLabel ?? "그 외 기능"}
            </h2>
            {project.featuresIntro && (
              <p className={`mt-4 max-w-3xl ${leadText}`}>
                {project.featuresIntro}
              </p>
            )}
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
        )}

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

        {/* 회고 — 갈래로 나뉘는 경우 (잘한 점 / 아쉬운 점 / 더 해본다면) */}
        {project.closingGroups && project.closingGroups.length > 0 && (
          <section className="mt-16 border-t border-line pt-12">
            <h2 className="text-2xl font-bold tracking-tight">
              {project.closingLabel ?? "마무리"}
            </h2>
            <div className="mt-8 max-w-3xl space-y-8">
              {project.closingGroups.map((group) => (
                <div key={group.title}>
                  <p className="font-semibold text-deep">{group.title}</p>
                  <ul className="mt-3 space-y-2.5">
                    {group.points.map((pt) => (
                      <li
                        key={pt}
                        className="relative pl-5 text-[0.95rem] leading-relaxed text-ink before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-tide"
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 마무리 — 결과가 아니라 무엇이 남았는지.
            첫 문단만 굵게 두어 결론을 앞세우고, 나머지는 본문 흐름으로 읽힌다 */}
        {project.closing && project.closing.length > 0 && (
          <section className="mt-16 border-t border-line pt-12">
            <h2 className="text-2xl font-bold tracking-tight">
              {project.closingLabel ?? "마무리"}
            </h2>
            {/* 줄길이 제한은 헤더 요약과 같은 값을 쓴다 — 회고만 좁아 보이지 않게 */}
            <div className="mt-6 max-w-3xl space-y-4">
              {project.closing.map((para, i) => (
                <p
                  key={para}
                  className={
                    i === 0
                      ? "text-base font-semibold leading-relaxed text-deep"
                      : leadText
                  }
                >
                  {para}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* 작업 기록 — 본문에서 덜어낸 상세를 외부 글로 넘긴다 */}
        {project.writeups && project.writeups.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">
              {project.writeupsLabel ?? "작업 기록"}
            </h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
              작업 중 규명한 이슈는 그때그때 정리해 같은 실수를 반복하지 않도록
              했습니다.
            </p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {project.writeups.map((post) => (
                <li key={post.href}>
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-baseline gap-3 py-4 transition-colors hover:text-deep"
                  >
                    <span className="text-[0.95rem] leading-relaxed">
                      {post.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="ml-auto shrink-0 text-tide transition-transform group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {project.writeupsNote && (
              <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
                {project.writeupsNote}
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
