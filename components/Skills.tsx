import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiHtml5,
  SiNodedotjs, SiExpress, SiPython, SiFastapi,
  SiPostgresql, SiMysql, SiMongodb, SiRedis,
  SiGit, SiGithub, SiDocker, SiVercel,
} from "react-icons/si";
import type { IconType } from "react-icons";

const skillGroups: { category: string; skills: { name: string; Icon?: IconType }[] }[] = [
  {
    category: "Frontend",
    skills: [
      { name: "React", Icon: SiReact },
      { name: "Next.js", Icon: SiNextdotjs },
      { name: "TypeScript", Icon: SiTypescript },
      { name: "Tailwind CSS", Icon: SiTailwindcss },
      { name: "HTML / CSS", Icon: SiHtml5 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", Icon: SiNodedotjs },
      { name: "Express", Icon: SiExpress },
      { name: "Python", Icon: SiPython },
      { name: "FastAPI", Icon: SiFastapi },
      { name: "REST API" },
    ],
  },
  {
    category: "Database",
    skills: [
      { name: "PostgreSQL", Icon: SiPostgresql },
      { name: "MySQL", Icon: SiMysql },
      { name: "MongoDB", Icon: SiMongodb },
      { name: "Redis", Icon: SiRedis },
    ],
  },
  {
    category: "DevOps & Tools",
    skills: [
      { name: "Git", Icon: SiGit },
      { name: "GitHub", Icon: SiGithub },
      { name: "Docker", Icon: SiDocker },
      { name: "Vercel", Icon: SiVercel },
      { name: "VS Code" },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Skills
          </p>
          <h2 className="text-3xl font-bold text-stone-900">기술 스택</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="bg-white rounded-2xl p-7 border border-stone-200"
            >
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-5">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map(({ name, Icon }) => (
                  <span
                    key={name}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 text-sm font-medium rounded-lg hover:bg-stone-200 transition-colors"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
