"use client";

import { useEffect, useRef } from "react";

interface Props {
  chart: string;
}

export default function MermaidDiagram({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        flowchart: { curve: "basis", padding: 20 },
        themeVariables: {
          primaryColor: "#fafaf9",
          primaryBorderColor: "#d6d3d1",
          primaryTextColor: "#1c1917",
          lineColor: "#78716c",
          secondaryColor: "#fff7ed",
          tertiaryColor: "#f5f5f4",
          fontSize: "14px",
        },
      });

      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      const { svg } = await mermaid.render(id, chart);

      if (!cancelled && ref.current) {
        ref.current.innerHTML = svg;
        // SVG가 컨테이너 너비를 꽉 채우도록
        const svgEl = ref.current.querySelector("svg");
        if (svgEl) {
          svgEl.style.maxWidth = "100%";
          svgEl.style.height = "auto";
        }
      }
    }

    render().catch(console.error);
    return () => { cancelled = true; };
  }, [chart]);

  return (
    <div
      ref={ref}
      className="w-full overflow-x-auto flex justify-center py-2"
    />
  );
}
