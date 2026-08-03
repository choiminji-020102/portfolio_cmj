/*
  프로젝트 카드 그리드.

  구조를 다섯 덩어리로 고정한다 — 커버 / 분류·기간 / 제목·배지 / 요약 / 담당·결과 / 스택·링크.
  카드마다 같은 자리에 같은 정보가 있어야 프로젝트끼리 비교가 된다.

  상세 페이지 진입은 카드 전체를 덮는 링크 레이어가 받는다. 커버에 뜨는
  "자세히 보기"는 hover·포커스 때만 보이는 안내일 뿐 클릭 대상이 아니다.

  담당·결과 블록이 이 카드의 핵심이다. 5개 중 3개가 팀 작업이라
  "무엇을 맡았고 어디까지 갔나"가 요약 산문에 묻히면 카드가 제 역할을 못 한다.

  커버는 2:1 (권장 1280×640) — public/covers/ 에 넣고 thumbnail 에 경로를 적는다.
*/
import Image from "next/image";
import Link from "next/link";
import { projectCards } from "@/lib/profile";
import { Section, Tags } from "./Section";
import { AwardBadge } from "./AwardMark";
import GitHubIcon from "./GitHubIcon";

export default function Projects() {
  const cards = projectCards.filter((card) => !card.draft);

  return (
    <Section
      id="projects"
      title="Projects"
      subtitle="문제를 정의하고 서비스까지 연결한 작업들입니다."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {cards.map((card) => {
          const detailHref = card.slug ? `/projects/${card.slug}` : undefined;

          return (
            <article
              key={card.title}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_1px_2px_rgba(26,19,47,0.04),0_8px_24px_-12px_rgba(26,19,47,0.12)] transition-shadow ${
                detailHref
                  ? "hover:shadow-[0_2px_4px_rgba(26,19,47,0.06),0_16px_36px_-16px_rgba(26,19,47,0.2)] focus-within:shadow-[0_2px_4px_rgba(26,19,47,0.06),0_16px_36px_-16px_rgba(26,19,47,0.2)]"
                  : ""
              }`}
            >
              {/* 커버 — 없으면 분류 라벨 플레이스홀더 */}
              <div className="relative aspect-[2/1] overflow-hidden border-b border-line bg-gradient-to-br from-tide/10 to-deep/5">
                {card.thumbnail ? (
                  <Image
                    src={card.thumbnail}
                    alt={`${card.title} 커버`}
                    fill
                    sizes="(max-width: 640px) 100vw, 480px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                    <span className="rail text-tide">{card.track}</span>
                    <span className="rail text-[0.6875rem] text-muted/60">
                      커버 준비 중
                    </span>
                  </div>
                )}

                {/* 상시 표시되는 진입 표식.
                    Tailwind의 hover: 는 @media (hover: hover) 안에서만 켜지므로
                    터치 기기에서는 아래 오버레이가 아예 뜨지 않는다.
                    이 배지가 모든 기기에 "누를 수 있다"는 신호를 남긴다. */}
                {detailHref && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-ground/90 text-sm font-semibold text-deep shadow-sm backdrop-blur-sm"
                  >
                    →
                  </span>
                )}

                {/* hover·포커스 시 덧씌워지는 안내 — DOM 뒤라 위 배지를 덮는다.
                    실제 클릭은 카드 전체 레이어가 받는다 */}
                {detailHref && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center bg-ink/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    <span className="rail inline-flex items-center gap-1.5 rounded-full bg-ground px-4 py-2 font-semibold text-deep shadow-lg">
                      자세히 보기 <span>→</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-7">
                {/* 분류 + 기간·규모 */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="rail text-tide">{card.track}</span>
                  <span className="rail text-muted">
                    {card.period}
                    <span className="mx-1.5 text-line">·</span>
                    {card.teamSize}
                  </span>
                </div>

                {/* 제목 + 배지 */}
                <h3 className="mt-3 text-[1.0625rem] font-semibold leading-snug tracking-tight">
                  {card.title}
                </h3>
                <div className="mt-2">
                  <AwardBadge badge={card.badge} />
                </div>

                <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
                  {card.summary}
                </p>

                {/* 담당 · 결과 — 모든 카드에서 같은 자리, 같은 형식 */}
                {(card.role || card.outcome) && (
                  <dl className="mt-5 space-y-1.5 border-y border-line py-4">
                    {card.role && (
                      <div className="flex gap-3">
                        <dt className="rail w-8 shrink-0 font-semibold text-deep">
                          담당
                        </dt>
                        <dd className="text-[0.875rem] leading-relaxed text-ink/85">
                          {card.role}
                        </dd>
                      </div>
                    )}
                    {card.outcome && (
                      <div className="flex gap-3">
                        <dt className="rail w-8 shrink-0 font-semibold text-tide">
                          결과
                        </dt>
                        <dd className="text-[0.875rem] leading-relaxed text-ink/85">
                          {card.outcome}
                        </dd>
                      </div>
                    )}
                  </dl>
                )}

                <div className="mt-auto pt-6">
                  <Tags items={card.stack} />

                  {card.github && (
                    <div className="mt-5">
                      <a
                        href={card.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${card.title} GitHub 저장소`}
                        className="relative z-10 inline-flex text-muted transition-colors hover:text-ink"
                      >
                        <GitHubIcon className="h-[18px] w-[18px]" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* 카드 전체를 덮는 클릭 레이어. article 직속이라 inset-0가 카드 전체를 덮고,
                  GitHub 링크는 z-10으로 이 위에 떠서 따로 눌린다 */}
              {detailHref && (
                <Link
                  href={detailHref}
                  aria-label={`${card.title} 자세히 보기`}
                  /* 카드가 overflow-hidden이라 바깥으로 나간 outline은 잘린다 — 안쪽으로 그린다 */
                  className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tide"
                />
              )}
            </article>
          );
        })}
      </div>
    </Section>
  );
}
