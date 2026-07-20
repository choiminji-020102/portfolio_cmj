type CellVariant = "active" | "waiting" | "result" | "skip";

function Cell({ title, sub, variant = "waiting", api }: {
  title: string;
  sub?: string;
  variant?: CellVariant;
  api?: string;
}) {
  const styles: Record<CellVariant, string> = {
    active: "bg-amber-50 border-amber-200",
    waiting: "bg-stone-50 border-stone-200",
    result: "bg-green-50 border-green-200",
    skip: "bg-white border-stone-100",
  };
  const titleColor: Record<CellVariant, string> = {
    active: "text-amber-700",
    waiting: "text-stone-500",
    result: "text-green-700",
    skip: "text-stone-300",
  };

  return (
    <div className={`rounded-xl border p-3 ${styles[variant]}`}>
      {api && (
        <div className="font-mono text-xs text-stone-400 mb-1">{api}</div>
      )}
      <div className={`text-xs font-semibold mb-1 ${titleColor[variant]}`}>{title}</div>
      {sub && <div className="text-xs text-stone-400 leading-relaxed">{sub}</div>}
    </div>
  );
}

export default function Cafe24SyncDiagram() {
  return (
    <div className="text-sm space-y-4">
      {/* 상태 흐름 */}
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Cafe24 주문 상태 흐름</div>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { code: "N20", label: "배송준비중", desc: "주문 직후" },
            { code: "N21", label: "배송대기", desc: "standby 등록 후" },
            { code: "N30", label: "배송중", desc: "발송 완료 후" },
          ].map((s, i, arr) => (
            <div key={s.code} className="flex items-center gap-2">
              <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-center">
                <div className="font-mono text-xs font-bold text-stone-600">{s.code}</div>
                <div className="text-xs text-stone-700 font-medium">{s.label}</div>
                <div className="text-xs text-stone-400">{s.desc}</div>
              </div>
              {i < arr.length - 1 && <span className="text-stone-300 text-base">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 종류별 처리 흐름 */}
      <div>
        <div className="grid grid-cols-[90px_1fr_1fr_1fr] gap-2 mb-2">
          <div />
          {["주문 import", "발송 준비 중", "발송 완료"].map((h) => (
            <div key={h} className="text-center text-xs font-bold text-stone-400 uppercase tracking-wider py-1">
              {h}
            </div>
          ))}
        </div>

        {/* 정기구독 */}
        <div className="grid grid-cols-[90px_1fr_1fr_1fr] gap-2 items-start mb-2">
          <div className="pt-3">
            <div className="text-xs font-bold text-stone-700">정기구독</div>
            <div className="text-xs text-stone-400 mt-0.5">우편 발송</div>
          </div>
          <Cell
            variant="active"
            api="POST /shipments"
            title="N21 배송대기 등록"
            sub="shipping_code 발급·저장. 정기구독 품목 코드 배열로 묶어 1회 호출"
          />
          <Cell
            variant="waiting"
            title="대기 중"
            sub="shipping_code만 DB에 보관"
          />
          <Cell
            variant="result"
            api="PUT /shipments"
            title="N30 배송중 전환"
            sub="첫 발송 시 한 번만. shipping_code만으로 처리 (운송장번호 불필요)"
          />
        </div>

        {/* 단품 */}
        <div className="grid grid-cols-[90px_1fr_1fr_1fr] gap-2 items-start">
          <div className="pt-3">
            <div className="text-xs font-bold text-stone-700">단품</div>
            <div className="text-xs text-stone-400 mt-0.5">택배 발송</div>
          </div>
          <Cell
            variant="skip"
            title="별도 처리 없음"
            sub="N20 상태 유지"
          />
          <Cell
            variant="skip"
            title="대기 중"
            sub="N20 상태 유지"
          />
          <Cell
            variant="result"
            api="POST /shipments"
            title="N30 배송중 신규 등록"
            sub="운송장번호 + 택배사 함께 전송"
          />
        </div>
      </div>

      {/* 설계 포인트 */}
      <div className="space-y-2">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-xs font-bold text-amber-700 mb-1.5">정기구독 import 시점에 미리 N21 등록하는 이유</div>
          <div className="space-y-1.5">
            <p className="text-xs text-stone-600">
              <span className="font-semibold">① 단품과 구분</span> — N20(배송준비중)에 두면 매일 들어오는 단품 주문과 섞여 구분이 안 됩니다. N21로 분리해 두면 Cafe24 관리자 화면에서 정기구독만 필터할 수 있습니다.
            </p>
            <p className="text-xs text-stone-600">
              <span className="font-semibold">② PUT 한 번으로 처리</span> — Cafe24 API 설계 상 N21 진입(POST)에는 택배사·운송장번호가 필수이지만, N21→N30 전환(PUT)에는 shipping_code만 있으면 됩니다. import 시 미리 등록해 두면 발송 완료 시 추가 정보 없이 상태를 올릴 수 있습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="text-xs font-bold text-stone-500 mb-1.5">첫 발송만 PUT (YEARLY)</div>
            <p className="text-xs text-stone-500">
              같은 주문에 매월 Send가 생성되지만 Cafe24 주문은 1개입니다.
              판단 기준: <span className="font-mono">last_send_issue IS NULL</span> — DB flush <span className="font-semibold">전</span> 시점에 확인해야 올바르게 체크됩니다.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="text-xs font-bold text-stone-500 mb-1.5">Rate Limit 대응</div>
            <p className="text-xs text-stone-500">
              MONTHLY POST와 YEARLY PUT이 같은 버킷(40)을 공유합니다. 100건씩 배치 처리 + 배치 간 0.5초 지연으로 버킷 소진을 방지합니다. 429 응답 시 헤더 <span className="font-mono">X-Cafe24-Call-Remain</span> 확인 후 재시도합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
