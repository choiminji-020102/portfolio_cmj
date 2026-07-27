import { Badge } from "./Section";

/* 수상이면 배지 앞에 👑, 아니면 그냥 배지. */

const RANKS = [
  "대상",
  "최우수상",
  "우수상",
  "장려상",
  "금상",
  "은상",
  "동상",
  "우승",
  "특별상",
];

export function isAward(badge?: string): boolean {
  if (!badge) return false;
  const last = badge.split("·").pop()?.trim() ?? "";
  return RANKS.includes(last);
}

export function AwardBadge({ badge }: { badge?: string }) {
  if (!badge) return null;
  return <Badge tone="accent">{isAward(badge) ? `👑 ${badge}` : badge}</Badge>;
}
