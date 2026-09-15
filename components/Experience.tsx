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
        <Card key={`${career.org}-${career.period}`}>
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

          {career.parts && career.parts.length > 0 ? (
            /* 사수·과제가 바뀌어 기간·성과·링크가 갈리는 경우 — 카드 하나 안에서
               구간별로 다시 나눈다. 회사·직군은 하나이므로 카드까지 쪼개지 않는다.
               구분선 위아래 여백을 space-y(선 위)·pt(선 아래)로 대칭을 맞춘다 —
               divide-y 는 두 여백이 겹쳐 선이 링크에 바짝 붙어 보였다 */
            <div className="mt-8 space-y-10">
              {career.parts.map((part, i) => (
                <div
                  key={part.label}
                  className={i > 0 ? "border-t border-line pt-10" : ""}
                >
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <Badge tone="accent">{part.label}</Badge>
                    <p className="text-[0.95rem] font-medium">{part.role}</p>
                  </div>
                  <p className="rail mt-2">
                    {part.period}
                    <span className="mx-2 text-line">·</span>
                    {part.duration}
                  </p>

                  <CardLabel>주요 성과</CardLabel>
                  <Points points={part.points} />

                  <CardLabel>사용 기술</CardLabel>
                  <Tags items={part.stack} />

                  {part.projectSlug && (
                    <Link
                      href={`/projects/${part.projectSlug}`}
                      className="rail mt-7 inline-flex items-center gap-1.5 text-deep hover:underline underline-offset-4"
                    >
                      프로젝트 상세 보기 <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
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
            </>
          )}
        </Card>
      ))}
    </Section>
  );
}
