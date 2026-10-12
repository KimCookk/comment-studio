// 댓글 데이터 모델 및 자동 생성 유틸

export type Theme = "dark" | "light";

export type Platform = "youtube" | "instagram" | "dcinside" | "fmkorea";

export interface CommentData {
  /** 프로필 이미지 data URL. 없으면 기본 아바타 */
  avatar: string | null;
  nickname: string;
  content: string;
  /** 유튜브/인스타=좋아요, 디시=추천(비추천은 subCount), 펨코=추천 */
  likes: number;
  /** 디시 비추천 / 펨코 비추천 등 보조 숫자 */
  subCount: number;
  /** 펨코 레벨 뱃지 (1~40) */
  level: number;
  /** 작성 시간 표기. 빈 문자열이면 컴포넌트가 기본값으로 대체 */
  timestamp: string;
}

export interface PlatformMeta {
  id: Platform;
  label: string;
  /** 테마 전환 지원 여부. false면 라이트 고정 */
  supportsTheme: boolean;
  /** 메인 숫자 필드 라벨 (예: 좋아요 수, 추천 수). null이면 숫자 미사용 */
  countLabel: string | null;
  /** 보조 숫자 필드 라벨. null이면 보조 숫자 미사용 */
  subCountLabel: string | null;
  /** 프로필 이미지 사용 여부 (디시/펨코는 미사용) */
  usesAvatar: boolean;
  /** 레벨 뱃지 사용 여부 (펨코 전용) */
  usesLevel: boolean;
  /** 작성 시간 입력 사용 여부 (유튜브는 제외) */
  usesTimestamp: boolean;
  /** 작성 시간 입력 라벨 */
  timestampLabel: string;
  /** 작성 시간 입력 placeholder (비우면 쓰는 기본값 안내) */
  timestampPlaceholder: string;
  /** 댓글 컴포넌트의 원본(기준) 폭 px. 미리보기 축소 비율 계산에 사용 */
  baseWidth: number;
  /** 테마 토글의 기본값 */
  defaultTheme: Theme;
}

export const PLATFORMS: Record<Platform, PlatformMeta> = {
  youtube: {
    id: "youtube",
    label: "유튜브",
    supportsTheme: true,
    countLabel: "좋아요 수",
    subCountLabel: null,
    usesAvatar: true,
    usesLevel: false,
    usesTimestamp: false,
    timestampLabel: "",
    timestampPlaceholder: "",
    baseWidth: 560,
    defaultTheme: "dark",
  },
  instagram: {
    id: "instagram",
    label: "인스타그램",
    supportsTheme: true,
    countLabel: "좋아요 수",
    subCountLabel: null,
    usesAvatar: true,
    usesLevel: false,
    usesTimestamp: true,
    timestampLabel: "작성 시간",
    timestampPlaceholder: "비우면 '방금' (예: 3시간, 1일)",
    baseWidth: 560,
    defaultTheme: "light",
  },
  dcinside: {
    id: "dcinside",
    label: "디시인사이드",
    supportsTheme: false,
    // 디시 댓글은 추천/비추천이 없음
    countLabel: null,
    subCountLabel: null,
    usesAvatar: false,
    usesLevel: false,
    usesTimestamp: true,
    timestampLabel: "작성 날짜·시간",
    timestampPlaceholder: "비우면 현재 시각 (예: 03.08 15:58:21)",
    baseWidth: 560,
    defaultTheme: "light",
  },
  fmkorea: {
    id: "fmkorea",
    label: "에펨코리아",
    supportsTheme: false,
    countLabel: "추천 수",
    subCountLabel: null,
    usesAvatar: false,
    usesLevel: true,
    usesTimestamp: true,
    timestampLabel: "작성 시간",
    timestampPlaceholder: "비우면 '26 분 전'",
    baseWidth: 560,
    defaultTheme: "light",
  },
};

export const PLATFORM_LIST: PlatformMeta[] = [
  PLATFORMS.youtube,
  PLATFORMS.instagram,
  PLATFORMS.dcinside,
  // 에펨코리아는 현재 비활성화 (PLATFORMS.fmkorea 정의는 유지)
];

// ───────── 닉네임 자동 생성 ─────────

// 유튜브/인스타용 (한국식 핸들 느낌)
const NICK_ADJECTIVES = [
  "지나가던",
  "열정적인",
  "조용한",
  "날아다니는",
  "잠못드는",
  "현명한",
  "배고픈",
  "구독한",
  "행복한",
  "진지한",
  "느긋한",
  "엉뚱한",
  "용감한",
  "수상한",
  "평범한",
];

