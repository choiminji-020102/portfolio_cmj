const EMAIL = "h20206524@glab.hallym.ac.kr";

const links = [
  { label: "GitHub", href: "https://github.com/choiminji-020102" },
  { label: "Email", href: `mailto:${EMAIL}` },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="px-6 py-20 sm:py-28 border-t border-line mt-auto"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="eyebrow mb-3">Contact</p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          같이 만들 사람을 찾고 계신가요?
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted max-w-xl mx-auto">
          채용이나 프로젝트 제안이라면 메일로 편하게 연락 주세요. 이틀 안에
          답장드립니다.
        </p>

        <a
          href={`mailto:${EMAIL}`}
          className="mt-8 inline-block text-lg sm:text-xl font-medium text-deep hover:underline underline-offset-8 break-all"
        >
          {EMAIL}
        </a>

        <ul className="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="rail hover:text-ink transition-colors"
              >
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>

        <p className="rail mt-16 text-muted">
          © 2026 Choi Minji. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
