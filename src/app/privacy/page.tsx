import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 댓글 이미지 생성기",
  description: "댓글 이미지 생성기의 개인정보처리방침입니다.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <nav className="mb-8 text-sm">
        <Link href="/" className="text-red-500 hover:underline">
          ← 홈으로
        </Link>
      </nav>

      <h1 className="text-2xl font-bold">개인정보처리방침</h1>
      <p className="mt-2 text-sm text-neutral-500">
        최종 업데이트: 2026년 10월 12일
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-neutral-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            1. 수집하는 개인정보
          </h2>
          <p>
            본 서비스(이하 &quot;서비스&quot;)는 회원가입 없이 이용할 수 있으며,
            이용자의 이름, 연락처, 이메일 등 개인을 식별할 수 있는 정보를
            서버에 수집하거나 저장하지 않습니다.
          </p>
          <p className="mt-2">
            이용자가 댓글 이미지 생성을 위해 입력하는 닉네임, 댓글 내용,
            업로드한 프로필 이미지 등의 데이터는 모두 이용자의 브라우저
            내에서만 처리되며 서버로 전송되거나 저장되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            2. 쿠키 및 광고
          </h2>
          <p>
            본 서비스는 Google AdSense 등 제3자 광고 서비스를 이용할 수
            있습니다. 이러한 광고 제공업체는 이용자의 관심사에 기반한 광고를
            제공하기 위해 쿠키를 사용할 수 있습니다.
          </p>
          <p className="mt-2">
            Google을 포함한 제3자 공급업체는 쿠키를 사용하여 이용자의 이전
            방문 기록을 바탕으로 광고를 게재합니다. 이용자는{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 underline"
            >
              Google 광고 설정
            </a>
            에서 맞춤 광고를 사용 중지할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            3. 분석 도구
          </h2>
          <p>
            본 서비스는 방문자 통계 분석을 위해 Google Analytics 등의 분석
            도구를 사용할 수 있습니다. 이 과정에서 수집되는 정보는 개인을
            식별할 수 없는 형태로 처리됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            4. 개인정보의 제3자 제공
          </h2>
          <p>
            본 서비스는 이용자의 개인정보를 제3자에게 판매하거나 제공하지
            않습니다. 다만 위에 명시된 광고 및 분석 목적으로 쿠키 기반의
            비식별 정보가 제3자 서비스에 의해 처리될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            5. 문의
          </h2>
          <p>
            개인정보처리방침에 관한 문의는 아래 이메일로 연락 주시기 바랍니다.
          </p>
          <p className="mt-2">
            이메일:{" "}
            <a
              href="mailto:devfopc@gmail.com"
              className="text-red-500 underline"
            >
              devfopc@gmail.com
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