const NICK_NOUNS = [
  "시청자",
  "구독자",
  "너구리",
  "고양이",
  "직장인",
  "학생",
  "여행자",
  "댓글러",
  "감자",
  "판다",
  "라쿤",
  "펭귄",
  "다람쥐",
  "고라니",
  "햄스터",
];

// 디시 유동닉 느낌 (뒤에 (IP)가 붙음)
const DC_FLOATING_NICKS = ["ㅇㅇ", "ㄴㄴ", "ㅎㅇ", "유갤러", "ㅇㅇㅇ", "디붕이"];

// 디시 고정닉 느낌 (닉콘이 붙음, IP 없음)
const DC_FIXED_NICKS = [
  "유튜브중독자",
  "갤주인장",
  "조용한눈팅러",
  "불멸의고닉",
  "댓글기계",
  "갤로그관리자",
];

// 펨코 닉네임 느낌
const FM_NICKS = [
  "펨코인",
  "익명의포인트",
  "지나가던펨창",
  "눈팅러",
  "포인트벌이",
  "오늘도평화",
  "댓글러",
  "불타는펨코",
  "조용한관전러",
  "레벨업중",
];

/**
 * 플랫폼에 맞는 닉네임을 랜덤 생성한다.
 */
export function randomNickname(platform: Platform = "youtube"): string {
  const num = Math.floor(Math.random() * 9000) + 1000; // 1000~9999

  switch (platform) {
    case "dcinside": {
      // 60% 확률로 유동닉(IP 포함), 40% 고정닉
      if (Math.random() < 0.6) {
        const nick =
          DC_FLOATING_NICKS[
            Math.floor(Math.random() * DC_FLOATING_NICKS.length)
          ];
        const ip = `${Math.floor(Math.random() * 223) + 1}.${Math.floor(
          Math.random() * 255
        )}`;
        return `${nick} (${ip})`;
      }
      return DC_FIXED_NICKS[
        Math.floor(Math.random() * DC_FIXED_NICKS.length)
      ];
    }
    case "fmkorea": {
      const nick = FM_NICKS[Math.floor(Math.random() * FM_NICKS.length)];
      return `${nick}${num % 100}`;
    }
    default: {
      const adj =
        NICK_ADJECTIVES[Math.floor(Math.random() * NICK_ADJECTIVES.length)];
      const noun = NICK_NOUNS[Math.floor(Math.random() * NICK_NOUNS.length)];
      return `${adj}${noun}${num}`;
    }
  }
}

/** 메인 숫자(좋아요/추천)를 1~1000 사이 랜덤으로 생성한다. */
export function randomLikes(): number {
  return Math.floor(Math.random() * 1000) + 1;
}

/** 보조 숫자(비추천)를 0~50 사이 랜덤으로 생성한다. */
export function randomSubCount(): number {
  return Math.floor(Math.random() * 51);
}

/** 펨코 레벨(1~40)을 랜덤 생성한다. 실제 분포상 중간 레벨이 흔함. */
export function randomLevel(): number {
  return Math.floor(Math.random() * 30) + 10; // 10~39
}

/** 현재 시각을 디시 형식(MM.DD HH:MM:SS)으로 반환한다. */
export function nowDcTimestamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes()
  )}:${p(d.getSeconds())}`;
}

/**
 * 숫자를 유튜브/인스타식 표기로 변환한다.
 * 1000 이상이면 "1.2천" 형태로, 미만이면 그대로 숫자.
 */
export function formatLikes(likes: number): string {
  if (likes < 1000) return String(likes);
  const thousands = likes / 1000;
  const rounded = Math.round(thousands * 10) / 10;
  return `${rounded}천`;
}

/** 숫자를 천 단위 콤마 표기로 변환한다. (디시/펨코용) */
export function formatCount(n: number): string {
  return n.toLocaleString("ko-KR");
}

/** 닉네임 첫 글자를 기본 아바타용으로 추출한다. */
export function avatarInitial(nickname: string): string {
  const trimmed = nickname.trim();
  if (!trimmed) return "?";
  const base = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  return (base[0] ?? "?").toUpperCase();
}

/** 닉네임 문자열을 기반으로 안정적인 색상을 뽑는다. (기본 아바타 배경용) */
export function avatarColor(nickname: string): string {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 50%)`;
}
