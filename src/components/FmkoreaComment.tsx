import { CommentData, formatCount } from "@/lib/comment";

interface Props {
  data: CommentData;
}

/**
 * 에펨코리아(펨코) 댓글 한 개를 재현한다.
 * 실제 구조 기준:
 *  - meta: [레벨 뱃지] 닉네임  ·  N 분 전
 *  - comment-content: 내용 (대댓글이면 앞에 @대상닉 파란 링크)
 *  - fdb_nav: 👍 추천수 / 👎 비추천수 / 🔗 주소복사
 * 라이트 테마 고정.
 */
export default function FmkoreaComment({ data }: Props) {
  const nickname = data.nickname.trim() || "펨코인";
  const content = data.content.trim() || "댓글 내용을 입력하세요.";
  const level = data.level;
  const timestamp = data.timestamp.trim() || "26 분 전";

  return (
    <div
      style={{
        padding: "12px 14px",
        fontFamily:
          '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
        width: 500,
        boxSizing: "border-box",
        background: "#fff",
        borderBottom: "1px solid #eceef1",
      }}
    >
      {/* meta: 레벨 뱃지 + 닉네임 + 날짜 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 7,
        }}
      >
        <LevelBadge level={level} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#373a3c" }}>
          {nickname}
        </span>
        <span style={{ fontSize: 12, color: "#95999c", marginLeft: 2 }}>
          {timestamp}
        </span>
      </div>

      {/* 내용 */}
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "#373a3c",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          marginBottom: 8,
        }}
      >
        {content}
      </div>

      {/* fdb_nav: 추천 / 비추천 / 주소복사 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 13,
          color: "#95999c",
        }}
      >
        {/* 추천 */}
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ThumbUp />
          {data.likes > 0 && (
            <span style={{ color: "#3b4890", fontWeight: 600 }}>
              {formatCount(data.likes)}
            </span>
          )}
        </span>

        {/* 비추천 */}
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ThumbDown />
          {data.subCount > 0 && (
            <span style={{ color: "#c0392b" }}>
              {formatCount(data.subCount)}
            </span>
          )}
        </span>

        {/* 주소복사 아이콘 */}
        <LinkIcon />
      </div>
    </div>
  );
}

/** 펨코 레벨 뱃지 (숫자가 적힌 작은 배지). 실제 아이콘 느낌을 자체 렌더링. */
function LevelBadge({ level }: { level: number }) {
  // 레벨대별 색상 (펨코 아이콘이 레벨대별로 색이 달라지는 느낌 반영)
  const bg =
    level >= 35
      ? "#e74c3c"
      : level >= 25
      ? "#e67e22"
      : level >= 15
      ? "#27ae60"
      : "#3498db";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 18,
        height: 16,
        padding: "0 3px",
        background: bg,
        color: "#fff",
        fontSize: 10,
        fontWeight: 700,
        borderRadius: 3,
        lineHeight: 1,
      }}
      title={`레벨 ${level}`}
    >
      {level}
    </span>
  );
}

function ThumbUp() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#95999c"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10v11" />
      <path d="M7 10l4-7a2 2 0 0 1 2.6 1.1l-.9 4.9H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 21H7" />
    </svg>
  );
}

function ThumbDown() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#95999c"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 14V3" />
      <path d="M17 14l-4 7a2 2 0 0 1-2.6-1.1l.9-4.9H5a2 2 0 0 1-2-2.3l1.2-6A2 2 0 0 1 6.2 3H17" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#95999c"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
    </svg>
  );
}
