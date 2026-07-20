import Link from "next/link";
import { educations } from "@/lib/profile";
import { Card, CardHead, CardLabel, Points, Section, Tags } from "./Section";

export default function Education() {
  return (
    <Section
      id="education"
      title="Education"
      subtitle="전공과 부트캠프에서 AI와 개발의 기초를 다졌습니다."
    >
      {educations.map((education) => (
        <Card key={education.org}>
          <CardHead
            org={education.org}
            role={
              education.detail
                ? `${education.program} · ${education.detail}`
                : education.program
            }
            meta={
              <>
                {education.period}
                <span className="mx-2 text-line">·</span>
                {education.status}
              </>
            }
          />

          <div className="mt-6">
            <Points points={education.points} />
          </div>

          {education.stack && (
            <>
              <CardLabel>사용 기술</CardLabel>
              <Tags items={education.stack} />
            </>
          )}

          {education.projectSlug && (
            <Link
              href={`/projects/${education.projectSlug}`}
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
