import Container from "@/app/components/shared/Container";
import Link from "next/link";
import React from "react";
import shared_styles from "../../../shared/shared.module.scss";
import Subscription from "@/app/components/molecules/Subscription/Subscription";

const Footer = () => {
  return (
    <div className="bg-[url(/images/footer-pattern.png)] bg-repeat-x bg-top bg-[#003A3C] mt-30">
      <Container>
        <div className="pt-[76px] grid grid-cols-[60%_40%] pb-10">
          <div className="grid grid-cols-[1fr_1fr] gap-23">
            <div>
              <img src="/images/footer-logo.png" alt="" />
            </div>
            <div className="font-[lexend] text-[#F0EDEA] text-base  grid-cols-[50%_50%] hidden md:grid gap-4">
              <Link href="/" className="text-[#F0EDEA] text-base">
                Əsas səhifə
              </Link>
              <Link href="/about">Haqqında</Link>
              <Link href="/lessons">Dərslər</Link>
              <Link href="/dashboard">Moizələr</Link>
              <Link href="/dashboard">Təlimlər</Link>
              <Link href="/dashboard">Verilişlər</Link>
              <Link href="/dashboard">Məqalələr</Link>
              <Link href="/dashboard">Çıxışlar</Link>
            </div>
          </div>
          <div className="flex justify-end">
            <Subscription titleFont="text-xs" />
          </div>
        </div>
        <div className="border-t border-[#E1E1E1]">
          {/* <div className="border-t border-[#E1E1E1] mt-20 mb-10"></div> */}
          <div className="text-[#F0EDEA4D] text-sm pb-10 pt-6 font-[lexend]">
            © {new Date().getFullYear()} Bütün hüquqlar qorunur.
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
