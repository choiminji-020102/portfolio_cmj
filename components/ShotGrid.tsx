"use client";

import { useCallback, useEffect, useState } from "react";
import type { Screenshot } from "@/lib/projects";

/*
  전/후 캡처 격자 — 누르면 원본 크기로 펼친다.
  격자 크기로는 화면 캡처 안의 글자가 읽히지 않는다.

  배치가 둘이다.
  - "row"     : 장수만큼 한 줄로 늘어놓는다. 기능 카드(개선 전/후)가 쓴다.
  - "compare" : 전/후를 두 열로 갈라 세로로 쌓는다. 트러블 슈팅(증상/해결 후)이 쓴다.
                한쪽이 여러 장이면 그 열을 좁혀 반대쪽 열과 높이를 맞춘다 — 증상 한 장과
                해결 후 두 장의 밑선이 어긋나면 대조가 되지 않기 때문이다.
                캡처는 어떤 경우에도 자르지 않는다.

  덮개의 동작 규칙(Esc·배경 클릭·스크롤 잠금·닫기 버튼)은 ShowcaseGallery 와 같게 맞췄다.
  다른 점은 이쪽 캡처에 원본 크기 정보가 없어 next/image 대신 그대로 싣는다는 것뿐이다.

  본문은 서버 쪽(ProjectFeatureCard·ChallengeSection)이 그대로 들고 있고,
  상호작용이 필요한 캡처 격자만 여기로 떼어냈다.
*/

/* 캡처 장수에 맞춰 열을 잡는다. Tailwind 가 클래스명을 정적으로 훑으므로
   `sm:grid-cols-${n}` 처럼 조립하지 않고 완성된 문자열을 고른다 */
function shotCols(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1 sm:grid-cols-3";
}

export default function ShotGrid({
  shots,
  labels = { before: "개선 전", after: "개선 후" },
  layout = "row",
}: {
  shots: Screenshot[];
  labels?: { before: string; after: string };
  layout?: "row" | "compare";
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const open = openIndex !== null ? shots[openIndex] : null;

  const close = useCallback(() => setOpenIndex(null), []);

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

  /* 한 장을 그리는 부분 — 두 배치가 공유한다.
     fill — 이 칸이 반대쪽 열 높이에 맞춰 늘어나야 하는 경우 */
  const shot = (s: Screenshot, fill: boolean) => (
    <figure
      key={s.src}
      className={`flex flex-col overflow-hidden rounded-xl border border-line bg-ground/60 ${
        fill ? "min-h-0 flex-1" : ""
      }`}
    >
      <p
        className={`rail shrink-0 border-b border-line px-3 py-2 ${
          s.type === "before" ? "text-muted" : "text-tide"
        }`}
      >
        {s.type === "before" ? labels.before : labels.after}
      </p>
      <button
        type="button"
        onClick={() => setOpenIndex(shots.indexOf(s))}
        aria-label={`${s.caption} 크게 보기`}
        className={`block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-tide ${
          fill ? "min-h-0 flex-1 overflow-hidden" : ""
        }`}
      >
        {/* 캡처 원본 크기를 모르므로 next/image 대신 그대로 싣는다 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={s.src}
          alt={s.caption}
          loading="lazy"
          /* max-w-full — 큰 캡처는 칸에 맞춰 줄이고, 잘라낸 작은 캡처는
             원본 크기 그대로 둔다 (w-full 이면 늘어나 뭉개진다).
             fill 이면 주어진 칸 안에 통째로 들어가게 맞춘다 — object-contain 이라
             어느 쪽도 잘리지 않고, 남는 자리는 여백으로 둔다 */
          className={`mx-auto block max-w-full ${
            fill ? "sm:h-full sm:w-full sm:object-contain" : ""
          }`}
        />
      </button>
      {/* mt-auto — 캡션 길이가 제각각이라 아래로 밀어야 카드 밑선이 맞는다 */}
      <figcaption className="rail mt-auto shrink-0 border-t border-line px-3 py-2.5 text-muted">
        {s.caption}
      </figcaption>
    </figure>
  );

  /* compare — 전/후를 열로 가른다. 한 장짜리 열이 높이 기준이 되고,
     여러 장인 열은 그 높이 안에 나눠 담긴다 (기준 삼을 열이 없으면 그냥 쌓는다) */
  const groups = (["before", "after"] as const)
    .map((type) => ({ type, list: shots.filter((s) => s.type === type) }))
    .filter((g) => g.list.length > 0);
  const hasAnchor = groups.some((g) => g.list.length === 1);

  /* 장수가 다르면 열 너비를 다르게 준다. 캡처를 자르지 않기로 했으므로 두 열의
     높이를 맞출 수 있는 손잡이는 폭뿐이다 — 여러 장인 쪽을 좁히면 장당 높이가
     줄어 합계가 한 장짜리 열과 맞는다. 1.9 는 이 캡처들의 가로세로비(약 1.7:1)에서
     1장 대 2장이 같은 높이가 되도록 잡은 값이다 */
  const cols =
    groups.length < 2
      ? "grid-cols-1"
      : groups[0].list.length === 1 && groups[1].list.length > 1
        ? "grid-cols-1 sm:grid-cols-[1.9fr_1fr]"
        : groups[1].list.length === 1 && groups[0].list.length > 1
          ? "grid-cols-1 sm:grid-cols-[1fr_1.9fr]"
          : "grid-cols-1 sm:grid-cols-2";

  return (
    <>
      {layout === "compare" ? (
        <div className={`mt-3 grid gap-4 ${cols}`}>
          {groups.map((g) => {
            const fill = hasAnchor && g.list.length > 1;
            return (
              /* relative + sm:absolute — 채우는 열이 제 높이를 주장하지 않게 해
                 행 높이를 한 장짜리 열이 정하도록 넘긴다. 좁은 화면에선 그냥 쌓는다 */
              <div key={g.type} className={fill ? "relative" : undefined}>
                <div
                  className={`flex flex-col gap-4 ${
                    fill ? "sm:absolute sm:inset-0" : ""
                  }`}
                >
                  {g.list.map((s) => shot(s, fill))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`mt-3 grid gap-4 ${shotCols(shots.length)}`}>
          {shots.map((s) => shot(s, false))}
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.caption}
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

          {/* 격자에서 작게 줄여 둔 캡처를 원본 크기로 펼친다 */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-auto w-full max-w-5xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={open.src}
              alt={open.caption}
              className="mx-auto block max-w-full rounded-lg"
            />
            <p className="rail mt-3 pb-2 text-center text-white/70">
              <span
                className={
                  open.type === "before" ? "text-white/50" : "text-tide"
                }
              >
                {open.type === "before" ? labels.before : labels.after}
              </span>
              {" — "}
              {open.caption}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
