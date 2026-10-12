import {
  CommentData,
  formatCount,
  Theme,
} from "@/lib/comment";

interface Props {
  data: CommentData;
  theme: Theme;
}

const COLORS = {
  dark: {
    name: "#f5f5f5",
    content: "#f5f5f5",
    meta: "#a8a8a8",
    heart: "#a8a8a8",
  },
  light: {
    name: "#262626",
    content: "#262626",
    meta: "#737373",
    heart: "#737373",
  },
} as const;

/** 인스타그램 댓글 한 개를 실제 UI처럼 렌더링한다. */
export default function InstagramComment({ data, theme }: Props) {
  const c = COLORS[theme];
  const nickname = data.nickname.trim() || "instagram";
  const content = data.content.trim() || "댓글 내용을 입력하세요.";
  const timestamp = data.timestamp.trim() || "방금";

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: 16,
        alignItems: "flex-start",
        fontFamily:
          '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
        width: 560,
        boxSizing: "border-box",
      }}
    >
      {/* 프로필 이미지 */}
      <div style={{ flexShrink: 0 }}>
        {data.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.avatar}
            alt=""
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          // 인스타 기본 프로필 (회색 배경 + 흰 사람 실루엣)
          <DefaultInstaAvatar />
        )}
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.5,
            color: c.content,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <span style={{ fontWeight: 600, color: c.name, marginRight: 6 }}>
            {nickname.replace(/^@/, "")}
          </span>
          {content}
        </div>

        {/* 메타: 시간 · 좋아요 N개 · 답글 달기 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 8,
            fontSize: 12,
            color: c.meta,
            fontWeight: 500,
          }}
        >
          <span>{timestamp}</span>
          <span>좋아요 {formatCount(data.likes)}개</span>
          <span>답글 달기</span>
        </div>
      </div>

      {/* 우측 하트 아이콘 */}
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={c.heart}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      </div>
    </div>
  );
}

/**
 * 인스타그램 기본 프로필 (회색 배경 원 + 흰 사람 실루엣).
 * 첨부된 인스타 기본 프로필 이미지를 외부 파일 없이 SVG로 재현.
 */
function DefaultInstaAvatar() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 64 64"
      style={{ display: "block", borderRadius: "50%" }}
    >
      {/* 배경 원 */}
      <circle cx="32" cy="32" r="32" fill="#d9dbde" />
      {/* 머리 */}
      <circle cx="32" cy="25" r="11" fill="#ffffff" />
      {/* 어깨/몸통 (하단 반원) */}
      <path
        d="M14 56c0-10.5 8-18 18-18s18 7.5 18 18z"
        fill="#ffffff"
      />
    </svg>
  );
}
