"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { LightProject } from "@/lib/projectDetails";

type Showcase = NonNullable<LightProject["showcase"]>;
type Shot = Showcase["shots"][number];

/*
  결과물 캡처 갤러리 — 목록은 작게, 클릭하면 원본 크기로 펼친다.
  페이지 전체를 담은 캡처라 목록 크기로는 화면 속 글자가 읽히지 않는다.

  본문(제목·리드·단서)은 서버 쪽 LightProjectView 가 그대로 들고 있고,
  상호작용이 필요한 캡처 격자만 여기로 떼어냈다.
*/
export default function ShowcaseGallery({ shots }: { shots: Shot[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null ? shots[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);

  /* 2단 배치 — 세로로 긴 캡처를 2번 칸에 혼자 두면 짧은 캡처 여러 장과 높이가 맞는다.
     2번 칸 캡처는 1번 칸에 쌓인 장수만큼 세로로 걸친다
     (Tailwind 가 훑을 수 있도록 클래스는 문자열 그대로 적는다) */
  const twoCol = shots.some((s) => s.column === 2);
  const span =
    shots.filter((s) => s.column !== 2).length >= 3
      ? "lg:row-span-3"
      : "lg:row-span-2";

  // 열려 있는 동안 Esc 로 닫고, 뒤쪽 본문이 같이 스크롤되지 않게 잠근다
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <div
        className={
          twoCol
            ? "mt-8 grid gap-x-6 gap-y-10 lg:grid-cols-2 lg:items-start"
            : "mt-8 space-y-10"
        }
      >
        {shots.map((shot, i) => (
          <figure
            key={shot.src}
            className={
              !twoCol
                ? undefined
                : shot.column === 2
                  ? `lg:col-start-2 lg:row-start-1 ${span}`
                  : "lg:col-start-1"
            }
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`${shot.title} 크게 보기`}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-tide focus:outline-none focus-visible:ring-2 focus-visible:ring-tide"
            >
              <Image
                src={shot.src}
                alt={shot.title}
                width={shot.width}
                height={shot.height}
                sizes={
                  twoCol
                    ? "(max-width: 1024px) 100vw, 500px"
                    : "(max-width: 1024px) 100vw, 1024px"
                }
                className="h-auto w-full"
              />
            </button>
            <figcaption className="mt-3 max-w-2xl">
              <p className="text-[0.95rem] font-semibold leading-snug text-ink">
                {shot.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {shot.desc}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          onClick={close}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-ink/80 p-4 backdrop-blur-sm sm:p-8"
        >
          {/* 닫기 버튼은 배경 클릭과 겹치지 않게 위에 띄운다 */}
          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            className="rail fixed right-4 top-4 z-10 rounded-full border border-white/25 bg-black/40 px-3.5 py-1.5 font-semibold text-white transition-colors hover:bg-black/60 sm:right-6 sm:top-6"
          >
            닫기 ✕
          </button>

          {/* 세로로 긴 캡처는 원본 폭으로 펼치고 덮개 안에서 스크롤해 읽는다 */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-auto w-full"
            style={{ maxWidth: `${open.width}px` }}
          >
            <Image
              src={open.src}
              alt={open.title}
              width={open.width}
              height={open.height}
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="h-auto w-full rounded-lg"
              priority
            />
            <p className="rail mt-3 pb-2 text-center text-white/70">
              {open.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
