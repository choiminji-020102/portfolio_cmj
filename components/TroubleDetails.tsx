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

  if (blk.type === "stats")
    return (
      <dl className="grid grid-cols-2 gap-x-5 sm:grid-cols-4">
        {blk.items.map((item) => (
          <div
            key={item.label}
            className={`min-w-0 border-b border-line py-3 ${item.wide ? "col-span-full" : ""}`}
          >
            <dt className="text-[0.76rem] text-muted">{item.label}</dt>
            <dd className="mt-1 text-[0.9rem] font-semibold leading-snug text-ink">
              {item.value.split("_").map((part, index) => (
                <span key={`${part}-${index}`}>
                  {index > 0 && (
                    <>
                      _<wbr />
                    </>
                  )}
                  {part}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    );

  if (blk.type === "decisions")
    return (
      <ul className="grid gap-2 sm:grid-cols-2">
        {blk.items.map((item) => (
          <li
            key={item.title}
            className="rounded-lg border border-line bg-ground/50 px-3.5 py-3"
          >
            <p className="text-[0.82rem] font-semibold leading-snug text-deep">
              {item.title}
            </p>
            {item.variables && item.variables.length > 0 && (
              <ul className="mt-1.5 flex flex-wrap gap-1">
                {item.variables.map((variable) => (
                  <li
                    key={variable}
                    className="break-words rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[0.68rem] leading-tight text-ink"
                  >
                    {variable}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">
              {item.text}
            </p>
          </li>
        ))}
      </ul>
    );

  if (blk.type === "chips")
    return (
      <div>
        <p className="rail mb-2 text-muted">{blk.label}</p>
        <ul className="flex flex-wrap gap-1.5">
          {blk.items.map((item) => (
            <li
              key={item}
              className="rounded-md border border-tide/30 bg-tide/8 px-2.5 py-1 text-[0.78rem] text-deep"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );

  if (blk.type === "correlation")
    return (
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(15rem,1fr)]">
        <figure className="min-w-0">
          <Image
            src={blk.image.src}
            alt={blk.image.alt}
            width={blk.image.width}
            height={blk.image.height}
            style={{ maxWidth: blk.image.width }}
            className="h-auto w-full rounded-lg border border-line bg-white"
          />
          {blk.caption && (
            <figcaption className="mt-1.5 text-[0.72rem] leading-snug text-muted">
              {blk.caption}
            </figcaption>
          )}
        </figure>
        <div className="space-y-2.5">
          <ul className="space-y-2">
            {blk.findings.map((item) => (
              <li
                key={item.label}
                className="flex items-baseline justify-between gap-3 rounded-lg border border-line bg-ground/50 px-3 py-2"
              >
                <span className="text-[0.78rem] leading-snug text-muted">
                  {item.label}
                </span>
                <span className="rail shrink-0 text-[0.78rem] font-semibold text-deep">
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
          <p className="rounded-lg bg-tide/8 px-3 py-2.5 text-[0.78rem] leading-relaxed text-muted">
            {blk.note}
          </p>
        </div>
      </div>
    );

  if (blk.type === "code")
    return <CodeBlock code={blk.code} lang={blk.lang} />;

  /* 설명과 그래프를 한 묶음으로 배치하고, 비교 그래프는 나란히 보여준다. */
  if (blk.type === "split") {
    const figure = (
      <figure className="min-w-0">
        <div
          className={
            blk.compact && blk.images.length > 1
              ? "grid grid-cols-1 items-start gap-3 sm:grid-cols-2"
              : blk.compact
                ? "flex justify-center"
                : "flex flex-col gap-3 sm:flex-row sm:items-start"
          }
        >
          {blk.images.map((im) => (
            <a
              key={im.src}
              href={im.src}
              target="_blank"
              rel="noreferrer"
              aria-label={`${im.alt} 원본 크기로 열기`}
              className={`block min-w-0 ${blk.compact ? "cursor-zoom-in" : "flex-1"} ${blk.compact && blk.images.length === 1 ? "w-full max-w-[520px]" : ""}`}
            >
              <Image
                src={im.src}
                alt={im.alt}
                width={im.width}
                height={im.height}
                style={{ maxWidth: blk.compact ? undefined : im.width }}
                className={`h-auto w-full rounded-lg border border-line bg-white ${blk.compact ? "max-h-[320px] object-contain" : ""}`}
              />
            </a>
          ))}
        </div>
        {blk.caption && (
          <figcaption className="mt-1.5 text-[0.72rem] leading-snug text-muted">
            {blk.caption}
          </figcaption>
        )}
      </figure>
    );

    if (blk.compact && blk.images.length === 1)
      return (
        <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
          <p className="text-[0.85rem] leading-relaxed text-muted">{blk.text}</p>
          {figure}
        </div>
      );

    return (
      <div className="space-y-2.5">
        <p className="text-[0.85rem] leading-relaxed text-muted">{blk.text}</p>
        {figure}
      </div>
    );
  }

  /* 이미지가 없으면 값 막대를 표 행 안에 그려 표와 그래프를 하나로 합치고, 해석은 오른쪽에 나란히 둔다. */
  if (blk.type === "importance" && !blk.image) {
    const values = blk.rows.map((row) => parseFloat(row[1].replace(/[^0-9.]/g, "")) || 0);
    const max = Math.max(...values, 0);
    const th = "border border-line bg-tide/8 px-2 py-1 text-left font-semibold";
    return (
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <div className="min-w-0 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-[0.74rem] leading-tight">
            <colgroup>
              <col className="w-[34%]" />
              <col className="w-[40%]" />
              <col className="w-[26%]" />
            </colgroup>
            <thead>
              <tr>
                <th className={th}>{blk.head[0]}</th>
                <th className={th}>{blk.head[1]}</th>
                <th className={th}>값</th>
              </tr>
            </thead>
            <tbody>
              {blk.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="break-words border border-line px-2 py-1 align-middle font-medium text-ink">
                    {row[0]}
                  </td>
                  <td className="border border-line px-2 py-1 align-middle">
                    <div
                      role="img"
                      aria-label={`${row[0]} 중요도 ${row[1]}`}
                      className="h-1.5 rounded-sm bg-tide"
                      style={{ width: `${max ? (values[rowIndex] / max) * 100 : 0}%` }}
                    />
                  </td>
                  <td className="whitespace-nowrap border border-line px-2 py-1 align-middle text-muted">
                    {row[1]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2">
          <p className="text-[0.85rem] leading-relaxed text-muted">{blk.text}</p>
          {blk.caption && (
            <p className="text-[0.72rem] leading-snug text-muted">{blk.caption}</p>
          )}
        </div>
      </div>
    );
  }

  if (blk.type === "importance" && blk.image)
    return (
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(17rem,0.8fr)_minmax(22rem,1.2fr)]">
        <div className="min-w-0 overflow-hidden">
          <table className="w-full table-fixed border-collapse text-[0.8rem]">
            <colgroup>
              <col className="w-[68%]" />
              <col className="w-[32%]" />
            </colgroup>
            <thead>
              <tr>
                {blk.head.map((heading, index) => (
                  <th
                    key={`${heading}-${index}`}
                    className="border border-line bg-tide/8 px-2.5 py-1.5 text-left font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blk.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${rowIndex}-${cellIndex}`}
                      className={`border border-line px-2.5 py-1.5 align-top ${
                        cellIndex === 0
                          ? "break-words font-medium text-ink"
                          : "whitespace-nowrap text-muted"
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
        <figure className="min-w-0">
          <a
            href={blk.image.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`${blk.image.alt} 원본 크기로 열기`}
            className="block cursor-zoom-in"
          >
            <Image
              src={blk.image.src}
              alt={blk.image.alt}
              width={blk.image.width}
              height={blk.image.height}
              className="h-auto max-h-[420px] w-full rounded-lg border border-line bg-white object-contain"
            />
          </a>
          <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">
            {blk.text}
          </p>
          {blk.caption && (
            <figcaption className="mt-1.5 text-[0.72rem] leading-snug text-muted">
              {blk.caption}
            </figcaption>
          )}
        </figure>
      </div>
    );

  if (blk.type === "finalFeatures")
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)]">
        <div className="min-w-0">
          <p className="mb-3 text-[0.85rem] leading-relaxed text-muted">
            {blk.rationale}
          </p>
          <table className="w-full max-w-[620px] table-fixed border-collapse text-[0.8rem]">
            <colgroup>
              <col className="w-[68%]" />
              <col className="w-[32%]" />
            </colgroup>
            <thead>
              <tr>
                {blk.head.map((heading, index) => (
                  <th
                    key={`${heading}-${index}`}
                    className="border border-line bg-tide/8 px-2.5 py-1.5 text-left font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blk.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${rowIndex}-${cellIndex}`}
                      className={`border border-line px-2.5 py-1.5 align-top ${
                        cellIndex === 0
                          ? "font-medium text-ink"
                          : "whitespace-nowrap text-muted"
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
        <div className="space-y-3">
          <p className="rounded-lg bg-tide/8 px-3.5 py-3 text-[0.82rem] leading-relaxed text-muted">
            {blk.outcome}
          </p>
          <div className="border-l-2 border-tide/40 pl-3.5">
            <p className="text-[0.82rem] font-semibold text-deep">도메인 해석</p>
            <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">
              {blk.interpretation}
            </p>
          </div>
        </div>
      </div>
    );

  if (blk.type === "codeTable")
    return (
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <CodeBlock code={blk.code} />
        <div className="min-w-0 overflow-x-auto">
          <table className="w-full border-collapse text-[0.8rem]">
            <thead>
              <tr>
                {blk.head.map((heading, index) => (
                  <th
                    key={`${heading}-${index}`}
                    className="whitespace-nowrap border border-line bg-tide/8 px-2.5 py-1.5 text-left font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blk.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${rowIndex}-${cellIndex}`}
                      className={`whitespace-nowrap border border-line px-2.5 py-1.5 ${
                        cellIndex === 0
                          ? "font-medium text-ink"
                          : "text-muted"
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
      </div>
    );

  if (blk.type === "diagnostic")
    return (
      <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <div className="min-w-0 space-y-3">
          <p className="text-[0.85rem] leading-relaxed text-muted">{blk.text}</p>
          <p className="text-[0.85rem] leading-relaxed text-muted">
            {blk.interpretation}
          </p>
          {blk.findingIntro && (
            <p className="text-[0.85rem] leading-relaxed text-muted">
              {blk.findingIntro}
            </p>
          )}
          <ol className="space-y-2">
            {blk.findings.map((finding, index) => (
              <li
                key={finding}
                className="flex items-start gap-2.5 rounded-lg border border-line bg-ground/50 px-3 py-2 text-[0.8rem] leading-relaxed text-muted"
              >
                <span className="rail shrink-0 font-semibold text-tide">
                  {index + 1}.
                </span>
                <span>{finding}</span>
              </li>
            ))}
          </ol>
        </div>
        <figure className="min-w-0">
          <a
            href={blk.image.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`${blk.image.alt} 원본 크기로 열기`}
            className="mx-auto block w-full max-w-[440px] cursor-zoom-in"
          >
            <Image
              src={blk.image.src}
              alt={blk.image.alt}
              width={blk.image.width}
              height={blk.image.height}
              className="h-auto max-h-[370px] w-full rounded-lg border border-line bg-white object-contain"
            />
          </a>
          {blk.caption && (
            <figcaption className="mx-auto mt-1.5 max-w-[440px] text-[0.72rem] leading-snug text-muted">
              {blk.caption}
            </figcaption>
          )}
        </figure>
      </div>
    );

  if (blk.type === "reportFigure")
    return (
      <div className="grid items-start gap-x-5 xl:grid-cols-[minmax(30rem,1.2fr)_minmax(20rem,0.8fr)]">
        <p className="col-span-full mt-7 border-l-2 border-tide/60 pl-2.5 text-[0.85rem] font-semibold text-ink">
          {blk.label}
        </p>
        <div className="mt-4 min-w-0 overflow-x-auto">
          <table className="w-full border-collapse text-[0.74rem]">
            <thead>
              <tr>
                {blk.head.map((heading, index) => (
                  <th
                    key={`${heading}-${index}`}
                    className="whitespace-nowrap border border-line bg-tide/8 px-2.5 py-1.5 text-left font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blk.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${rowIndex}-${cellIndex}`}
                      className={`whitespace-nowrap border border-line px-2.5 py-1.5 ${
                        cellIndex === 0
                          ? "font-medium text-ink"
                          : "text-muted"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 whitespace-pre-line break-keep border-t border-line pt-3 text-[0.85rem] leading-relaxed text-muted">
            {blk.text}
          </p>
        </div>
        <figure className="mt-4 min-w-0">
          <a
            href={blk.image.src}
            target="_blank"
            rel="noreferrer"
            aria-label={`${blk.image.alt} 원본 크기로 열기`}
            className="mx-auto block w-full max-w-[360px] cursor-zoom-in"
          >
            <Image
              src={blk.image.src}
              alt={blk.image.alt}
              width={blk.image.width}
              height={blk.image.height}
              className="h-auto max-h-[300px] w-full rounded-lg border border-line bg-white object-contain"
            />
          </a>
        </figure>
      </div>
    );

  if (blk.type === "table")
    return (
      <div className="overflow-x-auto">
        <table
          className={`w-full border-collapse text-[0.8rem] ${
            blk.columnGroups ? "min-w-[960px]" : ""
          }`}
        >
          <thead>
            {blk.columnGroups ? (
              <>
                <tr>
                  <th
                    rowSpan={2}
                    className="border border-line bg-tide/8 px-2.5 py-1.5 text-left font-semibold align-middle"
                  >
                    {blk.head[0]}
                  </th>
                  {blk.columnGroups.map((group) => (
                    <th
                      key={group.label}
                      colSpan={group.span}
                      className={`border border-line px-2.5 py-1.5 text-center font-semibold ${
                        group.highlight
                          ? "bg-tide/15 text-deep"
                          : "bg-tide/8"
                      }`}
                    >
                      {group.label}
                    </th>
                  ))}
                </tr>
                <tr>
                  {blk.head.slice(1).map((h, index) => {
                    const column = index + 1;
                    const highlighted =
                      blk.highlightRange &&
                      column >= blk.highlightRange[0] &&
                      column <= blk.highlightRange[1];
                    return (
                      <th
                        key={`${h}-${column}`}
                        className={`whitespace-nowrap border border-line px-2.5 py-1.5 text-left font-semibold ${
                          highlighted
                            ? "bg-tide/15 text-deep"
                            : "bg-tide/8"
                        }`}
                      >
                        {h}
                      </th>
                    );
                  })}
                </tr>
              </>
            ) : (
              <tr>
                {blk.head.map((h, ci) => (
                  <th
                    key={`${h}-${ci}`}
                    className={`border border-line px-2.5 py-1.5 text-left font-semibold ${
                      ci === blk.highlightColumn
                        ? "bg-tide/15 text-deep"
                        : "bg-tide/8"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {blk.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`border border-line px-2.5 py-1.5 align-top ${
                      [
                        ri === blk.highlightRow &&
                          "bg-tide/10 font-semibold text-deep",
                        (ci === blk.highlightColumn ||
                          (blk.highlightRange !== undefined &&
                            ci >= blk.highlightRange[0] &&
                            ci <= blk.highlightRange[1])) &&
                          "bg-tide/8 font-semibold text-deep",
                        ri !== blk.highlightRow &&
                          ci !== blk.highlightColumn &&
                          !(blk.highlightRange !== undefined &&
                            ci >= blk.highlightRange[0] &&
                            ci <= blk.highlightRange[1]) &&
                          (ci === 0 ? "font-medium text-ink" : "text-muted"),
                        blk.nowrapData && ci > 0 && "whitespace-nowrap",
                      ]
                        .filter(Boolean)
                        .join(" ")
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

/* 상세 본문 - 서랍(모달) 없이 항목 아래에서 접었다 편다. 기본은 닫힘.
   <details>는 스크립트 없이 동작하고, 닫혀 있어도 본문이 HTML에 있다.
   원래 서랍 형태는 docs/archive/TroubleDetails.original.tsx.bak 에 보관 */
export default function TroubleDetails({
  details,
  tech,
}: {
  details: TroubleDetail[];
  tech?: string[];
}) {
  return (
    <details className="group mt-5 ml-8">
      <summary className="rail inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-tide/50 bg-tide/8 px-3.5 py-1.5 font-semibold text-deep transition-colors hover:border-tide hover:bg-tide/15 [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">자세히 보기</span>
        <span className="hidden group-open:inline">접기</span>
        <span
          aria-hidden="true"
          className="transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>

      <div className="mt-6 border-l-2 border-tide/30 pl-5 sm:pl-6">
        {/* 기술 스택 - 항목 전체에 걸리는 값이라 절 바깥, 맨 위에 둔다 */}
        {tech && tech.length > 0 && (
          <p className="rail text-muted">
            <span className="font-semibold text-ink">기술 스택</span>
            &nbsp;&nbsp;{tech.join(" · ")}
          </p>
        )}

        {details.map((d, i) => (
          <section
            key={d.heading}
            className={i === 0 && !tech?.length ? "" : "mt-9"}
          >
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
    </details>
  );
}
