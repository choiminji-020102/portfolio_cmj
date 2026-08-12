/*
  경량 신택스 하이라이터.

  외부 패키지를 쓰지 않는 이유 — 코드 블록은 서버 컴포넌트(FeatureCard)와
  클라이언트 컴포넌트(TroubleDetails 서랍) 양쪽에서 렌더된다. shiki 처럼
  async 렌더가 필요한 도구는 후자에서 쓸 수 없어 두 벌이 되어버린다.
  여기서 다루는 언어는 python · java · json 뿐이므로 정규식으로 충분하다.

  lang 을 주지 않으면 토큰을 나누지 않는다 — 코드가 아닌 계산식·출력 예시가
  엉뚱하게 칠해지는 편보다 담백한 편이 낫다.
*/

export type CodeLang = "python" | "java" | "json";

export type TokenKind =
  | "plain"
  | "comment"
  | "string"
  | "keyword"
  | "constant"
  | "number"
  | "type"
  | "func"
  | "param";

export interface Token {
  kind: TokenKind;
  text: string;
}

const PY_KEYWORD =
  "class|def|return|yield|if|elif|else|for|while|in|not|and|or|is|try|except|finally|raise|with|as|import|from|pass|break|continue|global|nonlocal|assert|lambda|await|async|del";
const PY_CONSTANT = "None|True|False|self|cls";
const PY_BUILTIN =
  "str|int|float|bool|list|dict|set|tuple|bytes|len|print|range|open|super|isinstance|getattr|setattr|enumerate|zip|map|filter|sorted|any|all";

const JAVA_KEYWORD =
  "public|private|protected|class|interface|enum|extends|implements|return|new|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package|static|final|abstract|synchronized|instanceof|this|super|void";
const JAVA_CONSTANT = "null|true|false";
const JAVA_BUILTIN =
  "int|long|double|float|boolean|char|byte|short|String|var";

/* 가지 순서 = 우선순위. 주석·문자열을 먼저 잡아야 그 안의 키워드가 새지 않는다.
   각 가지는 캡처 그룹 하나를 쓰고, kinds 의 같은 자리와 짝을 이룬다 */
const RULES: Record<CodeLang, { parts: string[]; kinds: TokenKind[] }> = {
  python: {
    parts: [
      "(#[^\\n]*)",
      '([frbu]{0,2}"""[\\s\\S]*?"""|[frbu]{0,2}\'\'\'[\\s\\S]*?\'\'\'|[frbu]{0,2}"(?:\\\\.|[^"\\\\])*"|[frbu]{0,2}\'(?:\\\\.|[^\'\\\\])*\')',
      `\\b(${PY_KEYWORD})\\b`,
      `\\b(${PY_CONSTANT})\\b`,
      `\\b(${PY_BUILTIN})\\b`,
      "\\b(\\d[\\d_]*(?:\\.\\d+)?)\\b",
      "\\b([A-Z][A-Za-z0-9_]*)\\b",
      "\\b([a-z_][A-Za-z0-9_]*)(?=\\s*=(?!=))", // 키워드 인자·대입 좌변
    ],
    kinds: [
      "comment",
      "string",
      "keyword",
      "constant",
      "type",
      "number",
      "func",
      "param",
    ],
  },
  java: {
    parts: [
      "(//[^\\n]*|/\\*[\\s\\S]*?\\*/)",
      '("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')',
      `\\b(${JAVA_KEYWORD})\\b`,
      `\\b(${JAVA_CONSTANT})\\b`,
      `\\b(${JAVA_BUILTIN})\\b`,
      "\\b(\\d[\\d_]*(?:\\.\\d+)?[LlDdFf]?)\\b",
      "\\b([A-Z][A-Za-z0-9_]*)\\b",
      "\\b([a-z_][A-Za-z0-9_]*)(?=\\s*\\()", // 호출되는 이름
    ],
    kinds: [
      "comment",
      "string",
      "keyword",
      "constant",
      "type",
      "number",
      "func",
      "func",
    ],
  },
  json: {
    parts: [
      "(#[^\\n]*|//[^\\n]*)",
      '("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')',
      "\\b(null|true|false)\\b",
      "\\b(\\d+(?:\\.\\d+)?)\\b",
    ],
    kinds: ["comment", "string", "constant", "number"],
  },
};

export function tokenize(code: string, lang?: CodeLang): Token[] {
  if (!lang) return [{ kind: "plain", text: code }];

  const rule = RULES[lang];
  const rx = new RegExp(rule.parts.join("|"), "g");
  const out: Token[] = [];
  let last = 0;

  for (let m = rx.exec(code); m !== null; m = rx.exec(code)) {
    if (m.index > last) {
      out.push({ kind: "plain", text: code.slice(last, m.index) });
    }
    const gi = m.findIndex((g, i) => i > 0 && g !== undefined);
    out.push({ kind: rule.kinds[gi - 1] ?? "plain", text: m[0] });
    last = m.index + m[0].length;
  }

  if (last < code.length) out.push({ kind: "plain", text: code.slice(last) });
  return out;
}
