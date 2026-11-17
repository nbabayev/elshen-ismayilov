"use client";

import { useEffect, useState } from "react";

const SHOW_AFTER = 200;

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Yuxarı qayıt"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-4 z-40 cursor-pointer border-0 bg-transparent p-0 transition-opacity duration-200 bottom-[88px] min-[994px]:bottom-6 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <img src="/images/top_to.svg" alt="" width={48} height={48} />
    </button>
  );
}
