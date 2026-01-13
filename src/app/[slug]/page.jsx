"use client";
import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import { useCategory } from "@/app/hooks/useCategory";
import { navLinks, tabs } from "@/app/shared";
import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import Container from "@/app/components/shared/Container";
import { useVideos } from "@/app/hooks/useVideos";
import { useArticle, useArticles } from "@/app/hooks/useArticle";
import VideoCard from "@/app/components/molecules/VideoCard/VideoCard";
import ArticleDataUI from "@/app/components/molecules/ArticleCard/ArticleDataUI";
import Article from "@/app/components/molecules/ArticleCard/ArticleCard";
import Pagination from "@/app/components/layouts/navbar/pagination";
import { usePathname } from "next/navigation";
import Link from "next/link";

// SEO metadata
// export async function generateMetadata({ params }) {
//   const titles = {
//     books: "Books - My Website",
//     movies: "Movies - My Website",
//     music: "Music - My Website",
//     lessons: "Lessons - My Website",
//   };

//   return {
//     title: titles[params.slug] ?? "Categories - My Website",
//     description: `Explore the best ${params.slug} on our website`,
//   };
// }

export default function CategoryPage({ params }) {
  const { slug } = React.use(params);
  const pathname = usePathname();
  const [checkedItems, setCheckedItems] = useState({
    umumi: false,
    islamEtiqadi: true,
    islamDunyagorusu: false,
    nubuvvet: false,
    tovhidVeEdi: false,
    imamet: false,
    mead: false,
    islamExlaqi: true,
    islamTarixi: false,
    imamlarinTarixi: false,
    irfanla: false,
    quranla: false,
    mehdaviyyet: false,
  });

  const [open, setOpen] = useState({
    link: "",
    isOpen: false,
  });

  const [selectedItem, setSelectedItem] = useState("islamEtiqadi");
  const [expanded, setExpanded] = useState({
    id: null,
    isExpanded: false,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [paginationOption, setPaginationOption] = useState({
    limit: 9,
    page: 1,
  });
  const isVideoTab =
    activeTab === 0 || activeTab === 1 || activeTab === 2 || activeTab === 3;
  const { data: categories, isLoading } = useCategory(activeTab);
  const { data: allVideos, isLoading: isVideoLoading } = useVideos({
    ...paginationOption,
    type: activeTab,
    categoryIds: selectedCategory.includes(9999) ? [] : selectedCategory,
    enabled: isVideoTab,
  });
  const { data: articles, isArticleLoad } = useArticles({
    ...paginationOption,
    enabled: activeTab === 4,
  });

  const handleRadioChange = (value) => {
    if (value === 9999) {
      setSelectedCategory([9999]);
    } else {
      let final = selectedCategory.includes(9999)
        ? [value]
        : selectedCategory.includes(value)
        ? selectedCategory.filter((p) => p !== value)
        : selectedCategory.concat([value]);

      setSelectedCategory(final);
    }
  };

  console.log(selectedCategory);
  useEffect(() => {
    setActiveTab(navLinks().find((t) => t.href === pathname)?.type);
  }, [pathname]);
  const RadioItem = ({
    id,
    label,
    value,
    isSelected,
    onChange,
    hasDropdown,
    isMainItem,
    onDropdownClick,
  }) => (
    <div className="flex items-center">
      <label className="flex items-center cursor-pointer flex-1" htmlFor={id}>
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isSelected}
            onChange={() => onChange(value)}
            id={id}
            name="islamicStudies"
          />
          <div
            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
              isSelected ? "border-[#003A3C] bg-white" : "border-gray-300"
            }`}
          >
            {isSelected && (
              <div className="w-3 h-3 bg-[#003A3C] rounded-full"></div>
            )}
          </div>
        </div>
        <span
          className={`ml-3 text-sm  hover:text-[#003A3C] font-[lexend] ${
            isSelected ? "text-[#003A3C]" : "text-[#878787]"
          }`}
        >
          {label}
        </span>
      </label>
      {hasDropdown && (
        <div className="cursor-pointer p-1" onClick={onDropdownClick}>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      )}
    </div>
  );

  // useEffect(() => {
  //   setPaginationOption(
  //     videosByCategory?.data?.length
  //       ? {
  //           limit: videosByCategory?.limit,
  //           page: videosByCategory?.page,
  //         }
  //       : {
  //           limit: allVideos?.limit,
  //           page: allVideos?.page,
  //         }
  //   );
  // }, [videosByCategory, allVideos]);

  // let videos = {};

  // if (videosByCategory?.data?.length) {
  //   videos = {
  //     data: videosByCategory.data,
  //     total: videosByCategory?.total,
  //   };
  // } else {
  // videos = {
  //   data: allVideos?.data || [],
  //   total: allVideos?.total,
  // };
  // }

  const setCurrentPage = (page) => {
    setPaginationOption((prev) => ({ ...prev, page }));
  };

  const sorting = (a, b) => {
    if (a?.Name === "Ümumi") return -1;
    if (b?.Name === "Ümumi") return 1;
    return 0;
  };
  return (
    <div>
      <Breadcrumb page={`/${slug}`} />
      <div className="grid md:grid-cols-[10%_10%_10%_10%_10%_10%]  grid-cols-[100%]  mb-20 mt-4">
        {navLinks()?.map((nav) => {
          const Icon = nav.icon;
          if (nav?.type || nav?.type === 0)
            return (
              <Link
                key={nav?.type}
                className={`${
                  activeTab === nav?.type && "bg-[#003A3C] text-white"
                } rounded-[6px] text-[#909090] text-base p-2  font-[lexend] cursor-pointer flex justify-center items-center`}
                href={nav?.href}
              >
                {<Icon color={activeTab === nav?.type ? "#fff" : "#909090"} />}
                {/* {t?.icon(activeTab ? "text-white" : "text-[#909090]")} */}
                {/* <img src={t?.icon} alt="" /> */}
                <div className="ml-2">{nav?.label}</div>
              </Link>
            );
        })}
      </div>
      <div className="flex">
        <div className="w-[231px] mx-auto sticky top-[90px] self-start h-fit">
          {/* Ümumi */}
          {/* <div className="border-b border-gray-200 pt-4 pb-4">
            <RadioItem
              id={categories?.data[0]?.Id || "umumi"}
              label={categories?.data[0]?.Name || "Ümumi"}
              value={categories?.data[0]?.Id || "umumi"}
              isSelected={[categories?.data[0]?.Id || "umumi"].includes(selectedCategory)}
              onChange={handleRadioChange}
            />
          </div> */}
          {categories?.data?.sort(sorting).map((d) => (
            <div key={d?.Id} className="border-b border-gray-200 pt-4 pb-4">
              {/* {!d?.isHidden ? ( */}
              <RadioItem
                key={d?.Id}
                id={d?.Id}
                label={d?.Name}
                value={d?.Id}
                isSelected={selectedCategory.includes(d?.Id)}
                onChange={handleRadioChange}
                hasDropdown={d?.children?.length > 0}
                isMainItem={true}
                onDropdownClick={() =>
                  setExpanded({ isExpanded: !expanded.isExpanded, id: d?.Id })
                }
              />
              {/* // ) : null} */}
              {expanded?.isExpanded &&
                expanded?.id === d?.Id &&
                d?.children?.map((child) => (
                  <div className="ml-8 mt-3 space-y-3" key={child?.Id}>
                    <RadioItem
                      id={child?.Id}
                      label={child?.Name}
                      value={child?.Id}
                      isSelected={selectedCategory.includes(child?.Id)}
                      onChange={handleRadioChange}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>

        <main className="flex-1 ml-10">
          {isVideoLoading ? (
            <div>Yüklənir..</div>
          ) : (
            ![4, 5].includes(activeTab) &&
            (allVideos?.data?.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(260px, 268px))",
                  gap: "20px",
                }}
              >
                {allVideos?.data?.map((video) => (
                  <VideoCard key={video.Id} video={video} setOpen={setOpen} />
                ))}
              </div>
            ) : (
              <div>Yeni kontent tezliklə yüklənəcək..</div>
            ))
          )}
          {activeTab === 4 && (
            <ArticleDataUI
              data={articles}
              paginationOption={paginationOption}
              setCurrentPage={setCurrentPage}
            />
          )}

          {open.isOpen && (
            <div
              className="fixed inset-0 bg-[#00000073] bg-opacity-70 flex items-center justify-center z-50"
              onClick={() => setOpen({})}
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-lg w-[90%] max-w-3xl relative">
                {/* Close Button */}
                {/* <button
                  onClick={() => setOpen({})}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                >
                  ✕
                </button> */}
                <div className="w-full aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={open.link}
                    // title={video.Title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
