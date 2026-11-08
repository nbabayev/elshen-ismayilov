"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/app/utils/articleToc";

export default function ArticleToc({ items }: { items: TocItem[] }) {
  const tocRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  const getHeadingOffset = () => {
    const toc = tocRef.current;
    if (!toc) return 160;
    const stickyTop = Number.parseFloat(getComputedStyle(toc).top) || 0;
    // Sticky olanda başlıq TOC-un altında dayansın — hər məqalədə TOC hündürlüyü fərqli ola bilər
    return stickyTop + toc.offsetHeight + 12;
  };

  const syncScrollMargin = () => {
    const offset = getHeadingOffset();
    document.documentElement.style.setProperty(
      "--article-heading-scroll-mt",
      `${offset}px`
    );
  };

  useEffect(() => {
    syncScrollMargin();
    window.addEventListener("resize", syncScrollMargin);
    return () => {
      window.removeEventListener("resize", syncScrollMargin);
      document.documentElement.style.removeProperty(
        "--article-heading-scroll-mt"
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    if (!items.length) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 1],
      }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  const handleJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    syncScrollMargin();
    const top =
      el.getBoundingClientRect().top + window.scrollY - getHeadingOffset();

    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <nav
      ref={tocRef}
      aria-label="Mündəricat"
      className="sticky top-[66px] z-10 mb-8 max-h-[calc(100vh-7rem)] overflow-y-auto bg-[#f0edea] py-4 pb-4"
    >
      <p className="mb-3 text-base font-semibold text-[#003A3C]">Mündəricat:</p>
      <ul className="m-0 list-disc space-y-2 pl-5 marker:text-[#878787]">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={item.level === 3 ? "ml-4 list-[circle]" : undefined}
            >
              <button
                type="button"
                onClick={() => handleJump(item.id)}
                className={`cursor-pointer border-0 bg-transparent p-0 text-left text-[15px] leading-snug underline-offset-2 transition-colors hover:underline ${
                  isActive
                    ? "font-medium text-[#C88445]"
                    : "text-[#4A4A4A] hover:text-[#C88445]"
                }`}
              >
                {item.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
