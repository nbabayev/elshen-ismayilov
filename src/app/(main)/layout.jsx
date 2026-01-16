import Navbar from "@/app/components/layouts/navbar/navbar";
import Footer from "@/app/components/layouts/navbar/Footer/Footer";
import Slider from "@/app/components/shared/Slider";
import MiniSlider from "@/app/components/atoms/MiniSlider";
import Container from "@/app/components/shared/Container";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
