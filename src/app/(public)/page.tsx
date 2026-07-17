"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";

import Section from "@/app/components/molecules/Section/Section";
import SectionHeader from "@/app/components/atoms/SectionHeader/SectionHeader";
// import { Box, Container } from "@mui/material";
import LessonCard from "@/app/components/molecules/LessonCard/LessonCard";
import VideoCard from "@/app/components/molecules/VideoCard/VideoCard";
import { margin } from "@/app/utils/margin";
import FormInput from "@/app/components/atoms/FormInput/FormInput";
import Articles from "@/app/components/organisms/HomeArticles/Articles";
import Subscription from "@/app/components/molecules/Subscription/Subscription";
import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import React, { useState } from "react";
import { useArticles } from "@/app/hooks/useArticle";
import { BaseParams } from "@/app/shared";
import { useFetchVideoContent } from "@/app/hooks/useFetchVideoContent";
import Container from "@/app/components/shared/Container";
import MiniSlider from "@/app/components/atoms/MiniSlider";
import Slider from "@/app/components/shared/Slider";
import CardSlider from "@/app/components/molecules/CardSlider";
import { useSliders } from "@/app/hooks/useSlider";
import SectionTotal from "@/app/components/atoms/SectionTotal";
// This is the main homepage component that fetches and displays various sections of content, including sliders, videos,
//  and articles. It uses custom hooks to fetch data and renders different sections based on the fetched content.
export default function Home() {
  const { data: sliders, isLoading: sliderLoading } = useSliders();

  const { data: articles, isLoading: isArticleLoad } = useArticles({
    limit: 4,
    page: 1,
    // enabled: activeTab === 4, bura zaman ya da slide top yazmaq olar
  });

  const { sermons, trainings, speeches, lessons, isLoading } =
    useFetchVideoContent();
  const sections = [
    {
      label: "Dərslər",
      icon: "/icons/section-book.png",
      videos: lessons?.data,
      pattern: "lesson-section-pattern",
      type: "0",
      total: lessons?.total,
      link: "lessons",
    },
    {
      label: "Moizələr",
      icon: "/icons/section-sermons.png",
      videos: sermons?.data,
      total: sermons?.total,
      link: "sermons",
    },
    {
      label: "Təlimlər",
      icon: "/icons/section-training.png",
      videos: trainings?.data,
      total: trainings?.total,
      link: "trainings",
    },
    {
      label: "Verilişlər",
      icon: "/icons/section-speech.png",
      videos: speeches?.data,
      total: speeches?.total,
      link: "speeches",
    },
  ];

  return (
    <div>
      <Slider data={sliders} loading={sliderLoading} />

      <div className="relative -translate-y-30 z-[2]">
        <div className="max-w-[1250px] mx-auto ps-6 sm:px-4 md:px-6 lg:px-8">
          <MiniSlider />
        </div>
      </div>
      <>
        {sections.map((section, idx) => (
          <Section
            ref={null}
            key={idx}
            patternClass={section.pattern || null}
            sectionHeader={
              <SectionHeader
                label={section.label}
                icon={section.icon}
                TotalComponent={
                  <SectionTotal
                    total={section.total}
                    icon="/icons/play-circle.svg"
                  />
                }
                link={section.link}
                isPriority={section.label === "Dərslər"}
              />
            }
            content={<VideoGrid videos={section.videos} type={section.type} />}
          />
        ))}
      </>
      <Newsletter />

      <Section
        ref={null}
        patternClass={null}
        sectionHeader={
          <SectionHeader
            label="Məqalələr"
            icon="/icons/pen.png"
            link="articles"
            TotalComponent={
              <SectionTotal
                total={articles?.total}
                icon="/icons/article-icon.svg"
              />
            }
          />
        }
        content={<Articles data={articles?.data} />}
      />
    </div>
  );
}
function VideoGrid({ videos, type }: { videos: []; type: string | undefined }) {
  const [open, setOpen] = useState({
    link: "",
    isOpen: false,
  });
  return (
    <div>
      <CardSlider data={videos} type={type} setOpen={setOpen} />
      {open.isOpen && (
        <div
          className="fixed inset-0 bg-[#00000073] bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setOpen((prev) => ({ ...prev, isOpen: false }))}
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-lg w-[90%] max-w-3xl relative">
            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={open.link}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Newsletter() {
  return (
    <div className="flex justify-center items-center newsletter-section-pattern mb-15">
      <div className="max-w-[1180px] md:px-6 px-6 sm:px-4 lg:px-8 py-8">
        <div
          className="grid md:grid-cols-[1fr_1fr] grid-cols-[1fr] gap-5 pb-26"
          // style={{
          //   display: "grid",
          //   gridTemplateColumns: "repeat(auto-fill, minmax(260px, 49%))",
          //   gap: "20px",
          // }}
        >
          <div className="text-white mt-10 max-sm:text-center order-2 md:order-1">
            <div className="text-2xl md:text-4xl leading-[120%] font-playfair">
              Allaha tərəf qaçın!
            </div>
            <div
              className={`leading-[148%] font-lexend mt-4 text-base md:text-3xl`}
            >
              Zariyat 51/50
            </div>
            <div className="mt-10">
              <Subscription titleFont="text-sm" center="" />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img src="/images/newsletter-img.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
