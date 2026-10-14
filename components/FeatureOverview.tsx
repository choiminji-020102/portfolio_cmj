import { Fragment } from "react";
import type { LightProject } from "@/lib/projectDetails";
import { sectionTitle } from "@/lib/ui";

/*
  기능 소개 - 발표자료 "기능 한눈에 보기" 슬라이드를 따른다.
  왼쪽 = 플랫폼 연동, 오른쪽 = AI 생성(Content → Trend → Post → HashTag).
  문구의 **굵게** 는 슬라이드의 강조 부분이다.
*/

type Data = NonNullable<LightProject["featureOverview"]>;

function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("**").map((part, i) =>
        i % 2 ? (
          <strong key={i} className="font-bold text-ink">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-6 w-6 shrink-0 text-deep"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 12.5l3 3 5-6.5" />
    </svg>
  );
}

function DownArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 20"
      className="mx-auto my-1 h-5 w-6 text-tide"
    >
      <path d="M8 0h8v9h5l-9 11-9-11h5z" fill="currentColor" />
    </svg>
  );
}

function Logos() {
  return (
    <div className="mt-6 flex items-center justify-center gap-3" aria-label="YouTube, Instagram, Facebook">
      <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden="true">
        <rect x="2" y="9" width="44" height="30" rx="9" fill="#e8312a" />
        <path d="M20 17l11 7-11 7z" fill="#fff" />
      </svg>
      <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden="true">
        <defs>
          <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#fdc468" />
            <stop offset="0.45" stopColor="#e1306c" />
            <stop offset="1" stopColor="#5b51d8" />
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="12" fill="url(#ig)" />
        <rect x="12" y="12" width="24" height="24" rx="7" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="24" cy="24" r="6" fill="none" stroke="#fff" strokeWidth="3" />
        <circle cx="31.5" cy="16.5" r="1.8" fill="#fff" />
      </svg>
      <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden="true">
        <circle cx="24" cy="24" r="21" fill="#4267b2" />
        <path
          d="M26 40V27h4.5l.8-5H26v-3c0-1.5.7-2.5 2.6-2.5h2.8V12c-.5-.1-2.2-.3-4-.3-4 0-6.4 2.4-6.4 6.5V22H16v5h5v13z"
          fill="#fff"
        />
      </svg>
    </div>
  );
}

function Heading({ no, tone, children }: { no: string; tone: string; children: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${tone}`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink bg-surface text-sm font-semibold text-ink">
        {no}
      </span>
      <p className="break-keep text-base font-semibold text-ink">{children}</p>
    </div>
  );
}

export default function FeatureOverview({ data }: { data: Data }) {
  const { left, right } = data;
  return (
    <section className="mt-16">
      <h2 className={sectionTitle}>{data.label}</h2>
      <div className="mt-5">
        <p className="text-lg font-semibold tracking-tight text-ink">
          {data.title}
        </p>
        <p className="mt-1 break-keep text-[0.95rem] text-muted">
          {data.subtitle}
        </p>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-0">
        {/* 1 - 플랫폼 연동 */}
        <div className="md:pr-8">
          <Heading no="1" tone="bg-deep/10">
            {left.heading}
          </Heading>
          <ul className="mt-5 space-y-5">
            {left.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check />
                <p className="whitespace-pre-line break-keep text-[0.95rem] leading-relaxed text-muted">
                  <Rich text={item} />
                </p>
              </li>
            ))}
          </ul>
          <Logos />
        </div>

        {/* 2 - AI 생성 */}
        <div className="min-w-0 md:border-l md:border-dashed md:border-line md:pl-8">
          <Heading no="2" tone="bg-tide/12">
            {right.heading}
          </Heading>
          <div className="mx-auto h-4 w-px bg-ink/60" aria-hidden="true" />
          <div className="flex justify-center">
            <span className="rounded-lg border-2 border-deep px-4 py-1.5 text-center text-[0.95rem] font-bold text-ink">
              {right.badge}
            </span>
          </div>
          <ol className="mt-4">
            {right.steps.map((step, i) => (
              <li key={step.key}>
                {i > 0 && <DownArrow />}
                <div className="flex items-start gap-3">
                  <Check />
                  <p className="break-keep text-[0.95rem] leading-relaxed text-muted">
                    <strong className="font-bold text-ink">{step.key}</strong>
                    {" : "}
                    <Rich text={step.text} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
