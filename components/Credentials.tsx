import { awards, certifications, papers } from "@/lib/profile";
import { Card, CardLabel, Section } from "./Section";

/* 교육은 Education 섹션으로 옮겼다. 여기는 수상·자격증·논문만 남긴다. */

export default function Credentials() {
  return (
    <Section
      id="credentials"
      title="Credentials"
      subtitle="수상, 자격증, 그리고 학부 시절 발표한 논문입니다."
    >
      <Card>
        <CardLabel>Awards</CardLabel>
        <ul className="space-y-6">
          {awards.map((award) => (
            <li key={award.name}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="rail rounded-full bg-tide/15 border border-tide/30 px-2.5 py-0.5">
                  {award.result}
                </span>
                <h3 className="text-[0.95rem] font-semibold leading-snug">
                  {award.name}
                </h3>
              </div>
              <p className="rail mt-1.5">
                {award.org} · {award.date}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardLabel>Certifications</CardLabel>
        <ul className="space-y-5">
          {certifications.map((certification) => (
            <li key={certification.number}>
              <h3 className="text-[0.95rem] font-semibold">
                {certification.name}
              </h3>
              <p className="rail mt-1">
                {certification.org} · {certification.date} ·{" "}
                {certification.number}
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardLabel>Papers</CardLabel>
        <ul className="space-y-5">
          {papers.map((paper) => (
            <li key={paper.name}>
              <a
                href={paper.link}
                target="_blank"
                rel="noreferrer"
                className="text-[0.95rem] font-semibold leading-snug hover:text-deep transition-colors"
              >
                {paper.name}
                <span aria-hidden="true" className="ml-1.5 text-muted">
                  ↗
                </span>
              </a>
              <p className="rail mt-1.5">{paper.org}</p>
            </li>
          ))}
        </ul>
      </Card>
    </Section>
  );
}
