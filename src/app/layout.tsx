import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://comment-studio.vercel.app"),
  title: "댓글 이미지 생성기 | 유튜브·인스타·디시·에펨코리아",
  description:
    "유튜브, 인스타그램, 디시인사이드, 에펨코리아 댓글 이미지를 무료로 만드세요. 닉네임, 댓글 내용, 좋아요·추천 수를 입력하면 실제 댓글처럼 생긴 이미지를 PNG로 다운로드할 수 있습니다.",
  keywords: [
    "댓글 생성기",
    "댓글 이미지 생성",
    "유튜브 댓글 생성기",
    "인스타 댓글 생성기",
    "디시 댓글 생성기",
    "에펨코리아 댓글 생성기",
    "가짜 댓글 생성기",
    "댓글 짤 만들기",
    "댓글 스튜디오",
  ],
  openGraph: {
    title: "유튜브 댓글 생성기 | 댓글 스튜디오",
    description:
      "실제 유튜브 댓글처럼 생긴 이미지를 무료로 만들고 PNG로 다운로드하세요.",
    type: "website",
    locale: "ko_KR",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
