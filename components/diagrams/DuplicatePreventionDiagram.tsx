function Condition({ text, sub }: { text: string; sub?: string }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-stone-100 last:border-0">
      <span className="mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center flex-shrink-0 font-bold">✓</span>
      <div>
        <span className="text-xs text-stone-700">{text}</span>
        {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DuplicatePreventionDiagram() {
  return (
    <div className="space-y-4 text-sm">
      {/* already_sent_ids 수집 */}
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
        <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
          already_sent_ids 수집 — 발송 완료로 간주하는 조건
        </div>
        <p className="text-xs text-stone-500 mb-3">
          그룹화 함수 진입 전, 이미 처리된 주문 품목 ID를 집합으로 수집합니다. 이 집합에 포함된 품목은 발송 후보에서 제외됩니다.
        </p>
        <div className="flex items-start gap-3">
          <div className="bg-white rounded-xl border border-stone-200 p-3 flex-1 text-center">
            <div className="text-xs font-semibold text-stone-600 mb-1">활성 SendItem이 존재</div>
            <div className="font-mono text-xs text-stone-400">SendItem.cancelled_at IS NULL</div>
          </div>
          <div className="flex items-center self-center text-stone-400 font-light text-lg">OR</div>
          <div className="bg-white rounded-xl border border-stone-200 p-3 flex-1 text-center">
            <div className="text-xs font-semibold text-stone-600 mb-1">종료된 박스에 포함</div>
            <div className="font-mono text-xs text-stone-400">Send.send_status IN<br />(DELIVERED, CANCELLED)</div>
          </div>
        </div>
      </div>

      {/* 단품 vs 정기구독 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-stone-200 p-5 flex flex-col">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">단품 (MONTHLY)</div>
          <p className="text-xs text-stone-400 mb-4">특정 달 잡지를 딱 한 번만 보내는 개념</p>

          <div className="bg-stone-50 rounded-xl p-3 mb-4 flex-1">
            <div className="text-xs font-semibold text-stone-500 mb-2">발송 대상 선별 조건</div>
            <Condition
              text="already_sent_ids에 없음"
              sub="호(issue) 비교 없음 — 어느 호든 이력이 있으면 영구 제외"
            />
          </div>

          <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-center">
            <span className="text-xs font-semibold text-green-700">조건 통과 → 발송 대상</span>
          </div>
          <p className="text-xs text-stone-400 mt-3 leading-relaxed">
            한 번 발송됐으면 <span className="font-semibold text-stone-600">영구 제외</span><br />
            달(호)을 따로 비교할 필요 없음
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 p-5 flex flex-col">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">정기구독 (YEARLY)</div>
          <p className="text-xs text-stone-400 mb-4">매달 보내야 하는 개념</p>

          <div className="bg-stone-50 rounded-xl p-3 mb-4 flex-1">
            <div className="text-xs font-semibold text-stone-500 mb-2">발송 대상 선별 조건 (모두 통과해야 함)</div>
            <Condition
              text="이번 호 발송 이력 없음"
              sub="SendItem.issue == issue 기준 — 지난 달 발송됐어도 이번 달은 다시 대상"
            />
            <Condition
              text="last_send_issue < issue (또는 null)"
              sub="이미 이 호로 발송 처리된 적 없음을 이중 확인"
            />
            <Condition
              text="실효 구독 범위 내"
              sub="final_start ≤ issue ≤ final_end"
            />
            <Condition
              text="이번 호 휴지 없음"
              sub="Pause.pause_issue == issue AND deleted_at IS NULL"
            />
          </div>

          <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-center">
            <span className="text-xs font-semibold text-green-700">4가지 모두 통과 → 발송 대상</span>
          </div>
          <p className="text-xs text-stone-400 mt-3 leading-relaxed">
            <span className="font-semibold text-stone-600">이번 호만</span> 확인<br />
            다음 달에는 다시 발송 대상이 됨
          </p>
        </div>
      </div>

      {/* 순차 위반 검사 */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
          순차 위반 사전 검사 (find_sequence_violations)
        </div>
        <p className="text-xs text-stone-600 mb-3">
          YEARLY 발송 전, 구독 시작 호 ~ 목표 호 직전까지 각 호를 순회합니다. 발송 이력도 없고 휴지도 없는 호를 <span className="font-semibold">누락 호</span>로 판정해 관리자에게 경고합니다.
        </p>
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-stone-600">
            final_start ~ (목표 호 − 1)
          </div>
          <span className="text-stone-400">→</span>
          <div className="bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-stone-600">
            각 호: 발송 이력 확인
          </div>
          <span className="text-stone-400">+</span>
          <div className="bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-stone-600">
            휴지 여부 확인
          </div>
          <span className="text-stone-400">→</span>
          <div className="bg-amber-100 border border-amber-300 rounded-lg px-2.5 py-1.5 text-amber-800 font-semibold">
            둘 다 없으면 누락 호
          </div>
        </div>
        <p className="text-xs text-stone-400 mt-2">누락 호 목록을 UI에 반환 → 관리자가 확인 후 발송 진행 여부 결정</p>
      </div>
    </div>
  );
}
