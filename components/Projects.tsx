import Image from "next/image";
import Link from "next/link";
import { projectCards } from "@/lib/profile";
import { Badge, CardHead, Section, Tags } from "./Section";

export default function Projects() {
  const cards = projectCards.filter((card) => !card.draft);

  return (
    <Section
      id="projects"
      title="Projects"
      subtitle="문제를 정의하고 서비스까지 연결한 작업들입니다."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        {cards.map((card) => (
          <article
            key={card.title}
            className="group flex flex-col overflow-hidden rounded-2xl bg-surface border border-line shadow-[0_1px_2px_rgba(26,19,47,0.04),0_8px_24px_-12px_rgba(26,19,47,0.12)] transition-shadow hover:shadow-[0_2px_4px_rgba(26,19,47,0.06),0_16px_36px_-16px_rgba(26,19,47,0.2)]"
          >
            {/* 썸네일 — 없으면 track 라벨 플레이스홀더 */}
            <div className="relative aspect-[16/10] border-b border-line overflow-hidden">
              {card.thumbnail ? (
                <Image
                  src={card.thumbnail}
                  alt={`${card.title} 스크린샷`}
                  fill
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-tide/12 to-deep/8">
                  <span className="rail text-tide">{card.track}</span>
                  <span className="rail text-muted/60 text-[0.6875rem]">
                    스크린샷 준비 중
                  </span>
                </div>
              )}
            </div>

            {/* 본문 */}
            <div className="flex flex-col flex-1 p-7">
              <CardHead
                org={card.title}
                badge={<Badge tone="accent">{card.badge}</Badge>}
                meta={
                  <>
                    {card.period}
                    <span className="mx-2 text-line">·</span>
                    {card.teamSize}
                  </>
                }
              />

              <p className="mt-4 text-[0.95rem] leading-relaxed">
                {card.summary}
              </p>

              <div className="mt-auto pt-6">
                <Tags items={card.stack} />
                {card.slug && (
                  <Link
                    href={`/projects/${card.slug}`}
                    className="rail mt-5 inline-flex items-center gap-1.5 text-deep hover:underline underline-offset-4"
                  >
                    Project Detail <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
