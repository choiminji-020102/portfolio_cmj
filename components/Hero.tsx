import Image from "next/image";

const stats = [
  { label: "Projects", value: "3+" },
  { label: "Certifications", value: "4" },
  { label: "Awards", value: "2" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center px-6 pt-16 bg-stone-50"
    >
      <div className="max-w-5xl mx-auto w-full grid md:grid-cols-[280px_1fr] gap-14 items-center py-20">
        {/* Photo */}
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md mx-auto max-w-[280px]">
          <Image
            src="/profile.jpg"
            alt="Minji Choi"
            fill
            sizes="(max-width: 768px) 80vw, 280px"
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Text */}
        <div>
          <p className="text-amber-600 font-semibold text-sm uppercase tracking-widest mb-4">
            Software Developer
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mb-6 leading-tight tracking-tight">
            안녕하세요,{" "}
            <span className="text-amber-600">최민지</span>입니다.
          </h1>
          <p className="text-stone-600 text-base leading-relaxed mb-3">
            기획부터 배포까지 전 과정을 혼자 담당할 수 있는 풀스택 개발자를 목표로 하고 있습니다.
          </p>
          <p className="text-stone-600 text-base leading-relaxed mb-3">
            실제 운영 환경의 문제를 직접 해결하는 경험을 중요하게 생각합니다.
            현재 월간지 출판사의 구독관리 시스템을 단독으로 기획·개발·운영하고 있습니다.
          </p>
          <p className="text-stone-600 text-base leading-relaxed mb-8">
            <strong className="text-stone-900 font-semibold">한림대학교</strong> 재학 중이며,
            KT AIVLE School, NIPA-Google ML 부트캠프 등을 수료해 AI/ML 역량도 쌓았습니다.
          </p>

          {/* Stats */}
          <div className="flex gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex-1 px-4 py-3 bg-white rounded-xl border border-stone-200 text-center"
              >
                <p className="text-xl font-extrabold text-amber-600">{stat.value}</p>
                <p className="text-stone-500 text-xs font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#projects"
              className="px-7 py-3 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-700 transition-colors text-center"
            >
              Projects 보기
            </a>
            <a
              href="#contact"
              className="px-7 py-3 border border-stone-300 text-stone-700 text-sm font-semibold rounded-xl hover:border-amber-400 hover:text-amber-600 transition-colors text-center"
            >
              연락하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
