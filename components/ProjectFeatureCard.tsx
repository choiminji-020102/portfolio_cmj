import type { Feature, Project } from "@/lib/projects";
import { card } from "@/lib/ui";
import ShotGrid from "./ShotGrid";

/*
  기능 카드 — 본문에 펼쳐 보여준다.
  예전에는 목록을 눌러 서랍을 열어야 내용을 볼 수 있었는데, 기능 7개를 합쳐도
  3천 자 남짓이라 굳이 감출 이유가 없다. 트러블 슈팅도 같은 이유로 본문에 펴 두었고,
  아래 '관련 트러블 슈팅'은 그 자리로 건너뛰는 앵커다.

  다른 프로젝트의 FeatureCard(AiFeature 용)와 같은 시각 언어를 쓰되,
  필드 구성이 달라(설명·핵심 로직·개선 전후) 별도로 둔다.
*/
export default function ProjectFeatureCard({
  feature,
  project,
}: {
  feature: Feature;
  project: Project;
}) {
  const related = feature.relatedChallengeIds
    .map((id) => {
      const i = project.challenges.findIndex((c) => c.id === id);
      return i >= 0 ? { challenge: project.challenges[i], index: i } : null;
    })
    .filter(Boolean) as { challenge: Project["challenges"][0]; index: number }[];


  return (
    <div className={card}>
      <h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        {feature.summary}
      </p>

      <div className="mt-5">
        <p className="rail text-muted">기능 설명</p>
        <p className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* 핵심 로직 — 이 기능의 결론. 트러블 슈팅의 '설계 결정'과 같은 표시 */}
      <div className="mt-5">
        <p className="rail text-muted">핵심 로직</p>
        <p className="mt-2 whitespace-pre-line border-l-2 border-tide/40 pl-4 text-[0.95rem] leading-relaxed">
          {feature.coreLogic}
        </p>
      </div>

      {feature.screenshots && feature.screenshots.length > 0 && (
        <div className="mt-6">
          <p className="rail text-muted">개선 전 / 후 — 누르면 크게 보인다</p>
          {/* 전·후를 한 줄에 나란히 둔다 — 세로로 쌓으면 세로 캡처 한 장이 카드 폭을
              통째로 차지해 비교가 되지 않고 스크롤만 길어진다.
              대신 격자 크기로는 글자가 안 읽히므로 클릭 확대를 붙였다 (ShotGrid) */}
          <ShotGrid shots={feature.screenshots} />
        </div>
      )}

      {/* 이 기능에서 갈라져 나오는 트러블 슈팅 — 아래 본문의 같은 항목으로 내려간다 */}
      {related.length > 0 && (
        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2 border-t border-line pt-4">
          <span className="rail shrink-0 text-muted">관련 트러블 슈팅</span>
          {/* '심화' — 본문이 아니라 더 깊이 들어가는 갈래임을 밝힌다 */}
          <span className="rail order-last ml-auto shrink-0 text-muted">
            심화
          </span>
          {related.map(({ challenge, index }) => (
            <a
              key={challenge.id}
              href={`#trouble-${challenge.id}`}
              className="rail inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-deep transition-colors hover:border-tide hover:bg-tide/10"
            >
              <span className="text-tide">
                {String(index + 1).padStart(2, "0")}
              </span>
              {challenge.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
