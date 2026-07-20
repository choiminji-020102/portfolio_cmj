import Image from "next/image";

const stats = [
  { label: "Projects", value: "3+" },
  { label: "Certifications", value: "4" },
  { label: "Awards", value: "2" },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-2">
            About
          </p>
          <h2 className="text-3xl font-bold text-stone-900">저를 소개합니다</h2>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-14 items-start">
          {/* Photo */}
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
            <Image
              src="/profile.jpg"
              alt="Minji Choi"
              fill
              sizes="(max-width: 768px) 100vw, 280px"
              className="object-cover object-top"
            />
          </div>

          {/* Text + Stats */}
          <div>
            <p className="text-stone-600 text-base leading-relaxed mb-5">
              안녕하세요, <strong className="text-stone-900 font-semibold">최민지</strong>입니다.
              기획부터 배포까지 전 과정을 혼자 담당할 수 있는 풀스택 개발자를 목표로 하고 있습니다.
            </p>
            <p className="text-stone-600 text-base leading-relaxed mb-5">
              실제 운영 환경의 문제를 직접 해결하는 경험을 중요하게 생각합니다.
              현재 월간지 출판사의 구독관리 시스템을 단독으로 기획·개발·운영하고 있습니다.
            </p>
            <p className="text-stone-600 text-base leading-relaxed mb-8">
              <strong className="text-stone-900 font-semibold">한림대학교</strong> 재학 중이며,
              KT AIVLE School, NIPA-Google ML 부트캠프 등을 수료해 AI/ML 역량도 쌓았습니다.
            </p>

            {/* Stats */}
            <div className="flex flex-col gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center justify-between px-6 py-4 bg-stone-50 rounded-xl border border-stone-200"
                >
                  <span className="text-stone-500 text-sm font-medium">{stat.label}</span>
                  <span className="text-2xl font-extrabold text-amber-600">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
