import { Fragment } from "react";
import CodeBlock from "./CodeBlock";
import FlowArrow from "./FlowArrow";

/*
  트렌드 분석 프롬프트 → 모델 → 출력.
  발표자료의 흐름(프롬프트 패널 → 화살표 → 출력)을 따르되 세로로 쌓는다.
  카드 본문 폭이 ~860px 로 고정이라 가로 3열은 흰 박스 안 코드가 계속 줄바꿈됐다.
  프롬프트 패널은 두 박스(요청 정보 | 출력 형식)를 나란히, 출력은 한 줄에 한 키씩 편다.

  프롬프트 문구는 trend_analyzer 의 human 메시지(요청 정보)와
  system 메시지(출력 형식)에서 가져왔다.
*/

const REQUEST_INFO: [string, string][] = [
  ["게시할 콘텐츠", "{content_summary}"],
  ["사용자가 중요하게 생각하는 키워드", "{user_keywords}"],
  ["업로드할 SNS 플랫폼", "{sns_platform}"],
  ["업종", "{business_type}"],
  ["매장 위치", "{location}"],
  ["현재 날짜", "{current_date}"],
];

const OUTPUT_FORMAT = `[출력 형식]
{
    "keywords": ["..."], # 트렌딩 키워드
    "hashtags": ["..."], # 인기 해시태그 (후보)
    "memes": ["..."], # 최신 밈
    "current_issues": ["..."], # 시사 이슈
    "popular_topics": ["..."], # 인기 주제
    "business_trend": ["..."], # 업종 트렌드
    "season_trend": ["..."], # 계절 트렌드
    "location_trend": ["..."] # 지역 트렌드
}`;

const OUTPUT: [string, string[]][] = [
  ["keywords", ["맨투맨", "의류 쇼핑몰", "패션", "젊은 세대", "캐주얼 스타일"]],
  ["hashtags", ["#맨투맨", "#의류쇼핑몰", "#패션스타그램", "#캐주얼패션", "#무신사"]],
  ["memes", ["맨투맨을 입은 유명 연예인 패러디", "편안한 패션을 강조하는 밈"]],
  ["current_issues", ["친환경 패션", "지속 가능한 의류 소비"]],
  ["popular_topics", ["가을 패션 준비", "편안한 홈웨어 스타일"]],
  ["business_trend", ["온라인 쇼핑 증가", "인플루언서 마케팅 활용"]],
  ["season_trend", ["가을 맞이 패션템", "편안하고 따뜻한 의류"]],
  ["location_trend", ["잠실의 패션 이벤트", "서울에서 즐기는 캐주얼 패션"]],
];

export default function TrendPromptDiagram() {
  return (
    <div className="flex flex-col gap-3">
      {/* 프롬프트 */}
      <div className="min-w-0">
        <p className="mb-2 text-[0.95rem] font-semibold text-ink">
          트렌드 분석 프롬프트
        </p>
        <div className="rounded-xl border border-tide/30 bg-tide/10 p-3 sm:p-4">
          {/* 위 줄 = 흰 박스 둘(같은 줄이라 높이가 같다), 아래 줄 = 설명.
              좁은 화면에서는 DOM 순서대로 박스 → 설명 → 박스 → 설명으로 쌓인다 */}
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] sm:grid-rows-[1fr_auto] sm:gap-0">
            <div className="code flex min-w-0 flex-col justify-center rounded-lg border border-line bg-white p-3 text-[0.75rem] leading-relaxed text-[#383a42] sm:col-start-1 sm:row-start-1 sm:mr-4">
              <p className="font-semibold">분석 요청 정보:</p>
              <ul className="mt-1 space-y-0.5">
                {REQUEST_INFO.map(([label, variable]) => (
                  <li key={variable} className="break-keep">
                    - {label}: <span className="text-[#3d8b4a]">{variable}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="min-w-0 break-keep text-[0.85rem] font-semibold leading-snug text-ink sm:col-start-1 sm:row-start-2 sm:mr-4 sm:pt-3">
              현재 날짜·업종·지역·플랫폼 컨텍스트를 프롬프트에 포함하여 요청
            </p>
            <div className="flex min-w-0 sm:col-start-2 sm:row-start-1 sm:border-l sm:border-dashed sm:border-tide/50 sm:pl-4">
              <CodeBlock
                code={OUTPUT_FORMAT}
                lang="json"
                className="flex min-w-0 flex-1 flex-col justify-center p-3! text-[0.72rem]"
              />
            </div>
            <p className="min-w-0 break-keep text-[0.85rem] font-semibold leading-snug text-ink sm:col-start-2 sm:row-start-2 sm:border-l sm:border-dashed sm:border-tide/50 sm:pl-4 sm:pt-3">
              8가지 관점으로 구조화하도록 명시
            </p>
          </div>
        </div>
      </div>

      <FlowArrow label="gpt-4o" />

      {/* 출력 */}
      <div className="min-w-0">
        <p className="mb-2 text-[0.95rem] font-semibold text-ink">
          실행 결과 예시
          <span className="ml-2 text-[0.8rem] font-normal text-muted">
            의류 쇼핑몰 / 서울 잠실 / 8월 · LLM 생성 결과
          </span>
        </p>
        <div className="code rounded-lg border border-line bg-white p-3 text-[0.75rem] leading-relaxed text-[#383a42]">
          <ul className="space-y-1">
            {OUTPUT.map(([key, values]) => (
              <li key={key}>
                &quot;{key}&quot;: <span className="text-[#3d8b4a]">[</span>
                {values.map((v, i) => (
                  <Fragment key={v}>
                    {i > 0 && " "}
                    <span className="whitespace-nowrap text-[#3d8b4a]">
                      &apos;{v}&apos;{i < values.length - 1 ? "," : ""}
                    </span>
                  </Fragment>
                ))}
                <span className="text-[#3d8b4a]">]</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
