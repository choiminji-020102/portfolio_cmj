export default function PauseDesignDiagram() {
  const approaches = [
    {
      label: "방식 A",
      name: "start/end_issue 직접 분할",
      detail: "202605~202607을 제외하려면 나머지 기간을 여러 구간으로 나눠야 함",
      verdict: "탈락",
      verdictColor: "text-red-500",
      bg: "bg-stone-50 border-stone-200",
    },
    {
      label: "방식 B",
      name: "콤마 문자열 저장",
      detail: 'pause_months = "202605,202606,202607" — 달 수 늘수록 파싱 비용 증가, 필터 비효율',
      verdict: "탈락",
      verdictColor: "text-red-500",
      bg: "bg-stone-50 border-stone-200",
    },
    {
      label: "방식 C",
      name: "범위 기반 엔티티 (start ~ end)",
      detail: "비연속 월(5·7·9월)은 범위 1개로 표현 불가 → 결국 여러 행으로 쪼개야 하므로 D와 동일",
      verdict: "탈락",
      verdictColor: "text-red-500",
      bg: "bg-stone-50 border-stone-200",
    },
    {
      label: "방식 D",
      name: "월별 단건 엔티티 (pause_issue)",
      detail: "1행 = 1개월. 비연속도 자연스럽게 표현. 필터는 단순 등호 비교. 재계산은 COUNT만.",
      verdict: "채택",
      verdictColor: "text-green-600",
      bg: "bg-green-50 border-green-200",
    },
  ];

  const tableFields = [
    { col: "pause_id", type: "bigint (PK)", desc: "휴지 고유 ID" },
    { col: "order_item_id", type: "bigint (FK)", desc: "어떤 정기구독에 대한 휴지인지" },
    { col: "pause_issue", type: "varchar(6)", desc: "중단 호 (예: 202605) — 불변 필드" },
    { col: "reason", type: "text, nullable", desc: "고객 요청 사유" },
    { col: "admin_id", type: "bigint (FK)", desc: "처리한 관리자 ID" },
    { col: "is_deleted", type: "boolean", desc: "소프트 삭제 여부" },
    { col: "created_at / updated_at", type: "datetime", desc: "생성·수정 일시" },
    { col: "deleted_at", type: "datetime, nullable", desc: "소프트 삭제 일시" },
  ];

  return (
    <div className="space-y-5 text-sm">
      {/* 4가지 방식 비교 */}
      <div>
        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
          설계 후보 비교
        </div>
        <div className="grid grid-cols-2 gap-2">
          {approaches.map((a) => (
            <div
              key={a.label}
              className={`rounded-2xl border p-4 flex flex-col gap-2 ${a.bg}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-stone-400 mr-2">{a.label}</span>
                  <span className="text-xs font-bold text-stone-700">{a.name}</span>
                </div>
                <span className={`text-xs font-bold ${a.verdictColor}`}>{a.verdict}</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">{a.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* pauses 테이블 */}
      <div>
        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
          pauses 테이블 구조
        </div>
        <div className="rounded-2xl border border-stone-200 overflow-hidden">
          <div className="grid grid-cols-[140px_130px_1fr] text-xs font-bold text-stone-400 uppercase tracking-wider bg-stone-50 border-b border-stone-200">
            <div className="px-4 py-2.5">컬럼명</div>
            <div className="px-4 py-2.5 border-l border-stone-200">타입</div>
            <div className="px-4 py-2.5 border-l border-stone-200">설명</div>
          </div>
          {tableFields.map((f, i) => (
            <div
              key={f.col}
              className={`grid grid-cols-[140px_130px_1fr] text-xs border-b border-stone-100 last:border-0 ${
                f.col === "pause_issue" ? "bg-amber-50" : ""
              }`}
            >
              <div className={`px-4 py-2.5 font-mono ${f.col === "pause_issue" ? "text-amber-700 font-bold" : "text-stone-600"}`}>
                {f.col}
              </div>
              <div className="px-4 py-2.5 border-l border-stone-100 text-stone-400">{f.type}</div>
              <div className="px-4 py-2.5 border-l border-stone-100 text-stone-500">
                {f.desc}
                {f.col === "pause_issue" && (
                  <span className="ml-2 text-amber-600 font-semibold text-xs">← 불변 필드</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 정책 결정 */}
      <div>
        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
          구독 종료 시점 정책
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-green-700">정책 1 — 연장형 (채택)</span>
              <span className="text-xs font-bold text-green-600">✓ 채택</span>
            </div>
            <ul className="space-y-1">
              {["5~7월 3개월 쉬면 202612 → 202703으로 final_end 연장", "쉬는 달은 skip, 뒤에 3달 추가 발송", "매출·계약 기간 유지에 적합"].map((t) => (
                <li key={t} className="flex items-start gap-1.5">
                  <span className="text-green-400 flex-shrink-0 mt-0.5">·</span>
                  <span className="text-xs text-stone-600">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-500">정책 2 — 종료일 유지 (미채택)</span>
              <span className="text-xs text-stone-300 font-bold">✗</span>
            </div>
            <ul className="space-y-1">
              {["12개월 중 3개월은 '미발송' 처리", "별도 연장 없음", "단기 구독·교육자료 구독 등에서 사용"].map((t) => (
                <li key={t} className="flex items-start gap-1.5">
                  <span className="text-stone-300 flex-shrink-0 mt-0.5">·</span>
                  <span className="text-xs text-stone-400">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* final_end 재계산 공식 */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">
          final_subscribe_end_issue 재계산 공식
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            "final_start",
            "+",
            "subscribe_period",
            "+",
            "활성 pause 행 수",
          ].map((t, i) => (
            t === "+" ? (
              <span key={i} className="text-stone-400 text-base font-light">{t}</span>
            ) : (
              <div key={i} className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-sm font-medium text-stone-700">
                {t}
              </div>
            )
          ))}
          <span className="text-stone-400 font-light text-lg">→</span>
          <div className="bg-amber-100 border border-amber-300 rounded-xl px-3 py-2 text-sm font-bold text-amber-800">
            final_end
          </div>
        </div>
        <p className="text-xs text-stone-500 mt-2">
          pause 생성 시 +1개월, 삭제(소프트) 시 −1개월. 연장·단축·기간이동과 동일한 단일 공식 경로를 통과.
        </p>
      </div>
    </div>
  );
}
