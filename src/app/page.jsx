"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Button from "@/components/atoms/Button/Button";
import ShareIcon from "@/components/shared/ShareIcon";
import Section from "@/components/molecules/Section/Section";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
// import { Box, Container } from "@mui/material";
import LessonCard from "@/components/molecules/LessonCard/LessonCard";
import VideoCard from "@/components/molecules/VideoCard/VideoCard";
import { margin } from "@/utils/margin";
import FormInput from "@/components/atoms/FormInput/FormInput";
import Articles from "@/components/organisms/Articles/Articles";
import Subscription from "@/components/molecules/Subscription/Subscription";

const lessons = [
  {
    id: 1,
    title: "İlahi övliya insanın ruhu üçün zəruri komponentdir",
    image: "/images/lessons-img1.jpg",
    badge: "Yeni",
    date: "Avqust 01",
  },
  {
    id: 2,
    title: "Allaha ən yaxın varlıqlar. Kimdir onlar?",
    image: "/images/lessons-img2.jpg",
    date: "Avqust 01",
  },
  {
    id: 3,
    title: "Günahla mübarizədə necə müvəffəq olaq?",
    image: "/images/lessons-img3.jpg",
    date: "Avqust 01",
  },
];

const videos = [
  {
    id: 1,
    title: "İlahi övliya insanın ruhu üçün zəruri komponentdir",
    image: "/images/video-img1.jpg",
    badge: "Yeni",
    date: "20 Sentyabr",
  },
  {
    id: 2,
    title: "Allaha ən yaxın varlıqlar. Kimdir onlar?",
    image: "/images/video-img2.jpg",
    date: "20 Sentyabr",
  },
  {
    id: 3,
    title: "Günahla mübarizədə necə müvəffəq olaq?",
    image: "/images/video-img3.jpg",
    date: "20 Sentyabr",
  },
  {
    id: 4,
    title: "Günahla mübarizədə necə müvəffəq olaq?",
    image: "/images/video-img4.jpg",
    date: "20 Sentyabr",
  },
];

const articles = [
  {
    id: 1,
    title: "İlahi övliya insanın ruhu üçün zəruri komponentdir",
    subtitle: `Bir mühüm məsələni nəzərinizə çatdırmaq istərdik ki, bəzi hallarda dinin əmr və 
      göstərişləri ilə bağlı yanlış olaraq belə təsəvvür yaranır ki, Allahın insanları yaradıb və
       bunun müqabilində onlardan bəndəlik etmələrini tələb edir.`,
    date: "2025-09-12",
    image: "/images/highlighted-article.png",
    views: 120,
    highlighted: true,
  },
  {
    id: 2,
    title: "İlahi övliya insanın ruhu üçün zəruri komponentdir",
    subtitle: `Bir mühüm məsələni nəzərinizə çatdırmaq istərdik ki, bəzi hallarda dinin əmr və 
      göstərişləri ilə bağlı yanlış olaraq belə təsəvvür yaranır ki, Allahın insanları yaradıb və
       bunun müqabilində onlardan bəndəlik etmələrini tələb edir.`,
    date: "2025-09-12",
    image: "/images/article-1.png",
    views: 120,
  },
  {
    id: 3,
    title: "Allaha ən yaxın varlıqlar. Kimdir onlar?",
    subtitle: `Bir mühüm məsələni nəzərinizə çatdırmaq istərdik ki, bəzi hallarda dinin əmr və göstərişləri ilə
     bağlı yanlış olaraq belə təsəvvür yaranır ki,
       Allahın insanları yaradıb və bunun müqabilində onlardan bəndəlik etmələrini tələb edir.`,
    date: "2025-09-12",
    image: "/images/article-2.png",
    views: 98,
  },
  {
    id: 4,
    title: "Günahla mübarizədə necə müvəffəq olaq?",
    subtitle: `Bir mühüm məsələni nəzərinizə çatdırmaq istərdik ki, bəzi hallarda dinin əmr və göstərişləri ilə
     bağlı yanlış olaraq belə təsəvvür yaranır ki, 
      Allahın insanları yaradıb və bunun müqabilində onlardan bəndəlik etmələrini tələb edir.`,
    date: "2025-09-12",
    image: "/images/article-3.png",
    views: 150,
  },
];
export default function Home() {
  return (
    <div
    // className={styles.page}
    >
      {/* <main className={styles.main}> */}
      {/* <Image
        className={styles.logo}
        src="/next.svg"
        alt="Next.js logo"
        width={180}
        height={38}
        priority
      /> */}
      {/* <Button icon={<ShareIcon />}>Paylaş</Button>
      <Button>Göndər</Button>
      <Button icon={<ShareIcon />} /> */}
      <Section
        sectionHeader={
          <SectionHeader label="Dərslər" icon="/icons/section-book.png" />
        }
        content={<LessonsSection />}
        patternClass="lesson-section-pattern"
      />

      <Section
        sectionHeader={
          <SectionHeader label="Moizələr" icon="/icons/section-sermons.png" />
        }
        content={<OtherSection />}
      />
      <Section
        sectionHeader={
          <SectionHeader label="Təlimlər" icon="/icons/section-training.png" />
        }
        content={<OtherSection />}
      />
      <Section
        sectionHeader={
          <SectionHeader label="Çıxışlar" icon="/icons/section-speech.png" />
        }
        content={<OtherSection />}
      />
      <Newsletter />

      <Section
        sectionHeader={
          <SectionHeader label="Məqalələr" icon="/icons/pen.png" />
        }
        content={<Articles data={articles} />}
      />
    </div>
  );
}

export function LessonsSection() {
  return (
    // <div
    //   style={{
    //     backgroundImage: "url('/images/pattern1.png')",
    //     width: "100%",
    //     height: "592px",
    //     backgroundPosition: " 0px 150px",
    //     backgroundRepeat: "no-repeat",
    //     backgroundSize: "cover",
    //   }}
    //   className="flex justify-center"
    // >

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 380px))",
        gap: "20px",
      }}
    >
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>

    // </div>
  );
}

export function OtherSection() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 280px))",
        gap: "20px",
      }}
    >
      {videos.map((lesson) => (
        <VideoCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}

export function Newsletter() {
  return (
    <div className="flex justify-center items-center newsletter-section-pattern">
      <div className="container max-w-[1180px]">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 49%))",
            gap: "20px",
          }}
        >
          <div className="text-light">
            <div className="text-4xl leading-[120%] font-playfair">
              Allaha tərəf qaçın!
            </div>
            <div className={`leading-[148%] font-lexend mt-4 text-3xl text-lg`}>
              Zariyat 51/50
            </div>
            <Subscription />
          </div>
          <div>
            <img src="/images/newsletter-img.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
