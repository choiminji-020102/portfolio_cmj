/*
  배치는 min-hyuk 방식(좌 이름 + 우 정보 블록)을 따르되 색·서체는 우리 것.
  이름 위 세그멘테이션 마스크가 시그니처 — 로드 시 계단형 윤곽이 그려지고 채워진다.
  CSS 애니메이션만 쓴다. reduced-motion 은 globals.css 에서 즉시 완료 처리.
*/

import Image from "next/image";
import { contact } from "@/lib/profile";
import GitHubIcon from "./GitHubIcon";

// 픽셀 마스크의 계단형 경계 (직각). 둥글게 감싸면 형광펜처럼 읽혀서 각지게.
const CONTOUR =
  "1,80 1,62 4,62 4,44 7,44 7,28 12,28 12,16 22,16 22,9 38,9 38,14 54,14 54,7 72,7 72,12 86,12 86,6 95,6 95,20 98,20 98,40 96,40 96,60 99,60 99,78 95,78 95,88 88,88 88,94 70,94 70,89 52,89 52,95 34,95 34,89 16,89 16,94 6,94 6,86 1,86";

export default function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-screen items-center px-6 pt-16 pb-16"
    >
      <div className="max-w-5xl mx-auto grid w-full gap-8 md:grid-cols-[auto_1fr] md:items-stretch md:gap-16">
        {/* 왼쪽 — 이름과 사진 */}
        <div>
          <p className="eyebrow mb-5">Portfolio / 2026</p>

          <div className="relative inline-block px-4 py-3 sm:px-5 sm:py-3.5">
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

            <h1 className="relative text-4xl sm:text-5xl font-bold tracking-tight leading-none">
              최민지
            </h1>
          </div>

          <div className="relative w-36 sm:w-40 shrink-0 mt-7">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line shadow-[0_8px_24px_-12px_rgba(26,19,47,0.2)]">
              <Image
                src="/profile.jpg"
                alt="최민지 프로필 사진"
                fill
                sizes="160px"
                className="object-cover object-top"
                priority
              />
            </div>
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-5 right-5 h-[3px] rounded-full bg-tide"
            />
          </div>
        </div>

        {/* 오른쪽 — 소개 */}
        <div className="flex min-w-0 flex-col items-start md:h-full md:justify-center">
          <p className="text-[0.95rem] sm:text-base leading-relaxed max-w-2xl">
            <span className="text-muted">
              AI로 인해 기술은 빠르게 평준화되고 있습니다. 결국 남는 건 그
              앞에 선 사람이라고 생각합니다. 저는 질문이 많은 편입니다. 왜
              이게 필요한지, 왜 지금까지는 이렇게 해왔는지 묻다 보면 진짜
              문제는 늘 나중에 보였습니다.{" "}
            </span>
            <span className="text-ink font-medium">
              빨리 만드는 사람보다, 오래 남을 것을 아는 사람이 되고
              싶습니다.
            </span>
          </p>

          {/* 소개를 읽고 바로 코드로 넘어갈 수 있게 — 상단바 아이콘과 같은 곳을 가리킨다 */}
          <a
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            className="rail mt-6 inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-semibold text-ink transition-colors hover:border-tide hover:bg-tide/8"
          >
            <GitHubIcon className="h-4 w-4" />
            github.com/choiminji-020102
            <span aria-hidden="true" className="text-tide">
              ↗
            </span>
          </a>
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
