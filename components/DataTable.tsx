/* 본문 표 — 항목 단위 비교표와 트러블 근거표가 같은 모양을 쓴다.
   서랍(TroubleDetails)에 넣지 않고 읽는 자리에 그대로 편다 */
export default function DataTable({
  head,
  rows,
}: {
  head: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[0.85rem]">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="border border-line bg-ground px-3 py-2 text-left font-semibold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`border border-line px-3 py-2 align-top leading-relaxed ${
                    ci === 0 ? "text-ink" : "text-muted"
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
}
