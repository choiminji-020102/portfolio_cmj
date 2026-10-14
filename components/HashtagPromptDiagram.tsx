import { Fragment } from "react";
import DataTable from "./DataTable";
import FlowArrow from "./FlowArrow";

/*
  해시태그 생성 프롬프트 → 모델 → 플랫폼별 출력.
  트렌드 프롬프트 다이어그램과 같은 흐름(프롬프트 패널 → 화살표 → 출력)을 쓴다.

  프롬프트의 권장 개수·우선순위는 코드 발췌 대신 표로 편다(읽기 쉽다).
  내용은 hashtag_generator 의 system 메시지에서 가져왔다.
  출력은 후처리(# 부착·중복 제거·플랫폼 상한 절단)를 거친 최종 응답이다 -
  모델 자체는 # 없이 쉼표로 구분된 태그만 낸다.
*/

const RULE_HEAD = ["플랫폼", "권장 개수", "우선순위 (중요 → 덜 중요)"];

const RULE_ROWS: string[][] = [
  [
    "Instagram",
    "7~11개",
    "핵심 콘텐츠 키워드 → 세분화/타겟(지역·속성) → 트렌드/인기 → 오리지널/브랜드",
  ],
  [
    "Facebook",
    "2~3개",
    "캠페인/이벤트 → 개인·커뮤니티 → 키워드+지역",
  ],
  [
    "YouTube",
    "3~5개",
    "영상 주제(콘텐츠 타입) → 트렌드/빅키워드(예: #Shorts) → 세분화 타겟 → 브랜드/채널",
  ],
];

const OUTPUT: { platform: string; dot: string; tags: string[] }[] = [
  {
    platform: "Instagram",
    dot: "#e1306c",
    tags: ["#맨투맨", "#의류쇼핑몰", "#패션스타그램", "#캐주얼패션", "#송파구", "#가을패션", "#잠실"],
  },
  {
    platform: "Facebook",
    dot: "#1877f2",
    tags: ["#의류쇼핑몰", "#송파구패션", "#가을패션트렌드"],
  },
  {
    platform: "YouTube",
    dot: "#ff0000",
    tags: ["#맨투맨", "#패션트렌드", "#남성패션", "#캐주얼패션"],
  },
];

export default function HashtagPromptDiagram() {
  return (
    <div className="flex flex-col gap-3">
      {/* 프롬프트 */}
      <div className="min-w-0">
        <p className="mb-2 text-[0.95rem] font-semibold text-ink">
          플랫폼별 생성 정책
        </p>
        <div className="rounded-xl border border-tide/30 bg-tide/10 p-3 sm:p-4">
          <div className="rounded-lg bg-white">
            <DataTable head={RULE_HEAD} rows={RULE_ROWS} />
          </div>
          <p className="mt-3 break-keep text-[0.85rem] font-semibold leading-snug text-ink">
            플랫폼별 권장 개수와 우선순위 규칙을 프롬프트에 명시
          </p>
        </div>
      </div>

      <FlowArrow label="gpt-4o-mini" />

      {/* 출력 */}
      <div className="min-w-0">
        <p className="mb-2 text-[0.95rem] font-semibold text-ink">
          출력
          <span className="ml-2 text-[0.8rem] font-normal text-muted">
            후처리를 거친 최종 응답
          </span>
        </p>
        <ul className="space-y-2">
          {OUTPUT.map(({ platform, dot, tags }) => (
            <li
              key={platform}
              className="grid items-center gap-1.5 rounded-lg border border-line bg-white p-3 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-3"
            >
              <span className="rail inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-0.5 font-semibold text-ink">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: dot }}
                />
                {platform}
              </span>
              <p className="code text-[0.75rem] leading-relaxed text-[#3d8b4a]">
                [
                {tags.map((t, i) => (
                  <Fragment key={t}>
                    {i > 0 && " "}
                    <span className="whitespace-nowrap">
                      &apos;{t}&apos;{i < tags.length - 1 ? "," : ""}
                    </span>
                  </Fragment>
                ))}
                ]
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
