"use client";
import React, { useEffect, useState } from "react";
import { useCategory } from "@/app/hooks/useCategory";
import { navLinks, type_map } from "@/app/shared";
import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import { useVideos } from "@/app/hooks/useVideos";
import { useArticles } from "@/app/hooks/useArticle";
import VideoCard from "@/app/components/molecules/VideoCard/VideoCard";
import ArticleDataUI from "@/app/components/molecules/ArticleCard/ArticleDataUI";
import Pagination from "@/app/components/layouts/navbar/pagination";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMediaQuery } from "@/app/utils/useMediaQuery";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/swiper.css";
import Section from "@/app/components/molecules/Section/Section";
import SectionHeader from "@/app/components/atoms/SectionHeader/SectionHeader";
import SectionTotal from "@/app/components/atoms/SectionTotal";
import FilterComponent from "@/app/components/molecules/FilterComponent";

export default function CategoryPage({ params }) {
  const { slug } = React.use(params);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("categoryId");
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const [open, setOpen] = useState({
    link: "",
    isOpen: false,
  });

  const [expanded, setExpanded] = useState({
    id: null,
    isExpanded: false,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(
    categoryIdFromUrl ? [Number(categoryIdFromUrl)] : []
  );
  const [paginationOption, setPaginationOption] = useState({
    limit: 9,
    page: 1,
  });

  const isVideoTab = [0, 1, 2, 3].includes(activeTab);
  const { data: categories, isLoading } = useCategory(activeTab);

  const { data: allVideos, isLoading: isVideoLoading } = useVideos({
    ...paginationOption,
    type: activeTab,
    categoryIds: selectedCategory.includes(9999) ? [] : selectedCategory,
    enabled: isVideoTab,
  });

  const { data: articles } = useArticles({
    ...paginationOption,
    categoryIds: selectedCategory.includes(9999) ? [] : selectedCategory,
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

  useEffect(() => {
    if (categoryIdFromUrl) {
      setSelectedCategory([Number(categoryIdFromUrl)]);
    }
  }, [categoryIdFromUrl]);

  useEffect(() => {
    const currentNav = navLinks().find((t) => t.href === pathname);
    if (currentNav) {
      setActiveTab(currentNav.type);
    }
  }, [pathname]);

  const setCurrentPage = (page) => {
    setPaginationOption((prev) => ({ ...prev, page }));
  };

  const sorting = (a, b) => {
    if (a?.Name === "Ümumi") return -1;
    if (b?.Name === "Ümumi") return 1;
    return 0;
  };

  const RadioItem = ({
    id,
    label,
    value,
    isSelected,
    onChange,
    hasDropdown,
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
          className={`ml-3 text-sm hover:text-[#003A3C] font-[lexend] ${
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

  return (
    <>
      {!isLargeScreen && (
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
          <div className="p-4">
            <div className="mb-10 mt-4">
              <Swiper
                modules={[FreeMode]}
                slidesPerView="auto"
                spaceBetween={10}
                freeMode={{
                  enabled: true,
                  momentumRatio: 0.5,
                  momentumVelocityRatio: 0.5,
                }}
              >
                {navLinks()?.map((nav) => {
                  const Icon = nav.icon;
                  if (nav?.type || nav?.type === 0)
                    return (
                      <SwiperSlide key={nav?.type} className="!w-auto">
                        <Link
                          className={`${
                            activeTab === nav?.type
                              ? "bg-[#003A3C] text-white"
                              : "text-[#909090]"
                          } rounded-[6px] text-base p-2 font-[lexend] cursor-pointer flex justify-center items-center h-full`}
                          href={nav?.href}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Icon
                            color={activeTab === nav?.type ? "#fff" : "#909090"}
                          />
                          <div className="ml-2 whitespace-nowrap">
                            {nav?.label}
                          </div>
                        </Link>
                      </SwiperSlide>
                    );
                })}
              </Swiper>
            </div>
            {isLoading ? (
              <CategoryListSkeleton />
            ) : (
              <div>
                {categories?.data?.sort(sorting).map((d) => (
                  <div
                    key={d?.Id}
                    className="border-b border-gray-200 pt-4 pb-4"
                  >
                    <RadioItem
                      id={d?.Id}
                      label={d?.Name}
                      value={d?.Id}
                      isSelected={selectedCategory.includes(d?.Id)}
                      onChange={handleRadioChange}
                      hasDropdown={d?.children?.length > 0}
                      onDropdownClick={() =>
                        setExpanded({
                          isExpanded: !(
                            expanded.isExpanded && expanded.id === d?.Id
                          ),
                          id: d?.Id,
                        })
                      }
                    />
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
            )}
          </div>
        </Sidebar>
      )}

      {/* Ən xarici div-ə mobil üçün məcburi padding (px-5) tətbiq edildi */}
      <div className="w-full sm:px-6 lg:px-8 max-w-7xl mx-auto box-border">
        <Breadcrumb page={`/${slug}`} />

        {isLargeScreen ? (
          <div className="grid grid-cols-6 gap-x-2 md:mb-20 mt-4">
            {navLinks()?.map((nav) => {
              const Icon = nav.icon;
              if (nav?.type || nav?.type === 0)
                return (
                  <Link
                    key={nav?.type}
                    className={`${
                      activeTab === nav?.type
                        ? "bg-[#003A3C] text-white"
                        : "text-[#909090]"
                    } rounded-[6px] text-base p-2 font-[lexend] cursor-pointer flex justify-center items-center`}
                    href={nav?.href}
                  >
                    <Icon
                      color={activeTab === nav?.type ? "#fff" : "#909090"}
                    />
                    <div className="ml-2">{nav?.label}</div>
                  </Link>
                );
            })}
          </div>
        ) : (
          <SectionHeader
            label={type_map[slug].label}
            icon={type_map[slug].icon}
            total={allVideos?.total}
            FilterButton={
              <FilterComponent setIsSidebarOpen={setIsSidebarOpen} />
            }
            TotalComponent={
              <SectionTotal
                total={allVideos?.total}
                icon={
                  type_map[slug].label === "Məqalələr"
                    ? "/icons/article-icon.svg"
                    : type_map[slug].label === "Kitablar"
                    ? "/icons/book-icon.svg"
                    : "/icons/play-circle.svg"
                }
              />
            }
          />
        )}
        <br />
        <div className="flex flex-col lg:flex-row justify-between gap-6 w-full box-border">
          {isLargeScreen && (
            <div className="w-[231px] sticky top-[90px] self-start h-fit flex-shrink-0">
              {isLoading ? (
                <CategoryListSkeleton />
              ) : (
                categories?.data?.sort(sorting).map((d) => (
                  <div
                    key={d?.Id}
                    className="border-b border-gray-200 pt-4 pb-4"
                  >
                    <RadioItem
                      id={d?.Id}
                      label={d?.Name}
                      value={d?.Id}
                      isSelected={selectedCategory.includes(d?.Id)}
                      onChange={handleRadioChange}
                      hasDropdown={d?.children?.length > 0}
                      onDropdownClick={() =>
                        setExpanded({
                          isExpanded: !(
                            expanded.isExpanded && expanded.id === d?.Id
                          ),
                          id: d?.Id,
                        })
                      }
                    />
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
                ))
              )}
            </div>
          )}

          {/* Grid konteynerin kənara daşmasını önləmək üçün w-full və box-border artırıldı */}
          <main className="flex-1 pb-10 w-full box-border">
            {isVideoLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {Array(9)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="w-full bg-white rounded-xl overflow-hidden"
                    >
                      <div className="animate-pulse flex flex-col p-0">
                        <div className="bg-gray-300 h-52 w-full rounded-lg"></div>
                        <div className="flex flex-col mt-4 space-y-3 px-2 pb-4">
                          <div className="h-3 bg-gray-300 rounded w-20"></div>
                          <div className="h-5 bg-gray-300 rounded w-full"></div>
                          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              ![4, 5].includes(activeTab) &&
              (allVideos?.data?.length > 0 ? (
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {allVideos?.data?.map((video) => (
                      <VideoCard
                        key={video.Id}
                        data={video}
                        setOpen={setOpen}
                      />
                    ))}
                  </div>
                  <div className="mt-10">
                    {allVideos?.total !== undefined &&
                      allVideos?.total > allVideos?.data?.length && (
                        <Pagination
                          totalPages={Math.ceil(allVideos?.total / 9)}
                          currentPage={paginationOption?.page}
                          setCurrentPage={setCurrentPage}
                        />
                      )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 py-10 text-center w-full">
                  Yeni kontent tezliklə yüklənəcək..
                </div>
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
          </main>
        </div>
      </div>
    </>
  );
}

const Sidebar = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "bg-black/50 opacity-100" : "opacity-0 invisible"
      }`}
      onClick={onClose}
      role="dialog"
    >
      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <br />
        {children}
      </div>
    </div>
  );
};

const CategoryListSkeleton = () => (
  <div className="flex flex-col w-full">
    {Array(9)
      .fill(0)
      .map((_, i) => (
        <div
          className="animate-pulse flex items-center space-x-3 py-3 border-b border-gray-100 last:border-0"
          key={i}
        >
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-full max-w-[150px]"></div>
          <div className="h-4 w-4 bg-gray-100 rounded ml-auto"></div>
        </div>
      ))}
  </div>
);
