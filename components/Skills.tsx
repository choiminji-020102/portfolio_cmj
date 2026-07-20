import { skillGroups } from "@/lib/profile";
import { Section } from "./Section";

export default function Skills() {
  return (
    <Section
      id="skills"
      title="Skills"
      subtitle="AI 모델링부터 서비스 배포까지, 넓게 다룹니다."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        {skillGroups.map((group) => (
          <div
            key={group.name}
            className="rounded-2xl bg-surface border border-line shadow-[0_1px_2px_rgba(26,19,47,0.04),0_8px_24px_-12px_rgba(26,19,47,0.12)] p-7"
          >
            <h3 className="text-base font-bold tracking-tight">{group.name}</h3>
            <p className="mt-2 text-sm text-muted">{group.caption}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rail bg-ground border border-line rounded-md px-2.5 py-1 text-ink/75"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
