"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LessonIcon,
  MicIcon,
  PenIcon,
  SpeechIcon,
  TrainingIcon,
  BookIcon,
} from "@/app/components/shared/TabIcon";

export const MobileBottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    // { label: "Ana səhifə", href: "/", icon: HomeIcon },
    { label: "Dərslər", href: "/lessons", icon: LessonIcon },
    { label: "Moizələr", href: "/mics", icon: MicIcon },
    { label: "Verilişlər", href: "/speeches", icon: SpeechIcon },
    { label: "Təlimlər", href: "/trainings", icon: TrainingIcon },
    { label: "Məqalələr", href: "/articles", icon: PenIcon },
    { label: "Kitablar", href: "/books", icon: BookIcon },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2 shadow-lg">
      <nav className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-1 text-xs font-[lexend] transition-colors ${
                isActive ? "text-[#003A3C] font-semibold" : "text-gray-400"
              }`}
            >
              <Icon
                color={isActive ? "#003A3C" : "#909090"}
                className="w-5 h-5 mb-1"
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
