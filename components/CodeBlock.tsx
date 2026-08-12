import { tokenize, type CodeLang, type TokenKind } from "@/lib/highlight";

/*
  코드 블록 — 흰 바탕에 라이트 하이라이팅.
  본문이 밝은 페이지라 어두운 블록은 그 자리만 도드라진다.

  색은 Atom One Light 계열을 팔레트에 맞춰 살짝 눕힌 값.
  본문 색(--ink)과 겹치지 않게 코드 기본색은 조금 더 중성으로 둔다.
*/
const TOKEN_COLOR: Record<TokenKind, string> = {
  plain: "",
  comment: "text-[#8a8f98]",
  string: "text-[#3d8b4a]",
  keyword: "text-[#9b3ba5]",
  constant: "text-[#0e7490]",
  number: "text-[#9a6a00]",
  type: "text-[#b06000]",
  func: "text-[#2f6fd0]",
  param: "text-[#b06000]",
};

export default function CodeBlock({
  code,
  lang,
  className = "",
}: {
  code: string;
  lang?: CodeLang;
  className?: string;
}) {
  const tokens = tokenize(code, lang);

  return (
    <pre
      className={`code overflow-x-auto rounded-lg border border-line bg-white p-4 text-[0.78rem] leading-relaxed text-[#383a42] ${className}`}
    >
      <code>
        {tokens.map((t, i) =>
          t.kind === "plain" ? (
            t.text
          ) : (
            <span key={i} className={TOKEN_COLOR[t.kind]}>
              {t.text}
            </span>
          )
        )}
      </code>
    </pre>
  );
}
