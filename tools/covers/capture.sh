#!/bin/bash
#
# 커버 템플릿(*.html)을 public/covers/*.png 로 캡처한다.
#
#   ./capture.sh              전체
#   ./capture.sh sodam        하나만
#
# 2x(2560×1280)로 찍고 1280 폭으로 줄인다 — 다운샘플링이 1x 렌더보다 선명하다.
# 별도 설치 없이 로컬 Chrome 의 headless 모드를 쓴다.

set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../../public/covers"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

[ -x "$CHROME" ] || { echo "Chrome 을 찾을 수 없습니다: $CHROME" >&2; exit 1; }
mkdir -p "$OUT"

# 인자가 있으면 그 이름만, 없으면 폴더의 html 전체
if [ $# -gt 0 ]; then
  targets=()
  for name in "$@"; do targets+=("$HERE/${name%.html}.html"); done
else
  targets=("$HERE"/*.html)
fi

for html in "${targets[@]}"; do
  [ -f "$html" ] || { echo "없는 파일: $html" >&2; exit 1; }
  slug="$(basename "$html" .html)"

  "$CHROME" \
    --headless \
    --disable-gpu \
    --hide-scrollbars \
    --force-device-scale-factor=2 \
    --window-size=1280,640 \
    --default-background-color=00000000 \
    --virtual-time-budget=10000 \
    --screenshot="$TMP/$slug.png" \
    "file://$html" >/dev/null 2>&1

  # 웹폰트·이미지가 늦게 붙으면 캡처가 비어 나온다 — 크기로 거른다
  if [ ! -s "$TMP/$slug.png" ]; then
    echo "캡처 실패: $slug" >&2
    exit 1
  fi

  sips --resampleWidth 1280 "$TMP/$slug.png" --out "$OUT/$slug.png" >/dev/null
  echo "public/covers/$slug.png"
done
