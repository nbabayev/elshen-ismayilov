"use client";

import Image from "next/image";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";

import {
  BookIcon,
  LessonIcon,
  MicIcon,
  PenIcon,
  SpeechIcon,
  TrainingIcon,
} from "@/app/components/shared/TabIcon";

type IconProps = { color?: string };

const AboutIcon = ({ color = "currentColor" }: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path
      d="M10 10.833a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666Z"
      stroke={color}
      strokeWidth="1.6"
    />
    <path
      d="M4.167 16.667a5.833 5.833 0 0 1 11.666 0"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const GalleryIcon = ({ color = "currentColor" }: IconProps) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <rect
      x="2.5"
      y="3.333"
      width="15"
      height="13.334"
      rx="1.5"
      stroke={color}
      strokeWidth="1.6"
    />
    <path
      d="M2.5 13.333 6.667 9.167l3.333 3.333 2.083-2.083L17.5 14.167"
      stroke={color}
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

type SideItem = {
  label: string;
  href: string;
  icon: ComponentType<IconProps>;
};

const leftItems: SideItem[] = [
  { label: "Haqqında", href: "/about", icon: AboutIcon },
  { label: "Qalereya", href: "/gallery", icon: GalleryIcon },
];

const rightItems: SideItem[] = [
  { label: "Kitablar", href: "/books", icon: BookIcon },
  { label: "Məqalələr", href: "/articles", icon: PenIcon },
];

const fanItems: SideItem[] = [
  { label: "Dərslər", href: "/lessons", icon: LessonIcon },
  { label: "Moizələr", href: "/sermons", icon: MicIcon },
  { label: "Verilişlər", href: "/speeches", icon: SpeechIcon },
  { label: "Təlimlər", href: "/trainings", icon: TrainingIcon },
];

const isCurrent = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

function FanLinkFace({
  icon: Icon,
  label,
  active,
}: {
  icon: ComponentType<IconProps>;
  label: string;
  active: boolean;
}) {
  const { pending } = useLinkStatus();

  return (
    <>
      {pending ? (
        <span
          className={`h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-t-transparent ${
            active ? "border-white" : "border-[#C88445]"
          }`}
        />
      ) : (
        <Icon color={active ? "#ffffff" : "#C88445"} />
      )}
      <span className="whitespace-nowrap text-sm font-medium leading-none font-[lexend]">
        {label}
      </span>
    </>
  );
}

const SideLink = ({ item, pathname }: { item: SideItem; pathname: string }) => {
  const Icon = item.icon;
  const active = isCurrent(pathname, item.href);

  return (
    <Link
      href={item.href}
      className={`flex flex-1 flex-col items-center justify-end gap-1 min-w-0 px-0.5 pb-1.5 pt-2 text-[10px] leading-none font-[lexend] ${
        active ? "text-[#003A3C] font-semibold" : "text-gray-400"
      }`}
    >
      <Icon color={active ? "#003A3C" : "#909090"} />
      <span className="whitespace-nowrap">{item.label}</span>
    </Link>
  );
};

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const fanActive = fanItems.some((item) => isCurrent(pathname, item.href));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Menyunu bağla"
          className="min-[994px]:hidden fixed inset-0 z-40 bg-black/35"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="min-[994px]:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">
        <nav className="relative flex items-end">
          {leftItems.map((item) => (
            <SideLink key={item.href} item={item} pathname={pathname} />
          ))}

          <div className="relative flex flex-1 justify-center">
            <div className={`relative -mt-5 h-16 w-16 ${open ? "z-30" : ""}`}>
              <div className="absolute bottom-[calc(100%-5px)] left-25 z-10 flex flex-col items-end gap-2.5">
                {fanItems.map((item, index) => {
                  const active = isCurrent(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-hidden={!open}
                      tabIndex={open ? 0 : -1}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-[10px] border px-3.5 py-2 shadow-[0_8px_20px_rgba(0,0,0,0.12)] ${
                        active
                          ? "border-[#C88445] bg-[#003A3C] text-white"
                          : "border-white bg-white text-[#2b2b2b]"
                      }`}
                      style={{
                        opacity: open ? 1 : 0,
                        pointerEvents: open ? "auto" : "none",
                        transform: open ? "translateX(0)" : "translateX(40px)",
                        transition:
                          "transform 280ms cubic-bezier(0.2, 0.85, 0.2, 1), opacity 180ms ease",
                        transitionDelay: open ? `${index * 40}ms` : "0ms",
                      }}
                    >
                      <FanLinkFace
                        icon={item.icon}
                        label={item.label}
                        active={active}
                      />
                    </Link>
                  );
                })}
              </div>

              <button
                type="button"
                aria-label={open ? "Bölmələri bağla" : "Bölmələri aç"}
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className={`relative z-20 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#C88445] text-white shadow-lg ${
                  fanActive ? "ring-2 ring-[#003A3C]" : ""
                }`}
              >
                {open ? (
                  <span className="relative block h-5 w-5">
                    <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rotate-45 rounded-full bg-white" />
                    <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
                  </span>
                ) : (
                  <Image
                    src="/icons/play-white.svg"
                    alt=""
                    width={16}
                    height={22}
                    className="translate-x-0.5"
                  />
                )}
              </button>
            </div>
          </div>

          {rightItems.map((item) => (
            <SideLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
      </div>
    </>
  );
};
