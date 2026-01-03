"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import SocialLinks from "@/app/components/shared/SocialLinks";
import { useSliders } from "@/app/hooks/useSlider";

export default function Slider() {
  const [slides, setSlides] = useState([
    {
      image: "/images/main-slide1.jpg",
      title: "Slide 1",
      link: "#",
    },
    {
      image: "/images/main-slide2.jpg",
      title: "Slide 1",
      link: "#",
    },
    {
      image: "/images/main-slide1.jpg",
      title: "Slide 1",
      link: "#",
    },
  ]);
  const { data: sliders, isLoading } = useSliders();

  console.log(sliders);
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
  console.log(sliders);
  return (
    <div>
      <div className="relative">
        <div className="absolute  top-50 right-10 z-10  ">
          <SocialLinks />
        </div>
      </div>
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        slidesPerView={1}
        // navigation
        // autoplay={{ delay: 3000 }}
        speed={2000}
        loop={true}
        className="mainSlide"
        pagination={{ clickable: true }}
      >
        {sliders?.data.map((slide) => (
          <SwiperSlide>
            <a href={slide.Link} target="_blank" rel="noopener noreferrer">
              <img
                src={slide.Image}
                alt=""
                loading="lazy"
                className="w-full h-[626px] object-cover object-top"
              />
              {/* <Image
              //   className={styles.logo}
              src={slide.image}
              alt="Elshan Ismayilov logo"
              width={163}
              height={26}
              priority
            /> */}
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
