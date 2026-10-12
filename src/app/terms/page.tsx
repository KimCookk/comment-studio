import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관 | 댓글 이미지 생성기",
  description: "댓글 이미지 생성기의 이용약관입니다.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <nav className="mb-8 text-sm">
        <Link href="/" className="text-red-500 hover:underline">
          ← 홈으로
        </Link>
      </nav>

      <h1 className="text-2xl font-bold">이용약관</h1>
      <p className="mt-2 text-sm text-neutral-500">
        최종 업데이트: 2026년 10월 12일
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-neutral-700">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            제1조 (목적)
          </h2>
          <p>
            본 약관은 댓글 이미지 생성기(이하 &quot;서비스&quot;)를 이용함에
            있어 서비스와 이용자 간의 권리, 의무 및 책임사항을 규정하는 것을
            목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            제2조 (서비스의 내용)
          </h2>
          <p>
            본 서비스는 이용자가 입력한 정보를 바탕으로 각종 플랫폼의 댓글
            형태를 모사한 이미지를 생성하는 도구를 제공합니다. 생성되는
            이미지는 실제 게시물이 아닌, 이용자가 직접 작성한 창작물입니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            제3조 (이용자의 의무 및 금지행위)
          </h2>
          <p>이용자는 본 서비스를 다음 각 호의 용도로 사용할 수 없습니다.</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>실존 인물이나 단체를 사칭하거나 명예를 훼손하는 행위</li>
            <li>
              허위사실을 유포하거나 타인을 기만하여 피해를 주는 행위
            </li>
            <li>
              생성된 이미지를 실제 게시물인 것처럼 조작·배포하여 여론을
              호도하는 행위
            </li>
            <li>
              각 플랫폼의 상표권, 저작권 등 제3자의 권리를 침해하는 행위
            </li>
            <li>기타 관련 법령에 위반되는 행위</li>
          </ul>
          <p className="mt-3">
            본 서비스가 제공하는 결과물은 콘텐츠 제작, 패러디, 교육, 디자인
            시안 등 합법적이고 정당한 목적으로만 사용되어야 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            제4조 (책임의 한계)
          </h2>
          <p>
            본 서비스는 이미지 생성 도구만을 제공하며, 이용자가 생성한
            이미지의 내용 및 그 사용에 대한 모든 책임은 이용자 본인에게
            있습니다. 이용자가 본 약관 제3조를 위반하여 발생한 법적 분쟁 및
            손해에 대하여 서비스 운영자는 책임을 지지 않습니다.
          </p>
          <p className="mt-2">
            본 서비스에 언급된 플랫폼명 및 상표는 각 소유자의 자산이며, 본
            서비스는 해당 플랫폼과 제휴, 보증, 후원 관계가 없습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            제5조 (약관의 변경)
          </h2>
          <p>
            본 약관은 서비스 운영상 필요에 따라 변경될 수 있으며, 변경 시
            본 페이지를 통해 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-neutral-900">
            제6조 (문의)
          </h2>
          <p>
            본 약관에 관한 문의는 아래 이메일로 연락 주시기 바랍니다.
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
