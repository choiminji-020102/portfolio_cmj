"use client";

import { useEffect, useState } from "react";
import { contact } from "@/lib/profile";
import GitHubIcon from "./GitHubIcon";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
  { label: "Credentials", href: "#credentials" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ground/85 backdrop-blur-md border-b border-line" : ""
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <a href="#hero" className="rail text-ink">
          CHOI MINJI
        </a>

        {/* 오른쪽 묶음 — 화면 폭에 상관없이 GitHub 은 늘 보인다.
            첫 화면에서 코드를 바로 확인할 수 있어야 해서 상단바에 둔다 */}
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rail hover:text-ink transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="rail md:hidden hover:text-ink transition-colors"
          >
            Contact
          </a>

          <a
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub 프로필 (새 탭)"
            className="text-muted transition-colors hover:text-ink"
          >
            <GitHubIcon className="h-[18px] w-[18px]" />
          </a>
        </div>
      </nav>
    </header>
  );
}
