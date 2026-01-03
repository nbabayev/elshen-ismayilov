"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import SocialLinks from "@/app/components/shared/SocialLinks";

export default function MiniSlider() {
  const [slides, setSlides] = useState([
    {
      image: "/images/slide1.png",
      title: "Slide 1",
      link: "#",
    },
    {
      image: "/images/slide2.png",
      title: "Slide 1",
      link: "#",
    },
    {
      image: "/images/slide3.png",
      title: "Slide 1",
      link: "#",
    },
    {
      image: "/images/slide4.png",
      title: "Slide 1",
      link: "#",
    },
    {
      image: "/images/slide5.png",
      title: "Slide 1",
      link: "#",
    },
    {
      image: "/images/slide6.png",
      title: "Slide 2",
      link: "#",
    },
    {
      image: "/images/slide5.png",
      title: "Slide 4",
      link: "#",
    },
    {
      image: "/images/slide2.png",
      title: "Slide 4",
      link: "#",
    },
  ]);

  // useEffect(() => {
  //   async function fetchSlides() {
  //     try {
  //       const res = await fetch("http://localhost:5000/api/videos"); // backend endpoint
  //       const data = await res.json();
  //       setSlides(data);
  //       console.log(data);
  //     } catch (error) {
  //       console.error("Error fetching slides:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchSlides();
  // }, []);
  // if (loading) return <p>Loading...</p>;
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={20}
      // slidesPerGroup={1}
      className="miniSlide"
      // loop={false}
      // centeredSlides={false}
      // resistanceRatio={2}
      // touchReleaseOnEdges
      slidesPerView={slides.length > 6 ? 6.2 : slides.length}
      // touchReleaseOnEdges={true}
      // centeredSlidesBounds={false}
      // pagination={{ clickable: true }}
    >
      {slides.map((slide) => (
        <SwiperSlide>
          <div>
            <a href="">
              <img
                src={slide.image}
                alt=""
                loading="lazy"
                // className="w-full h-[626px] object-cover object-top"
              />
            </a>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
