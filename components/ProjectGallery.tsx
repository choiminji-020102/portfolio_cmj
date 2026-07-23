"use client";

import Image from "next/image";
import { useState } from "react";

/*
  min-hyuk 스타일 스크린샷 캐러셀 — 중앙 이미지 강조, 좌우 화살표로 이동.
  이미지가 없으면 플레이스홀더 한 장을 보여준다.
*/
export default function ProjectGallery({
  screenshots,
  title,
  track,
}: {
  screenshots: string[];
  title: string;
  track: string;
}) {
  const [index, setIndex] = useState(0);

  if (screenshots.length === 0) {
    return (
      <div className="relative aspect-[16/9] rounded-2xl border border-line overflow-hidden bg-gradient-to-br from-tide/12 to-deep/8 flex flex-col items-center justify-center gap-2">
        <span className="rail text-tide">{track}</span>
        <span className="rail text-muted/60 text-[0.6875rem]">
          스크린샷 준비 중
        </span>
      </div>
    );
  }

  const prev = () =>
    setIndex((i) => (i - 1 + screenshots.length) % screenshots.length);
  const next = () => setIndex((i) => (i + 1) % screenshots.length);

  return (
    <div className="relative">
      <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl border border-line overflow-hidden bg-gradient-to-br from-tide/8 to-deep/5">
        <Image
          key={screenshots[index]}
          src={screenshots[index]}
          alt={`${title} 스크린샷 ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-contain py-4"
          priority={index === 0}
        />
      </div>

      {screenshots.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="이전 스크린샷"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/90 border border-line shadow-sm flex items-center justify-center text-ink hover:bg-surface transition-colors"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            onClick={next}
            aria-label="다음 스크린샷"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface/90 border border-line shadow-sm flex items-center justify-center text-ink hover:bg-surface transition-colors"
          >
            <span aria-hidden="true">→</span>
          </button>

          {/* 인디케이터 */}
          <div className="mt-4 flex justify-center gap-2">
            {screenshots.map((s, i) => (
              <button
                key={s}
                onClick={() => setIndex(i)}
                aria-label={`스크린샷 ${i + 1}로 이동`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-tide" : "w-1.5 bg-line"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
