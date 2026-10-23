import Image from "next/image";
import type { TroubleBlock, TroubleDetail } from "@/lib/projectDetails";
import CodeBlock from "./CodeBlock";

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

/* 상세 본문 - 서랍(모달) 없이 항목 아래에 모든 절을 그대로 펼친다.
   원래 서랍 형태는 docs/archive/TroubleDetails.original.tsx.bak 에 보관 */
export default function TroubleDetails({
  details,
  tech,
}: {
  details: TroubleDetail[];
  tech?: string[];
}) {
  return (
    <div className="mt-6 ml-8 border-l-2 border-tide/30 pl-5 sm:pl-6">
      {/* 기술 스택 - 항목 전체에 걸리는 값이라 절 바깥, 맨 위에 둔다 */}
      {tech && tech.length > 0 && (
        <p className="rail text-muted">
          <span className="font-semibold text-ink">기술 스택</span>
          &nbsp;&nbsp;{tech.join(" · ")}
        </p>
      )}

      {details.map((d, i) => (
        <section key={d.heading} className={i === 0 && !tech?.length ? "" : "mt-9"}>
          <h5 className="border-b border-line pb-2 text-[0.95rem] font-bold tracking-tight text-deep">
            {d.heading}
          </h5>
          {/* 코드·표가 문단 사이에 끼므로 문단 간격보다 조금 넓게 */}
          <div className="mt-4 space-y-4">
            {d.blocks.map((blk, bi) => (
              <Block key={bi} blk={blk} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
