import Link from "next/link";
import { projectCards } from "@/lib/profile";
import { Badge, Card, CardHead, CardLabel, Section, Tags } from "./Section";

export default function Projects() {
  const cards = projectCards.filter((card) => !card.draft);

  return (
    <Section
      id="projects"
      title="Projects"
      subtitle="문제를 정의하고 서비스까지 연결한 작업들입니다."
    >
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHead
            org={card.title}
            badge={<Badge tone="accent">{card.badge}</Badge>}
            meta={
              <>
                {card.period}
                <span className="mx-2 text-line">·</span>
                {card.teamSize}
                <span className="mx-2 text-line">·</span>
                {card.track}
              </>
            }
          />

          <p className="mt-5 text-[0.95rem] leading-relaxed">{card.summary}</p>

          <CardLabel>사용 기술</CardLabel>
          <Tags items={card.stack} />

          {card.slug && (
            <Link
              href={`/projects/${card.slug}`}
              className="rail mt-7 inline-flex items-center gap-1.5 text-deep hover:underline underline-offset-4"
            >
              문제와 해결 과정 보기 <span aria-hidden="true">→</span>
            </Link>
          )}
        </Card>
      ))}
    </Section>
  );
}
