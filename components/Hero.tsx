/*
  배치는 min-hyuk 방식(좌 이름 + 우 정보 블록)을 따르되 색·서체는 우리 것.
  이름 위 세그멘테이션 마스크가 시그니처 — 로드 시 계단형 윤곽이 그려지고 채워진다.
  CSS 애니메이션만 쓴다. reduced-motion 은 globals.css 에서 즉시 완료 처리.
*/

import Image from "next/image";

// 픽셀 마스크의 계단형 경계 (직각). 둥글게 감싸면 형광펜처럼 읽혀서 각지게.
const CONTOUR =
  "1,80 1,62 4,62 4,44 7,44 7,28 12,28 12,16 22,16 22,9 38,9 38,14 54,14 54,7 72,7 72,12 86,12 86,6 95,6 95,20 98,20 98,40 96,40 96,60 99,60 99,78 95,78 95,88 88,88 88,94 70,94 70,89 52,89 52,95 34,95 34,89 16,89 16,94 6,94 6,86 1,86";

const FOCUS = ["PyTorch", "FastAPI", "React", "TypeScript"];

export default function Hero() {
  return (
    <section id="hero" className="px-6 pt-36 pb-24 sm:pt-44 sm:pb-32">
      <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-start">
        {/* 왼쪽 — 이름과 소개 */}
        <div>
          <p className="eyebrow mb-6">Portfolio / 2026</p>

          <div className="relative inline-block px-7 py-5 sm:px-9 sm:py-6">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon
                points={CONTOUR}
                className="mask-fill"
                fill="var(--tide)"
              />
              <polygon
                points={CONTOUR}
                className="mask-line"
                fill="none"
                stroke="var(--tide)"
                strokeWidth="2"
                strokeLinejoin="miter"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <h1 className="relative text-[3.5rem] sm:text-7xl font-bold tracking-tight leading-none">
              최민지
            </h1>
          </div>

          <p className="mt-8 text-lg sm:text-xl font-semibold">
            경계를 정하는 일을 합니다.
          </p>
          <p className="mt-4 text-[0.95rem] sm:text-base leading-relaxed text-muted max-w-md">
            초음파 영상에서는 병변의 윤곽을, 구독 관리 시스템에서는 같은 주소로
            묶을 기준을 정해왔습니다. 모호한 것에 선을 긋고 왜 거기인지 설명할 수
            있는 개발자입니다.
          </p>
        </div>

        {/* 오른쪽 — 프로필 사진 + 요약 정보 블록 */}
        <div className="flex flex-col gap-8 md:items-end">
          {/* 프로필 사진 — 세로 카드에 청록 하단 강조 바 */}
          <div className="relative w-40 sm:w-44 shrink-0">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line shadow-[0_8px_24px_-12px_rgba(26,19,47,0.2)]">
              <Image
                src="/profile.jpg"
                alt="최민지 프로필 사진"
                fill
                sizes="176px"
                className="object-cover object-top"
                priority
              />
            </div>
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-5 right-5 h-[3px] rounded-full bg-tide"
            />
          </div>

          <dl className="rail space-y-6 md:text-right md:min-w-[13rem]">
            <div>
              <dt className="text-muted mb-1.5">FIELD</dt>
              <dd className="text-ink text-sm">AI · 의료영상 / 풀스택</dd>
            </div>
          <div>
            <dt className="text-muted mb-1.5">EDUCATION</dt>
            <dd className="text-ink text-sm">한림대 인공지능융합학부</dd>
            <dd className="text-muted">2025.02 졸업</dd>
          </div>
          <div>
            <dt className="text-muted mb-2">FOCUS</dt>
            <dd className="flex flex-wrap gap-1.5 md:justify-end">
              {FOCUS.map((item) => (
                <span
                  key={item}
                  className="border border-line rounded-md px-2 py-0.5 text-ink/75"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
          </dl>
        </div>
      </div>

      <style>{`
        .mask-line {
          stroke-dasharray: 420;
          stroke-dashoffset: 420;
          animation: contour-draw 1.5s cubic-bezier(0.65, 0, 0.35, 1) 0.2s forwards;
        }
        .mask-fill {
          fill-opacity: 0;
          animation: mask-in 0.7s ease-out 1.4s forwards;
        }
        @keyframes contour-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes mask-in {
          to { fill-opacity: 0.38; }
        }
      `}</style>
    </section>
  );
}
