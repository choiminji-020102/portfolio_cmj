import Link from "next/link";
import { careers } from "@/lib/profile";
import { Badge, Card, CardHead, CardLabel, Points, Section, Tags } from "./Section";

export default function Experience() {
  return (
    <Section
      id="experience"
      title="Experience"
      subtitle="실무에서 마주한 문제를 직접 정의하고 풀어온 기록입니다."
    >
      {careers.map((career) => (
        <Card key={career.org}>
          <CardHead
            org={career.org}
            badge={<Badge>{career.employment}</Badge>}
            role={career.role}
            meta={
              <>
                {career.period}
                <span className="mx-2 text-line">·</span>
                {career.duration}
                <span className="mx-2 text-line">·</span>
                {career.track}
              </>
            }
          />

          <CardLabel>주요 성과</CardLabel>
          <Points points={career.points} />

          <CardLabel>사용 기술</CardLabel>
          <Tags items={career.stack} />

          {career.projectSlug && (
            <Link
              href={`/projects/${career.projectSlug}`}
              className="rail mt-7 inline-flex items-center gap-1.5 text-deep hover:underline underline-offset-4"
            >
              프로젝트 상세 보기 <span aria-hidden="true">→</span>
            </Link>
          )}
        </Card>
      ))}
    </Section>
  );
}
