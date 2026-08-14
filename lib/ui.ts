/*
  프로젝트 상세 페이지가 공유하는 클래스 문자열.
  LightProjectView(다맡케팅·소담소담·삼성메디슨)와 월간지 상세가 같은 값을 써야
  통일이 유지되므로, 한쪽만 고쳐 어긋나지 않도록 여기서 한 번만 정의한다.
*/

/** 헤더를 닫는 외부 링크 버튼 — TroubleDetails의 강조 pill과 같은 tide 스타일 */
export const actionButton =
  "rail inline-flex items-center gap-1.5 rounded-full border border-tide/50 bg-tide/8 px-4 py-2 font-semibold text-deep transition-colors hover:border-tide hover:bg-tide/15";

/** 절 제목 — 한글 h2. 작은 영어 대문자 라벨을 쓰지 않는다 */
export const sectionTitle = "text-2xl font-bold tracking-tight";

/*
  리드 문단 — 헤더 요약, 과제 배경, 내가 맡은 역할이 모두 이 하나를 쓴다.
  섹션마다 굵기·색이 달라지면 위계가 아니라 잡음으로 읽힌다.
*/
export const leadText = "text-base leading-relaxed text-ink";

/** 본문 불릿 — 점 색만 바꿔 쓴다 (기본 deep, 강조 tide) */
export const bullet =
  "relative pl-5 text-[0.95rem] leading-relaxed before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full";

/** 카드 — 기능·트러블처럼 한 덩어리로 읽히는 블록 */
export const card = "rounded-2xl bg-surface border border-line p-6 sm:p-7";

/** 스택 태그 칩 */
export const tagChip =
  "rail bg-surface border border-line rounded-md px-2.5 py-1 text-ink/75";

/** 눌러서 상세로 들어가는 카드 — 기능·트러블 목록이 같은 모양을 쓴다 */
export const openCard =
  "group w-full text-left rounded-2xl bg-surface border border-line p-5 transition-colors hover:border-tide hover:bg-tide/8";

/** 본문에서 한 단계 들어올리는 강조 블록 — 설계 결정·핵심 로직처럼 결론에 해당하는 글 */
export const accentBlock = "border-l-2 border-tide/40 pl-4";
