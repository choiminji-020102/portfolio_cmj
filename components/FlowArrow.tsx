/*
  프롬프트 → 모델 → 출력 구도에서 두 패널 사이에 놓는 화살표.
  위쪽에 모델 이름 pill 을 얹는다. 트렌드·해시태그 프롬프트 다이어그램이 같이 쓴다.
*/
export default function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-1">
      <span className="rail rounded-full border border-tide/40 bg-white px-2.5 py-0.5 font-semibold text-deep">
        {label}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 40"
        className="h-10 w-6 text-tide"
      >
        <path
          d="M12 2 V34 M4 26 L12 38 L20 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
