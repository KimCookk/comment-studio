import {
  avatarColor,
  avatarInitial,
  CommentData,
  formatLikes,
  Theme,
} from "@/lib/comment";

interface Props {
  data: CommentData;
  theme: Theme;
}

// 유튜브 실제 색상값
const COLORS = {
  dark: {
    name: "#f1f1f1",
    content: "#f1f1f1",
    meta: "#aaaaaa",
    icon: "#aaaaaa",
  },
  light: {
    name: "#0f0f0f",
    content: "#0f0f0f",
    meta: "#606060",
    icon: "#606060",
  },
} as const;

/** 유튜브 댓글 한 개를 실제 UI처럼 렌더링한다. */
export default function YouTubeComment({ data, theme }: Props) {
  const c = COLORS[theme];
  const nickname = data.nickname.trim() || "사용자";
  const content = data.content.trim() || "댓글 내용을 입력하세요.";

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
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
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: avatarColor(nickname),
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {avatarInitial(nickname)}
          </div>
        )}
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 닉네임 */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: c.name,
            lineHeight: 1.4,
          }}
        >
          {nickname.startsWith("@") ? nickname : `@${nickname}`}
        </div>

        {/* 댓글 내용 */}
        <div
          style={{
            fontSize: 14,
            color: c.content,
            lineHeight: 1.5,
            marginTop: 2,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {content}
        </div>

        {/* 액션 영역: 좋아요 / 싫어요 / 답글 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 8,
          }}
        >
          {/* 좋아요 아이콘 */}
          <ThumbUp color={c.icon} />
          <span style={{ fontSize: 12, color: c.meta, marginRight: 8 }}>
            {formatLikes(data.likes)}
          </span>

          {/* 싫어요 아이콘 */}
          <ThumbDown color={c.icon} />

          {/* 답글 버튼 */}
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: c.meta,
              marginLeft: 8,
            }}
          >
            답글
          </span>
        </div>
      </div>
    </div>
  );
}

function ThumbUp({ color }: { color: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v11" />
      <path d="M7 10l4-7a2 2 0 0 1 2.6 1.1l-.9 4.9H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 21H7" />
    </svg>
  );
}

function ThumbDown({ color }: { color: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V3" />
      <path d="M17 14l-4 7a2 2 0 0 1-2.6-1.1l.9-4.9H5a2 2 0 0 1-2-2.3l1.2-6A2 2 0 0 1 6.2 3H17" />
    </svg>
  );
}
