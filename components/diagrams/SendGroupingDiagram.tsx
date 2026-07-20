const flows = [
  {
    type: "정기구독",
    badge: "1인 1박스",
    groupKey: "그룹화 없음",
    detail: "우편(비닐 봉투) 발송\n봉투 하나에 책 한 권만 가능",
    filters: ["실효 구독 범위 (final_start ≤ 호 ≤ final_end)", "해당 호 휴지(Pause) 없음", "이미 발송된 이력 없음 (해당 호 기준)", "VIP 슬롯 자동 제외"],
    output: "주문 품목 1개 = 발송 박스 1개",
    color: "stone",
  },
  {
    type: "단품",
    badge: "주소 기준 합포장",
    groupKey: "우편번호 + 수령 주소",
    detail: "택배(종이박스, CJ대한통운) 발송\n같은 주소면 한 박스에 합포장",
    filters: ["이미 발송된 이력 없음 (호 무관 전체)", "VIP 슬롯 자동 제외"],
    output: "같은 주소 품목 → 발송 박스 1개\n수령인 충돌 시 가나다 첫 번째를 대표 채택",
    color: "stone",
  },
  {
    type: "VIP",
    badge: "별도 격리 관리",
    groupKey: "우편번호 + 수령 주소",
    detail: "단체·기관 특수 계약\n정기구독·단품 혼합, 해외 주소 포함",
    filters: ["Address.vip1~vip6 중 해당 슬롯 활성 여부 확인", "슬롯 비활성 시 400 오류"],
    output: "VIP 슬롯별로 합포장\nYEARLY + MONTHLY 혼합 가능",
    color: "amber",
  },
];

export default function SendGroupingDiagram() {
  return (
    <div className="space-y-3 text-sm">
      {/* 입력 */}
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-center">
        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">입력</div>
        <div className="text-sm font-bold text-stone-800">PAID 상태 주문 품목들</div>
        <div className="text-xs text-stone-400 mt-0.5">결제 완료된 OrderItem 전체</div>
      </div>

      {/* VIP 우선 체크 */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-px h-5 bg-stone-300" />
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">① VIP 슬롯 우선 확인</div>
        <p className="text-xs text-stone-600">
          <span className="font-semibold">활성 VIP 슬롯에 해당하는 품목은 VIP 흐름으로 격리</span>하고, 나머지 흐름(정기구독·단품)에서는 자동 제외합니다.
          슬롯이 없으면 필터 조건 자체를 추가하지 않아 불필요한 SQL 조건을 방지합니다.
        </p>
      </div>

      {/* 3종 분기 */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-px h-5 bg-stone-300" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {flows.map((f) => (
          <div
            key={f.type}
            className={`rounded-2xl border p-4 flex flex-col ${
              f.color === "amber"
                ? "border-amber-200 bg-amber-50/40"
                : "border-stone-200 bg-white"
            }`}
          >
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">{f.type}</div>
            <div className="text-sm font-bold text-stone-800 mb-1">{f.badge}</div>
            <p className="text-xs text-stone-500 leading-relaxed whitespace-pre-line mb-3">{f.detail}</p>

            <div className="space-y-1 mb-3 flex-1">
              <div className="text-xs font-semibold text-stone-400 mb-1">필터 조건</div>
              {f.filters.map((filter, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-stone-300 mt-0.5 flex-shrink-0">·</span>
                  <span className="text-xs text-stone-500">{filter}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100">
              <div className="text-xs font-semibold text-stone-400 mb-1">
                그룹화 키: <span className="font-mono text-stone-600">{f.groupKey}</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed whitespace-pre-line">{f.output}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 출력 */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-px h-5 bg-stone-300" />
      </div>
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">② SendGroup 목록 생성 — 3종 모두 동일한 형태</div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {["address_id", "recipient_name / recipient_phone", "country_code / postal_code", "order_items (품목 목록)", "product_kind", "customer_memo"].map((field) => (
            <div key={field} className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-stone-500 text-center">
              {field}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <div className="w-px h-4 bg-stone-300" />
        </div>
        <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
          <div className="text-xs font-bold text-amber-800">③ Send + SendItem 레코드 생성</div>
          <p className="text-xs text-stone-500 mt-0.5">3종 유형 구분 없이 동일한 함수로 일괄 처리</p>
        </div>
      </div>
    </div>
  );
}
