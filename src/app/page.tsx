"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import YouTubeComment from "@/components/YouTubeComment";
import InstagramComment from "@/components/InstagramComment";
import DcinsideComment from "@/components/DcinsideComment";
import FmkoreaComment from "@/components/FmkoreaComment";
import {
  CommentData,
  Platform,
  PLATFORMS,
  PLATFORM_LIST,
  randomLevel,
  randomLikes,
  randomNickname,
  randomSubCount,
  Theme,
} from "@/lib/comment";

// 저작권 표기 연도. 모듈 로드 시 1회만 계산 (프리렌더 중 Date 직접 읽기 방지)
const COPYRIGHT_YEAR = new Date().getFullYear();

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("youtube");
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [likes, setLikes] = useState(128);
  const [subCount, setSubCount] = useState(0);
  const [level, setLevel] = useState(34);
  const [timestamp, setTimestamp] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [opacity, setOpacity] = useState(0.7);
  const [downloading, setDownloading] = useState(false);

  const captureRef = useRef<HTMLDivElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const meta = PLATFORMS[platform];

  // 미리보기 칸의 실제 폭을 측정해, 댓글 원본 폭을 넘으면 비율 유지하며 축소
  useEffect(() => {
    const el = previewBoxRef.current;
    if (!el) return;
    const update = () => setBoxWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 축소 비율: 칸이 원본보다 좁으면 줄이고, 넓어도 1(확대 안 함)
  const scale = boxWidth > 0 ? Math.min(1, boxWidth / meta.baseWidth) : 1;

  // 캡처 요소(원본)의 실제 높이를 측정 (스케일 래퍼 높이 보정용)
  useEffect(() => {
    const el = captureRef.current;
    if (!el) return;
    const update = () => setContentHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [platform]);

  // 플랫폼이 테마를 지원하지 않으면 라이트 고정
  const effectiveTheme: Theme = meta.supportsTheme ? theme : "light";

  const data: CommentData = {
    avatar,
    nickname,
    content,
    likes,
    subCount,
    level,
    timestamp,
  };

  // 테마별 배경색 (opacity 적용 대상)
  const themeBg = effectiveTheme === "dark" ? "15, 15, 15" : "255, 255, 255";

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    // 새 플랫폼의 기본 테마로 전환
    setTheme(PLATFORMS[p].defaultTheme);
  };

  const handleAvatarUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const handleOpacityNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value);
    if (Number.isNaN(raw)) return;
    const clamped = Math.min(100, Math.max(0, raw));
    setOpacity(clamped / 100);
  };

  const handleDownload = useCallback(async () => {
    if (!captureRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(captureRef.current, {
        pixelRatio: 3,
        cacheBust: true,
        backgroundColor: undefined,
      });
      const link = document.createElement("a");
      link.download = `${platform}-comment-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("이미지 생성에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setDownloading(false);
    }
  }, [platform]);

  // 선택된 플랫폼의 댓글 컴포넌트
  const preview = useMemo(() => {
    switch (platform) {
      case "instagram":
        return <InstagramComment data={data} theme={effectiveTheme} />;
      case "dcinside":
        return <DcinsideComment data={data} />;
      case "fmkorea":
        return <FmkoreaComment data={data} />;
      default:
        return <YouTubeComment data={data} theme={effectiveTheme} />;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform, effectiveTheme, avatar, nickname, content, likes, subCount, level, timestamp]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">댓글 이미지 생성기</h1>
        <p className="mt-2 text-sm text-neutral-500">
          유튜브·인스타·커뮤니티 댓글을 실제처럼 만들어 PNG로 저장하세요.
          콘텐츠 제작·패러디용으로만 사용해 주세요.
        </p>
      </header>

      {/* 플랫폼 셀렉터 */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {PLATFORM_LIST.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handlePlatformChange(p.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              platform === p.id
                ? "border-red-400 bg-red-500 text-white"
                : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ───────── 입력 폼 ───────── */}
        <section className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
          <h2 className="text-sm font-semibold text-neutral-700">
            {meta.label} 댓글 설정
          </h2>

          {/* 프로필 이미지 (유튜브/인스타만) */}
          {meta.usesAvatar && (
            <Field label="프로필 이미지">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer rounded-lg border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50">
                  이미지 업로드
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar(null)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    기본 아바타로
                  </button>
                )}
              </div>
            </Field>
          )}

          {/* 닉네임 */}
          <Field
            label={
              platform === "dcinside"
                ? "닉네임 (유동닉은 뒤에 (IP) 입력)"
                : "닉네임"
            }
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={
                  platform === "dcinside" ? "ㅇㅇ (27.113)" : "닉네임"
                }
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setNickname(randomNickname(platform))}
                className="whitespace-nowrap rounded-lg bg-neutral-100 px-3 py-2 text-sm hover:bg-neutral-200"
              >
                자동 생성
              </button>
            </div>
          </Field>

          {/* 댓글 내용 */}
          <Field label="댓글 내용">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="댓글 내용을 입력하세요"
              rows={3}
              className="w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
            />
          </Field>

          {/* 작성 시간 (유튜브 제외) */}
          {meta.usesTimestamp && (
            <Field label={meta.timestampLabel}>
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder={meta.timestampPlaceholder}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
              />
            </Field>
          )}

          {/* 레벨 (펨코만) */}
          {meta.usesLevel && (
            <Field label="레벨 (1~40)">
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={level}
                  onChange={(e) =>
                    setLevel(
                      Math.min(40, Math.max(1, Number(e.target.value) || 1))
                    )
                  }
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setLevel(randomLevel())}
                  className="whitespace-nowrap rounded-lg bg-neutral-100 px-3 py-2 text-sm hover:bg-neutral-200"
                >
                  자동 생성
                </button>
              </div>
            </Field>
          )}

          {/* 메인 숫자 (좋아요/추천) */}
          {meta.countLabel && (
            <Field label={meta.countLabel}>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={likes}
                  onChange={(e) =>
                    setLikes(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setLikes(randomLikes())}
                  className="whitespace-nowrap rounded-lg bg-neutral-100 px-3 py-2 text-sm hover:bg-neutral-200"
                >
                  자동 생성
                </button>
              </div>
            </Field>
          )}

          {/* 보조 숫자 (비추천) */}
          {meta.subCountLabel && (
            <Field label={meta.subCountLabel}>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={subCount}
                  onChange={(e) =>
                    setSubCount(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-red-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSubCount(randomSubCount())}
                  className="whitespace-nowrap rounded-lg bg-neutral-100 px-3 py-2 text-sm hover:bg-neutral-200"
                >
                  자동 생성
                </button>
              </div>
            </Field>
          )}

          {/* 테마 (지원 플랫폼만) */}
          {meta.supportsTheme && (
            <Field label="테마">
              <div className="flex gap-2">
                <ThemeButton
                  active={theme === "dark"}
                  onClick={() => setTheme("dark")}
                >
                  다크
                </ThemeButton>
                <ThemeButton
                  active={theme === "light"}
                  onClick={() => setTheme("light")}
                >
                  라이트
                </ThemeButton>
              </div>
            </Field>
          )}

          {/* 배경 불투명도 */}
          <Field label={`배경 불투명도 (${Math.round(opacity * 100)}%)`}>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(opacity * 100)}
                onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(opacity * 100)}
                  onChange={handleOpacityNumber}
                  className="w-16 rounded-lg border border-neutral-300 px-2 py-1 text-sm focus:border-red-400 focus:outline-none"
                />
                <span className="text-sm text-neutral-500">%</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              0%는 완전 투명(영상에 바로 얹기 좋음), 100%는 배경이 꽉 찹니다.
            </p>
          </Field>
        </section>

        {/* ───────── 미리보기 + 다운로드 ───────── */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-neutral-700">미리보기</h2>

          {/* previewBox: 폭 측정 + 체커보드. 스케일 래퍼로 축소된 콘텐츠를 담는다 */}
          <div
            ref={previewBoxRef}
            className="checkerboard overflow-hidden rounded-2xl ring-1 ring-neutral-200"
            style={{
              // 축소된 콘텐츠 높이에 맞춰 빈 공간 제거
              height: contentHeight ? contentHeight * scale : undefined,
            }}
          >
            {/* 스케일 래퍼: 원본을 비율 유지하며 축소 (화면 표시용) */}
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: meta.baseWidth,
              }}
            >
              {/* 캡처 대상: 항상 원본 크기 (PNG는 이 크기로 저장) */}
              <div
                ref={captureRef}
                style={{
                  backgroundColor: `rgba(${themeBg}, ${opacity})`,
                  width: meta.baseWidth,
                }}
              >
                {preview}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {downloading ? "이미지 생성 중..." : "PNG 다운로드"}
          </button>

          <p className="text-center text-xs text-neutral-400">
            고해상도(3배)로 저장됩니다.
          </p>
        </section>
      </div>

      {/* ───────── 소개 / 사용법 / FAQ (콘텐츠) ───────── */}
      <article className="mt-16 space-y-12 text-neutral-700">
        {/* 서비스 소개 */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900">
            댓글 이미지 생성기란?
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            댓글 이미지 생성기는 유튜브, 인스타그램, 커뮤니티 등 다양한
            플랫폼의 댓글 모양을 그대로 재현한 이미지를 만들어 주는 무료
            도구입니다. 닉네임과 댓글 내용, 좋아요 수 등을 입력하면 실제
            화면에서 캡처한 것처럼 자연스러운 댓글 이미지를 바로 만들 수
            있습니다. 완성된 이미지는 고해상도 PNG 파일로 저장되어 영상 편집,
            썸네일 제작, 발표 자료, 블로그 등 다양한 창작 작업에 활용할 수
            있습니다.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            회원가입이나 프로그램 설치 없이 웹 브라우저에서 바로 사용할 수
            있으며, 입력한 내용은 서버에 저장되지 않고 이용자의 브라우저에서만
            처리됩니다.
          </p>
        </section>

        {/* 사용법 */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900">사용 방법</h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed">
            <li>
              <strong className="text-neutral-900">1. 플랫폼 선택</strong>
              <br />
              상단에서 만들고 싶은 댓글의 플랫폼(유튜브, 인스타그램,
              커뮤니티)을 선택합니다. 플랫폼마다 실제 디자인에 맞는 입력
              항목이 나타납니다.
            </li>
            <li>
              <strong className="text-neutral-900">2. 내용 입력</strong>
              <br />
              닉네임, 댓글 내용, 좋아요 수 등을 입력합니다. 닉네임과 좋아요
              수는 &apos;자동 생성&apos; 버튼으로 자연스러운 값을 바로 채울 수
              있습니다. 유튜브·인스타그램은 프로필 이미지도 직접 업로드할 수
              있습니다.
            </li>
            <li>
              <strong className="text-neutral-900">3. 테마와 배경 조절</strong>
              <br />
              다크 모드와 라이트 모드를 선택하고, 배경 불투명도를 조절합니다.
              불투명도를 0%로 설정하면 배경이 투명하게 저장되어 영상이나 다른
              이미지 위에 자연스럽게 올릴 수 있습니다.
            </li>
            <li>
              <strong className="text-neutral-900">4. PNG 다운로드</strong>
              <br />
              미리보기에서 결과를 확인한 뒤 &apos;PNG 다운로드&apos; 버튼을
              누르면 고해상도 이미지가 저장됩니다.
            </li>
          </ol>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900">자주 묻는 질문</h2>
          <div className="mt-4 space-y-5 text-sm leading-relaxed">
            <div>
              <h3 className="font-semibold text-neutral-900">
                완전히 무료인가요?
              </h3>
              <p className="mt-1">
                네, 모든 기능을 무료로 사용할 수 있습니다. 회원가입이나 결제
                없이 바로 이용 가능합니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                만든 이미지는 어디에 쓸 수 있나요?
              </h3>
              <p className="mt-1">
                영상 편집 소재, 유튜브 썸네일, 밈·짤 제작, 발표 자료, 디자인
                시안 등 창작 목적으로 자유롭게 활용할 수 있습니다. 다만 실존
                인물 사칭이나 허위사실 유포 등 타인에게 피해를 주는 용도로는
                사용할 수 없습니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                입력한 내용이 저장되나요?
              </h3>
              <p className="mt-1">
                아니요. 입력한 닉네임, 댓글 내용, 업로드한 이미지는 서버로
                전송되거나 저장되지 않으며 이용자의 브라우저 안에서만
                처리됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                배경을 투명하게 저장할 수 있나요?
              </h3>
              <p className="mt-1">
                네. 배경 불투명도를 0%로 설정하면 배경이 투명한 PNG로
                저장되어, 영상이나 다른 이미지 위에 겹쳐 사용하기 좋습니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">
                모바일에서도 쓸 수 있나요?
              </h3>
              <p className="mt-1">
                네. PC와 모바일 웹 브라우저 모두에서 사용할 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </article>

      <footer className="mt-12 border-t border-neutral-200 pt-6 text-center text-xs text-neutral-400">
        <p>
          본 도구로 만든 이미지는 창작·패러디 목적으로만 사용하세요. 실존 인물
          사칭, 허위사실 유포 등 타인에게 피해를 주는 용도의 사용을 금합니다.
        </p>
        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <a href="/privacy" className="underline hover:text-neutral-600">
            개인정보처리방침
          </a>
          <span className="text-neutral-300">|</span>
          <a href="/terms" className="underline hover:text-neutral-600">
            이용약관
          </a>
        </p>
        <p className="mt-3 text-neutral-400">
          © {COPYRIGHT_YEAR} 댓글 이미지 생성기 ·{" "}
          <a
            href="mailto:devfopc@gmail.com"
            className="underline hover:text-neutral-600"
          >
            devfopc@gmail.com
          </a>
        </p>
      </footer>
    </main>
  );
}

/* ───────── 작은 UI 조각들 ───────── */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-neutral-600">
        {label}
      </label>
      {children}
    </div>
  );
}

function ThemeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
        active
          ? "border-red-400 bg-red-50 font-semibold text-red-600"
          : "border-neutral-300 hover:bg-neutral-50"
      }`}
    >
      {children}
    </button>
  );
}
