"use client";

import { useState } from "react";
import Image from "next/image";
import type { TroubleBlock, TroubleDetail } from "@/lib/projectDetails";
import CodeBlock from "./CodeBlock";
import SodamDrawer from "./SodamDrawer";

/* 긴 heading은 부제를 떼고 탭 라벨로 쓴다 — "성능 최적화 — 피처 선정" → "성능 최적화" */
function tabLabel(heading: string) {
  return heading.split(" — ")[0];
}

function Block({ blk }: { blk: TroubleBlock }) {
  if (blk.type === "sub")
    return (
      <p className="mt-7 border-l-2 border-tide/60 pl-2.5 text-[0.85rem] font-semibold text-ink first:mt-0">
        {blk.text}
      </p>
    );

  if (blk.type === "text")
    return (
      <p className="text-[0.85rem] leading-relaxed text-muted">{blk.text}</p>
    );

  if (blk.type === "list")
    return (
      <ul className="space-y-1">
        {blk.items.map((it, ii) => (
          <li
            key={ii}
            className="relative pl-4 text-[0.85rem] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-tide"
          >
            {it}
          </li>
        ))}
      </ul>
    );

  if (blk.type === "code")
    return <CodeBlock code={blk.code} lang={blk.lang} />;

  /* 설명 위 · 그래프 아래 가로 전체 폭 (원본 해상도보다 크게는 늘리지 않는다) */
  if (blk.type === "split")
    return (
      <div className="space-y-2.5">
        <p className="text-[0.85rem] leading-relaxed text-muted">{blk.text}</p>
        <figure>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            {blk.images.map((im) => (
              <Image
                key={im.src}
                src={im.src}
                alt={im.alt}
                width={im.width}
                height={im.height}
                style={{ maxWidth: im.width }}
                className="h-auto w-full min-w-0 flex-1 rounded-lg border border-line bg-white"
              />
            ))}
          </div>
          {blk.caption && (
            <figcaption className="mt-1.5 text-[0.72rem] leading-snug text-muted">
              {blk.caption}
            </figcaption>
          )}
        </figure>
      </div>
    );

  if (blk.type === "table")
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[0.8rem]">
          <thead>
            <tr>
              {blk.head.map((h) => (
                <th
                  key={h}
                  className="border border-line bg-surface px-2.5 py-1.5 text-left font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blk.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`border border-line px-2.5 py-1.5 align-top ${
                      ci === 0 ? "font-medium text-ink" : "text-muted"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

  return null;
}

export default function TroubleDetails({
  title,
  eyebrow,
  details,
  tech,
}: {
  title: string;
  eyebrow?: string;
  details: TroubleDetail[];
  tech?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const current = details[active];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rail ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-tide/50 bg-tide/8 px-3.5 py-1.5 font-semibold text-deep transition-colors hover:border-tide hover:bg-tide/15"
      >
        자세히 보기
        <span aria-hidden="true">→</span>
      </button>

      <SodamDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        eyebrow={eyebrow}
      >
        {/* 기술 스택 — 항목 전체에 걸리는 값이라 탭 바깥에 둔다 */}
        {tech && tech.length > 0 && (
          <p className="rail border-b border-line px-6 py-3 text-muted sm:px-8">
            <span className="font-semibold text-ink">기술 스택</span>
            &nbsp;&nbsp;{tech.join(" · ")}
          </p>
        )}

        {/* 섹션 탭 — 스크롤해도 상단에 고정 */}
        <div className="sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-line bg-ground/95 px-4 pt-2 backdrop-blur-sm sm:px-6">
          {details.map((d, i) => (
            <button
              key={d.heading}
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active ? "true" : undefined}
              className={`rail shrink-0 whitespace-nowrap border-b-2 px-3 pb-2 pt-1 transition-colors ${
                i === active
                  ? "border-tide font-semibold text-deep"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {tabLabel(d.heading)}
            </button>
          ))}
        </div>

        <div className="px-6 py-6 sm:px-8">
          <p className="text-[0.95rem] font-bold tracking-tight text-deep">
            {current.heading}
          </p>
          {/* 서랍 본문 — 코드·표가 문단 사이에 끼므로 문단 간격보다 조금 넓게 */}
          <div className="mt-4 space-y-4">
            {current.blocks.map((blk, bi) => (
              <Block key={bi} blk={blk} />
            ))}
          </div>
        </div>
      </SodamDrawer>
    </>
  );
}
