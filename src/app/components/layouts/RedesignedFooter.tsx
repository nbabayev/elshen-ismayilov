import React from "react";
import Link from "next/link";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaTelegramPlane,
} from "react-icons/fa";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineVideoCamera,
  HiOutlineDocumentText,
  HiOutlineUser,
} from "react-icons/hi";

export default function FooterWithNav() {
  // Səhifə/Bölmə keçidləri
  const navLinks = [
    { label: "Ana səhifə", href: "/" },
    { label: "Dərslər", href: "/lessons" },
    { label: "Məqalələr", href: "/articles" },
    { label: "Kitablar", href: "/books" },
    { label: "Haqqımda", href: "/about" },
    { label: "Əlaqə", href: "/contact" },
  ];

  // Mobildə ekranın altında sabit (fixed) duracaq Bottom Nav
  const bottomNavItems = [
    { label: "Ana səhifə", href: "/", icon: HiOutlineHome },
    { label: "Dərslər", href: "/lessons", icon: HiOutlineVideoCamera },
    { label: "Məqalələr", href: "/articles", icon: HiOutlineDocumentText },
    { label: "Kitablar", href: "/books", icon: HiOutlineBookOpen },
    { label: "Profil", href: "/profile", icon: HiOutlineUser },
  ];

  return (
    <>
      <footer className="w-full bg-[#002D2F] text-white font-[lexend]">
        {/* 1. SEPARATE BLOCK: Newsletter (Abunə Ol) */}
        <div className="w-full bg-[#003A3C] py-10 px-4 border-b border-[#004d50]">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold">
              Sayta daxil edilən məlumatlardan xəbərdar ol.
            </h3>
            <form
              // onSubmit={(e) => e.preventDefault()}
              className="flex items-center max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                placeholder="E-poçt"
                className="w-full px-4 py-3 bg-[#002D2F] border border-[#005255] rounded-l-md text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#008B8F]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#004d50] hover:bg-[#005f63] border border-[#005255] border-l-0 rounded-r-md text-sm font-medium whitespace-nowrap transition-colors"
              >
                Abunə ol
              </button>
            </form>
          </div>
        </div>

        {/* 2. MAIN FOOTER BLOCK: Brand, Navlinks, Socials & Copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-24 lg:pb-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            {/* Logo & Subtitle */}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-wider">
                Elşən <span className="text-[#E59835]">İsmayılov</span>
              </h2>
              <p className="text-xs text-gray-300 tracking-widest uppercase">
                İslamşünas-Teoloq
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-3">
              {[
                { icon: FaInstagram, href: "#" },
                { icon: FaFacebookF, href: "#" },
                { icon: FaYoutube, href: "#" },
                { icon: FaTiktok, href: "#" },
                { icon: FaTelegramPlane, href: "#" },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-9 h-9 rounded-full border border-[#005255] flex items-center justify-center text-gray-300 hover:text-white hover:border-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>

            {/* Copyright */}
            <div className="w-full max-w-xs border-t border-[#004d50] pt-6">
              <div className="flex items-center justify-center space-x-3 text-xs text-gray-400">
                <p>© 2026 Bütün hüquqlar qorunur.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (SABİT MENYU) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#002D2F] border-t border-[#004d50] px-2 py-2 shadow-2xl">
        <nav className="flex justify-around items-center">
          {bottomNavItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className="flex flex-col items-center justify-center w-full py-1 text-[11px] font-[lexend] text-gray-300 hover:text-[#E59835] transition-colors"
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
