const operations = [
  { name: "구독 연장", periodChange: "+N개월", startChange: "—", endChange: "재계산", note: "" },
  { name: "구독 단축", periodChange: "−N개월", startChange: "—", endChange: "재계산", note: "환불 = 단가 × 잔여 회차" },
  { name: "기간 이동", periodChange: "—", startChange: "변경", endChange: "재계산", note: "start 이동 → end 동일 폭 이동" },
  { name: "휴지 생성", periodChange: "—", startChange: "—", endChange: "재계산", note: "pause_count +1" },
  { name: "휴지 삭제", periodChange: "—", startChange: "—", endChange: "재계산", note: "pause_count −1" },
];

export default function SubscriptionPeriodDiagram() {
  return (
    <div className="space-y-4 text-sm">
      {/* 필드 구조 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">원본 필드 — 불변</div>
          <p className="text-xs text-stone-400 mb-4">주문 생성 시 1회 기록, 이후 절대 변경 불가</p>
          <div className="space-y-2">
            <div className="bg-white rounded-xl p-3 border border-stone-200">
              <div className="font-mono text-xs text-stone-400 mb-0.5">subscribe_start_issue</div>
              <div className="font-bold text-stone-700 text-sm">2024년 1월호</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-stone-200">
              <div className="font-mono text-xs text-stone-400 mb-0.5">subscribe_end_issue</div>
              <div className="font-bold text-stone-700 text-sm">2024년 12월호</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-stone-200">
              <div className="font-mono text-xs text-stone-400 mb-0.5">subscribe_period</div>
              <div className="font-bold text-stone-700 text-sm">12개월</div>
              <div className="text-xs text-stone-400 mt-1">연장·단축 시에만 변경 (독립 입력값)</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">실효 필드 — 가변</div>
          <p className="text-xs text-stone-400 mb-4">모든 변경 작업 후 단일 공식으로 재계산</p>
          <div className="space-y-2">
            <div className="bg-white rounded-xl p-3 border border-amber-100">
              <div className="font-mono text-xs text-stone-400 mb-0.5">final_subscribe_start_issue</div>
              <div className="font-bold text-stone-700 text-sm">2024년 1월호</div>
              <div className="text-xs text-stone-400 mt-1">기간 이동 시에만 변경</div>
            </div>
            <div className="bg-amber-100 rounded-xl p-3 border border-amber-200">
              <div className="font-mono text-xs text-amber-600 mb-0.5">final_subscribe_end_issue</div>
              <div className="font-bold text-amber-800 text-sm">2025년 3월호</div>
              <div className="text-xs text-amber-600 mt-1">파생값 — 항상 재계산으로 결정</div>
            </div>
          </div>
        </div>
      </div>

      {/* 파생값 이유 */}
      <div className="rounded-2xl border border-stone-200 bg-white p-4">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
          final_end를 직접 증감하지 않는 이유 — 같은 기간 범위라도 상태가 다를 수 있음
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
            <div className="text-xs font-semibold text-stone-600 mb-1">케이스 A</div>
            <div className="text-xs text-stone-500 space-y-0.5">
              <div>subscribe_period = <span className="font-mono font-bold text-stone-700">12</span>개월</div>
              <div>활성 휴지 = <span className="font-mono font-bold text-stone-700">2</span>개</div>
              <div className="mt-1 pt-1 border-t border-stone-200">
                단축 단가 = 판매가 ÷ <span className="font-bold text-stone-800">12</span>
              </div>
            </div>
          </div>
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
            <div className="text-xs font-semibold text-stone-600 mb-1">케이스 B</div>
            <div className="text-xs text-stone-500 space-y-0.5">
              <div>subscribe_period = <span className="font-mono font-bold text-stone-700">14</span>개월</div>
              <div>활성 휴지 = <span className="font-mono font-bold text-stone-700">0</span>개</div>
              <div className="mt-1 pt-1 border-t border-stone-200">
                단축 단가 = 판매가 ÷ <span className="font-bold text-stone-800">14</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-stone-400 mt-2">두 케이스는 (final_start, final_end)가 동일하지만 환불 단가가 다름 — final_end만으로는 상태를 구별할 수 없음</p>
      </div>

      {/* 재계산 공식 */}
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
          단일 재계산 공식 — 5가지 작업 모두 이 함수 하나를 통과
        </div>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-700 font-medium text-sm">
            final_start
          </div>
          <span className="text-stone-400">+</span>
          <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-700 font-medium text-sm">
            subscribe_period
          </div>
          <span className="text-stone-400">+</span>
          <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-700 font-medium text-sm">
            활성 휴지 수
          </div>
          <span className="text-stone-400 font-light text-lg">→</span>
          <div className="bg-amber-100 border border-amber-200 rounded-xl px-3 py-2 text-amber-800 font-bold text-sm">
            final_end
          </div>
        </div>

        {/* 작업별 변경 필드 */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-stone-400 border-b border-stone-200">
                <th className="text-left pb-2 font-semibold pr-3">작업</th>
                <th className="text-center pb-2 font-semibold pr-3">subscribe_period</th>
                <th className="text-center pb-2 font-semibold pr-3">final_start</th>
                <th className="text-center pb-2 font-semibold pr-3">final_end</th>
                <th className="text-left pb-2 font-semibold">비고</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op) => (
                <tr key={op.name} className="border-b border-stone-100 last:border-0">
                  <td className="py-2 pr-3 font-semibold text-stone-700">{op.name}</td>
                  <td className={`py-2 pr-3 text-center font-mono ${op.periodChange !== "—" ? "text-amber-700 font-bold" : "text-stone-300"}`}>
                    {op.periodChange}
                  </td>
                  <td className={`py-2 pr-3 text-center font-mono ${op.startChange !== "—" ? "text-amber-700 font-bold" : "text-stone-300"}`}>
                    {op.startChange}
                  </td>
                  <td className="py-2 pr-3 text-center font-mono text-amber-700 font-bold">{op.endChange}</td>
                  <td className="py-2 text-stone-400">{op.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
