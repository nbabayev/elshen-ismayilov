import Navbar from "@/app/components/layouts/navbar/navbar";
import Footer from "@/app/components/layouts/navbar/Footer/Footer";
import ScrollToTop from "@/app/components/layouts/ScrollToTop";
import { MobileBottomNav } from "@/app/components/molecules/MobileNav";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ScrollToTop />
      <MobileBottomNav />
    </>
  );
}
