"use client";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, A11y } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Slider() {
  // const [slides, setSlides] = useState([]);
  // const [loading, setLoading] = useState(true);

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
    <div></div>
    // <Swiper
    //   modules={[Navigation, Pagination, A11y]}
    //   spaceBetween={50}
    //   slidesPerView={3}
    //   navigation
    //   pagination={{ clickable: true }}
    // >
    //   {/* {slides.map((slide) => (
    //     <SwiperSlide>
    //       <a href="">
    //         <Image
    //           //   className={styles.logo}
    //           src="/images/slide1"
    //           alt="Elshan Ismayilov logo"
    //           width={163}
    //           height={26}
    //           priority
    //         />
    //       </a>
    //     </SwiperSlide>
    //   ))} */}
    // </Swiper>
  );
}
