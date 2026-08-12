import Image from "next/image";
import type { AiFeature } from "@/lib/projectDetails";
import CodeBlock from "./CodeBlock";
import DataTable from "./DataTable";
import RagDiagram from "./RagDiagram";
import RouteDiagram from "./RouteDiagram";
import TroubleDetails from "./TroubleDetails";

/*
  기능 카드 — 문제 → 해결 → 수치 한 장.
  '핵심 AI 기능'(aiFeatures)과 절로 갈리는 구현 상세(featureGroups)가 같은 모양을 쓴다.
*/
export default function FeatureCard({ feature }: { feature: AiFeature }) {
  return (
                <div
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
                  {feature.when && (
                    <p className="rail mt-2 text-tide">{feature.when}</p>
                  )}
                  {feature.tagline && (
                    <p className="mt-1.5 text-sm text-muted">{feature.tagline}</p>
                  )}

                  {/* 설명 그림 — 좌표계·파이프라인처럼 글보다 그림이 빠른 것들.
                      원본 폭보다 크게 늘리지 않고, 좁은 화면에서만 줄어든다 */}
                  {feature.figures && feature.figures.length > 0 && (
                    <div className="mt-5 space-y-5">
                      {feature.figures.map((fig) => (
                        <figure key={fig.src}>
                          <Image
                            src={fig.src}
                            alt={fig.alt}
                            width={fig.width}
                            height={fig.height}
                            style={{ maxWidth: fig.width }}
                            className="h-auto w-full rounded-xl border border-line bg-ground/60 p-2 sm:p-3"
                            unoptimized
                          />
                          {fig.caption && (
                            <figcaption className="rail mt-2 text-muted">
                              {fig.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
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
                        {/* 블록들 앞에 오는 리드 문장 — 해결 방향을 한 줄로 밝히고
                            그 근거를 블록에서 편다 */}
                        {feature.solution && (
                          <p className="mb-4">{feature.solution}</p>
                        )}
                        {/* 블록 간 간격 — 안에 그림·코드가 들어가면 16px 로는
                            다음 소제목이 앞 블록에 붙어 읽힌다 */}
                        <div className="space-y-7">
                          {feature.solutionBlocks.map((block, bi) => (
                            <div
                              key={block.title ?? bi}
                              className="border-l-2 border-tide/40 pl-4"
                            >
                              {block.title && (
                                <p className="font-semibold">{block.title}</p>
                              )}

                              {/* 코드 앞에 오는 불릿 — 원문이 목록 → 코드 순서일 때 */}
                              {block.pointsFirst && block.points.length > 0 && (
                                <ul
                                  className={`space-y-1 ${
                                    block.title ? "mt-1.5" : ""
                                  }`}
                                >
                                  {block.points.map((pt) => (
                                    <li
                                      key={pt}
                                      className="relative pl-5 text-muted before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-tide"
                                    >
                                      {pt}
                                    </li>
                                  ))}
                                </ul>
                              )}

                              {/* 좌우 배치 — 코드가 높이를 정하고 그림은 거기에 맞춘다.
                                  그림은 fill 이라 자기 높이를 주장하지 않는다 */}
                              {block.layout === "side" &&
                              block.code &&
                              block.figure ? (
                                <div className="mt-3 flex flex-col gap-4 sm:min-h-[22rem] sm:flex-row sm:items-stretch">
                                  <CodeBlock
                                    code={block.code}
                                    lang={block.lang}
                                    className="min-w-0 flex-1"
                                  />
                                  <figure className="flex shrink-0 flex-col sm:w-[135px]">
                                    <div className="relative h-56 rounded-xl border border-line bg-white p-2 sm:h-auto sm:flex-1">
                                      <Image
                                        src={block.figure.src}
                                        alt={block.figure.alt}
                                        fill
                                        sizes="135px"
                                        className="object-contain"
                                        unoptimized
                                      />
                                    </div>
                                    {block.figure.caption && (
                                      <figcaption className="rail mt-2 leading-snug text-muted">
                                        {block.figure.caption}
                                      </figcaption>
                                    )}
                                  </figure>
                                </div>
                              ) : null}

                              {/* 그림 → 계산 → 불릿. 원문 소제목 아래 순서 그대로 */}
                              {block.layout !== "side" && block.figure && (
                                <figure className="mt-3">
                                  <Image
                                    src={block.figure.src}
                                    alt={block.figure.alt}
                                    width={block.figure.width}
                                    height={block.figure.height}
                                    style={{ maxWidth: block.figure.width }}
                                    className="h-auto w-full rounded-xl border border-line bg-ground/60 p-2 sm:p-3"
                                    unoptimized
                                  />
                                  {block.figure.caption && (
                                    <figcaption className="rail mt-2 text-muted">
                                      {block.figure.caption}
                                    </figcaption>
                                  )}
                                </figure>
                              )}

                              {block.layout !== "side" && block.code && (
                                <CodeBlock
                                  code={block.code}
                                  lang={block.lang}
                                  className={
                                    block.title || block.pointsFirst
                                      ? "mt-3"
                                      : ""
                                  }
                                />
                              )}

                              {/* 제목 바로 아래 오는 불릿은 붙어 있어야 한 덩어리로
                                  읽히고, 그림·코드 뒤에 오면 떨어져야 한다 */}
                              {!block.pointsFirst &&
                                block.points.length > 0 && (
                                  <ul
                                    className={`space-y-1 ${
                                      block.figure || block.code
                                        ? "mt-4"
                                        : "mt-1.5"
                                    }`}
                                  >
                                    {block.points.map((pt) => (
                                      <li
                                        key={pt}
                                        className="relative pl-5 text-muted before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-tide"
                                      >
                                        {pt}
                                      </li>
                                    ))}
                                  </ul>
                                )}

                              {/* 블록을 닫는 서술 — 불릿이 아니라 문단으로 끝나는 원문 */}
                              {block.note && (
                                <p className="mt-4">{block.note}</p>
                              )}
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
                    <div className="mt-6 rounded-xl bg-ground/60 border border-line p-3 sm:p-4">
                      <RagDiagram />
                    </div>
                  )}

                  {/* 항목 단위 비교표 — 후보 서베이처럼 표가 곧 본문인 경우 */}
                  {feature.table && (
                    <div className="mt-6">
                      {feature.table.label && (
                        <p className="rail mb-2 text-muted">
                          {feature.table.label}
                        </p>
                      )}
                      <DataTable
                        head={feature.table.head}
                        rows={feature.table.rows}
                      />
                      {feature.table.note && (
                        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">
                          {feature.table.note}
                        </p>
                      )}
                    </div>
                  )}


                  {/* 트러블슈팅 · 기술적 의사결정 — 구분선으로 나눈 세로 흐름 */}
                  {feature.troubles && feature.troubles.length > 0 && (
                    <div className="mt-10 border-t-2 border-tide/30 pt-6">
                      <p className="font-semibold text-deep mb-1">
                        {feature.troublesLabel ?? "트러블슈팅 · 기술적 의사결정"}
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
                            </h4>

                            {/* 표 — 문제·해결 두 줄을 대신한다 */}
                            {trouble.table && (
                              <div className="mt-3 pl-8">
                                <DataTable
                                  head={trouble.table.head}
                                  rows={trouble.table.rows}
                                />
                              </div>
                            )}

                            <dl className="mt-3 pl-8 space-y-2 text-[0.9rem] leading-relaxed">
                              {[
                                ["문제", trouble.problem, "text-muted"],
                                ["해결", trouble.solution, "text-deep"],
                                ["효과", trouble.effect, "text-tide"],
                              ]
                                .filter(([, text]) => text)
                                .map(([label, text, color]) => (
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

                            {/* 태그 + 상세 열기 — 한 줄에 좌우로 */}
                            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 pl-8">
                              {trouble.tags && trouble.tags.length > 0 && (
                                <ul className="flex flex-wrap gap-1.5">
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

                              {trouble.details &&
                                trouble.details.length > 0 && (
                                  <TroubleDetails
                                    title={trouble.title}
                                    eyebrow={
                                      feature.troublesLabel ??
                                      "트러블슈팅 · 기술적 의사결정"
                                    }
                                    details={trouble.details}
                                    tech={trouble.tech}
                                  />
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 이 항목을 다룬 글 — 하단 목록과 중복되지만, 읽는 자리에서
                      바로 넘어갈 수 있는 쪽이 실제로 눌린다 */}
                  {feature.writeups && feature.writeups.length > 0 && (
                    <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-t border-line pt-4">
                      <span className="rail shrink-0 text-muted">기록</span>
                      {feature.writeups.map((post) => (
                        <a
                          key={post.href}
                          href={post.href}
                          target="_blank"
                          rel="noreferrer"
                          className="rail inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-deep transition-colors hover:border-tide hover:bg-tide/10"
                        >
                          {post.title}
                          <span aria-hidden="true" className="text-tide">
                            ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
  );
}
