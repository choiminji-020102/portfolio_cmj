/*
  배치는 min-hyuk 방식을 따르되 색·서체는 우리 것으로 커스터마이즈한다.
  - 중앙 정렬 섹션 헤더 (큰 제목 + 부제)
  - 왼쪽 청록 세로선 + 노드 점 + 흰 카드 박스로 각 항목을 덩어리로 묶는다
  - 본문은 진한 잉크색 + 보통 굵기. 흐린 회색·가는 웨이트를 성과 텍스트에 쓰지 않는다.
*/
import type { ReactNode } from "react";

export function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="px-6 py-20 sm:py-28">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-base text-muted">{subtitle}</p>
          )}
        </header>
        <div className="space-y-8">{children}</div>
      </div>
    </section>
  );
}

/* 왼쪽 세로선 + 노드 점 + 카드. 타임라인처럼 연달아 쌓인다. */
export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="relative pl-6 sm:pl-9">
      {/* 세로선 */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-tide"
      />
      {/* 노드 점 */}
      <span
        aria-hidden="true"
        className="absolute left-[-4.5px] top-9 w-[11px] h-[11px] rounded-full bg-tide ring-4 ring-ground"
      />
      <article className="rounded-2xl bg-surface border border-line shadow-[0_1px_2px_rgba(26,19,47,0.04),0_8px_24px_-12px_rgba(26,19,47,0.12)] p-7 sm:p-9">
        {children}
      </article>
    </div>
  );
}

/* 세로선 없는 단순 카드 — 그리드 배치용. 좌측 상단에 청록 강조 바만 남긴다. */
export function PlainCard({ children }: { children: ReactNode }) {
  return (
    <article className="relative h-full flex flex-col rounded-2xl bg-surface border border-line shadow-[0_1px_2px_rgba(26,19,47,0.04),0_8px_24px_-12px_rgba(26,19,47,0.12)] p-7 sm:p-8 transition-shadow hover:shadow-[0_2px_4px_rgba(26,19,47,0.06),0_16px_36px_-16px_rgba(26,19,47,0.2)]">
      <span
        aria-hidden="true"
        className="absolute left-7 sm:left-8 top-0 h-[3px] w-10 rounded-full bg-tide"
      />
      {children}
    </article>
  );
}

/* 카드 머리 — 기관명 + 배지, 역할, 메타 한 줄 */
export function CardHead({
  org,
  badge,
  role,
  meta,
}: {
  org: string;
  badge?: ReactNode;
  role?: string;
  meta?: ReactNode;
}) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h3 className="text-xl font-bold tracking-tight">{org}</h3>
        {badge}
      </div>
      {role && <p className="mt-2 text-[0.95rem] font-medium">{role}</p>}
      {meta && <p className="rail mt-2">{meta}</p>}
    </header>
  );
}

/* "주요 성과" 같은 카드 안 소제목 */
export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mt-7 mb-4 text-sm font-semibold text-muted">{children}</p>
  );
}

export function Points({
  points,
}: {
  points: { text: string; pending?: boolean }[];
}) {
  return (
    <ul className="space-y-3">
      {points.map((point) => (
        <li
          key={point.text}
          className="relative pl-5 text-[0.95rem] leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-deep"
        >
          {point.text}
        </li>
      ))}
    </ul>
  );
}

export function Tags({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rail bg-ground border border-line rounded-md px-2.5 py-1 text-ink/75"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent";
}) {
  const cls =
    tone === "accent"
      ? "bg-tide/15 text-ink border-tide/30"
      : "bg-ground text-muted border-line";
  return (
    <span
      className={`rail rounded-full border px-2.5 py-0.5 ${cls}`}
    >
      {children}
    </span>
  );
}
