import { CommentData, nowDcTimestamp } from "@/lib/comment";

interface Props {
  data: CommentData;
}

/**
 * 디시인사이드 댓글 한 개를 재현한다.
 * 실제 구조 기준:
 *  - 추천/비추천 없음, 삭제 버튼만 존재
 *  - 고정닉: 닉네임 + 닉콘(갤로그 아이콘)
 *  - 유동닉: 닉네임 + (IP) 꼬리표
 *  - 우측에 날짜(MM.DD HH:MM:SS)
 * 라이트 테마 고정.
 *
 * 닉네임 입력 규칙:
 *  - "유튜브중독자"        → 고정닉 (닉콘 표시)
 *  - "유갤러 (27.113)"     → 유동닉 (IP 표시)
 */
export default function DcinsideComment({ data }: Props) {
  const raw = data.nickname.trim() || "ㅇㅇ (27.113)";
  const content = data.content.trim() || "댓글 내용을 입력하세요.";
  const timestamp = data.timestamp.trim() || nowDcTimestamp();

  // (IP) 꼬리표가 있으면 유동닉으로 간주
  const ipMatch = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  const isFloating = !!ipMatch;
  const nick = ipMatch ? ipMatch[1].trim() : raw;
  const ip = ipMatch ? ipMatch[2].trim() : null;

  return (
    <div
      style={{
        padding: "10px 15px",
        fontFamily:
          '"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "돋움", Dotum, "Noto Sans KR", sans-serif',
        width: 560,
        boxSizing: "border-box",
        background: "#fff",
        borderBottom: "1px solid #ebebeb",
      }}
    >
      {/* 상단: 닉네임 영역 + 우측 날짜 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {/* 닉네임 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#51504f",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {nick}
          </span>
          {isFloating ? (
            <span style={{ fontSize: 12, color: "#aaa", fontWeight: 400 }}>
              ({ip})
            </span>
          ) : (
            // 고정닉 닉콘 (갤로그 아이콘 느낌의 작은 사각형)
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 12,
                height: 11,
                marginLeft: 2,
                background: "#3b4890",
                borderRadius: 1,
                fontSize: 8,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              D
            </span>
          )}
        </div>

        {/* 우측 날짜 */}
        <span
          style={{
            fontSize: 11,
            color: "#b2b2b2",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {timestamp}
        </span>
      </div>

      {/* 댓글 내용 */}
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.55,
          color: "#333333",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          marginTop: 5,
        }}
      >
        {content}
      </div>
    </div>
  );
}
