"use client";
import Container from "@/app/components/shared/Container";
import Link from "next/link";
import React from "react";
import Subscription from "@/app/components/molecules/Subscription/Subscription";
import { useSettings } from "@/app/hooks/useSettings";
import { CSpinner } from "@coreui/react";

const Footer = () => {
  const { data: settings, isLoading } = useSettings();
  // // if (isLoading) {
  // //   return (
  // //     <div className="d-flex justify-content-center p-5">
  // //       <CSpinner color="primary" />
  // //     </div>
  // //   );
  // // }

  const socialIcons = [
    { href: settings?.Instagram, icon: "/icons/ig.svg" },
    { href: settings?.Facebook, icon: "/icons/fb.svg" },
    { href: settings?.Youtube, icon: "/icons/yt.svg" },
    { href: settings?.Tiktok, icon: "/icons/tk.svg" },
    { href: settings?.Telegram, icon: "/icons/telegram.svg" },
    // { href: settings?.Spotify, icon: "/icons/spot.svg" },
  ];
  return (
    <footer className="bg-[#003A3C] mt-20 md:mt-40 relative">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-[200px] bg-[url(/images/footer-pattern.png)] bg-repeat-x bg-top opacity-30 pointer-events-none" />

      <Container>
        {/* ========================================== */}
        {/* 1. DESKTOP DESIGN (Hidden on Mobile)       */}
        {/* ========================================== */}
        <div className="hidden md:grid grid-cols-[1fr_auto] pt-[80px] pb-10 relative z-10">
          <div className="grid grid-cols-[auto_1fr] gap-20">
            {/* Logo Section */}
            <div>
              <img
                src="/images/footer-logo.png"
                alt="Logo"
                className="h-14 object-contain"
              />
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 font-[lexend] text-white/80 text-base">
              <Link href="/" className="hover:text-[#C88445] transition-colors">
                Əsas səhifə
              </Link>
              <Link
                href="/about"
                className="hover:text-[#C88445] transition-colors"
              >
                Haqqında
              </Link>
              <Link
                href="/lessons"
                className="hover:text-[#C88445] transition-colors"
              >
                Dərslər
              </Link>
              <Link
                href="/sermons"
                className="hover:text-[#C88445] transition-colors"
              >
                Moizələr
              </Link>
              <Link
                href="/trainings"
                className="hover:text-[#C88445] transition-colors"
              >
                Təlimlər
              </Link>
              <Link
                href="/speeches"
                className="hover:text-[#C88445] transition-colors"
              >
                Verilişlər
              </Link>
              <Link
                href="/articles"
                className="hover:text-[#C88445] transition-colors"
              >
                Məqalələr
              </Link>
              <Link
                href="/gallery"
                className="hover:text-[#C88445] transition-colors"
              >
                Qalereya
              </Link>
            </div>
          </div>

          {/* Subscription (Right Aligned) */}
          <div className="w-[350px]">
            <Subscription titleFont="text-sm" center="items-start" />

            {/* Social Icons for Desktop */}
          </div>
        </div>

        {/* ========================================== */}
        {/* 2. MOBILE DESIGN (Matching your Photo)     */}
        {/* ========================================== */}
        <div className="md:hidden pt-[60px] relative z-10">
          {/* Logo & Subtitle */}
          <div className="mb-12 ">
            <img
              src="/images/footer-logo.png"
              alt="Logo"
              className="h-16 mb-2"
            />
          </div>

          {/* Subscription Box */}
          <div className="w-full mb-4 flex md:hidden flex-col items-center">
            <Subscription
              titleFont="text-sm leading-snug"
              center="flex flex-col items-center"
            />
            <div className="flex gap-3 mt-4">
              {socialIcons.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
                >
                  <img
                    src={social.icon}
                    className="brightness-0 invert"
                    alt=""
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Copyright Bottom (Only on Desktop) */}
        <div
          className="flex flex-col md:flex-row
           justify-between items-center border-t border-white/10 py-6"
        >
          <div className="text-white/40 text-sm">
            <span>© {new Date().getFullYear()} Bütün hüquqlar qorunur.</span>
          </div>
          <div className="hidden md:flex gap-3">
            {socialIcons.map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
              >
                <img src={social.icon} className="brightness-0 invert" alt="" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
