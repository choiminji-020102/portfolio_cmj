import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

// 한글 본문 — 웨이트 대비를 넓게 쓰기 위해 300~700을 모두 싣는다
const plexKR = IBM_Plex_Sans_KR({
  variable: "--font-plex-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// 라틴·숫자 전용 — 기간, 수치, 기술명, 라벨. 한글 본문과 같은 가족.
const plexLatin = IBM_Plex_Sans({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "최민지 — AI·의료영상 / 풀스택",
  description:
    "초음파 영상 세그멘테이션부터 구독 관리 시스템까지, 모호한 경계를 정의해 온 기록.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${plexKR.variable} ${plexLatin.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
