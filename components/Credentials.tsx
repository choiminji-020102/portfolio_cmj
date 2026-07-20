import { HiTrophy, HiDocumentText, HiAcademicCap, HiCheckBadge } from "react-icons/hi2";

const awards = [
  {
    type: "공모전",
    name: "농림축산식품 공공데이터 활용 창업경진대회 (제10회)",
    org: "농림축산식품부",
    date: "2025.08",
    result: "우수상",
  },
  {
    type: "경진대회",
    name: "AI 보건의료통계분석 경진대회",
    org: "한림대학교",
    date: "2021.11",
    result: "최우수상",
  },
];

const certifications = [
  {
    name: "SQL 개발자 (SQLD)",
    org: "한국데이터산업진흥원",
    date: "2025.12",
    number: "SQLD-059000879",
  },
  {
    name: "데이터분석 준전문가 (ADsP)",
    org: "한국데이터산업진흥원",
    date: "2024.03",
    number: "ADsP-040000771",
  },
  {
    name: "사회조사분석사 2급",
    org: "한국산업인력공단",
    date: "2021.08",
    number: "21202241138L",
  },
  {
    name: "TOEIC Speaking IH (140)",
    org: "한국 TOEIC 위원회",
    date: "2025.09",
    number: "105290",
  },
];

const education = [
  {
    name: "KT AIVLE School 7기",
    org: "KT × 고용노동부",
    period: "2025.03 – 2025.09",
  },
  {
    name: "NIPA-Google ML 부트캠프 협력 실무 프로젝트",
    org: "정보통신산업진흥원",
    period: "2024.10 – 2024.11",
  },
];

const papers = [
  {
    name: "노인의 스마트폰 사용과 사회활동 참여가 인지기능에 미치는 영향에 대한 연구",
    org: "한국산학기술학회",
    link: "https://www.kais99.org/jkais/journal/Vol23No08/vol23no08p23.pdf",
  },
];

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <span className="text-amber-600">{icon}</span>
      <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">{label}</h3>
    </div>
  );
}

export default function Credentials() {
  return (
    <section id="credentials" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Credentials
          </p>
          <h2 className="text-3xl font-bold text-stone-900">수상 & 자격</h2>
        </div>

        <div className="flex flex-col gap-12">

          {/* 수상 */}
          <div>
            <SectionLabel icon={<HiTrophy className="w-4 h-4" />} label="수상" />
            <div className="grid sm:grid-cols-2 gap-4">
              {awards.map((a) => (
                <div
                  key={a.name}
                  className="bg-stone-50 border border-stone-200 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-200 text-stone-600">
                      {a.type}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                      🏆 {a.result}
                    </span>
                  </div>
                  <p className="font-semibold text-stone-900 text-sm leading-snug mb-2">{a.name}</p>
                  <p className="text-xs text-stone-400">{a.org} · {a.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 자격증 */}
          <div>
            <SectionLabel icon={<HiCheckBadge className="w-4 h-4" />} label="자격증" />
            <div className="grid sm:grid-cols-2 gap-3">
              {certifications.map((c) => (
                <div
                  key={c.name}
                  className="flex items-start gap-4 bg-stone-50 border border-stone-200 rounded-xl px-5 py-4"
                >
                  <HiCheckBadge className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">{c.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{c.org} · {c.date}</p>
                    <p className="text-xs text-stone-400 font-mono mt-1">{c.number}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 교육 수료 */}
          <div>
            <SectionLabel icon={<HiAcademicCap className="w-4 h-4" />} label="교육 수료" />
            <div className="flex flex-col gap-3">
              {education.map((e) => (
                <div
                  key={e.name}
                  className="flex items-center gap-4 bg-stone-50 border border-stone-200 rounded-xl px-5 py-4"
                >
                  <HiAcademicCap className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 text-sm">{e.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{e.org}</p>
                  </div>
                  <span className="text-xs text-stone-500 font-medium whitespace-nowrap">{e.period}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 논문 */}
          <div>
            <SectionLabel icon={<HiDocumentText className="w-4 h-4" />} label="학술 논문" />
            <div className="flex flex-col gap-3">
              {papers.map((p) => (
                <div
                  key={p.name}
                  className="flex items-start gap-4 bg-stone-50 border border-stone-200 rounded-xl px-5 py-4"
                >
                  <HiDocumentText className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 text-sm leading-snug">{p.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{p.org}</p>
                  </div>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-xs font-semibold text-amber-600 hover:text-amber-700 border border-amber-200 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    PDF →
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
