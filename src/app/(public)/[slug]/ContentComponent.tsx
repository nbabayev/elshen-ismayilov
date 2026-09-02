"use client";

import React, {
  useState,
  useEffect,
  ReactNode,
  FC,
  useMemo,
  useTransition,
} from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/swiper.css";

import { useCategory } from "@/app/hooks/useCategory";
import { useVideos } from "@/app/hooks/useVideos";
import { useArticles } from "@/app/hooks/useArticle";
import { navLinks, type_map } from "@/app/shared";
import { useMediaQuery } from "@/app/utils/useMediaQuery";

import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import VideoCard from "@/app/components/molecules/VideoCard";
import ArticleDataUI from "@/app/components/molecules/ArticleCard/ArticleDataUI";
import Pagination from "@/app/components/layouts/navbar/pagination";
import SectionHeader from "@/app/components/atoms/SectionHeader/SectionHeader";
import SectionTotal from "@/app/components/atoms/SectionTotal";
import FilterComponent from "@/app/components/molecules/FilterComponent";
import { CustomRadioItem as RadioItem } from "@/app/components/molecules/CustomRadioItem";
import { slugToTab } from "@/app/types";

// --- Types & Interfaces ---

export interface CategoryClientUIProps {
  slug: string;
  initialCategoryId?: string;
  currentPage?: number;
}

export interface CategoryChild {
  Id: number;
  Name: string;
}

export interface Category {
  Id: number;
  Name: string;
  children?: CategoryChild[];
}

export interface VideoItem {
  Id: number;
  [key: string]: unknown;
}

export interface ModalState {
  link?: string;
  isOpen: boolean;
}

export interface ExpandedState {
  id: number | null;
  isExpanded: boolean;
}

export interface PaginationOptions {
  limit: number;
  page: number;
}

export interface NavLinkItem {
  type: number;
  label: string;
  href: string;
  icon: React.ComponentType<{ color?: string }>;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

// --- Main Component ---

const ContentComponent = ({
  slug,
  initialCategoryId,
  currentPage,
}: CategoryClientUIProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<ModalState>({ link: "", isOpen: false });
  const [expanded, setExpanded] = useState<ExpandedState>({
    id: null,
    isExpanded: false,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // const [activeTab, setActiveTab] = useState<number>(0);
  const activeTab = slugToTab[slug] ?? 0;

  // URL-də "1,2,5" kimi varsa [1, 2, 5], yoxdursa [9999] götürürük
  const selectedCategory = useMemo(() => {
    const raw = searchParams.get("categoryId");
    if (!raw) return [9999];
    return raw.split(",").map(Number);
  }, [searchParams]);

  const paginationOption = {
    limit: 9,
    page: currentPage ?? 1,
  };

  const updateUrlParam = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }

    // Əgər category dəyişərsə, page-i sıfırlayıb 1 edirik
    if (key === "categoryId") {
      params.delete("page");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const ALL_CATEGORIES_MARKER = 9999;
  const isVideoTab = [0, 1, 2, 3].includes(activeTab);

  // TanStack Query Hooks
  const { data: categories, isLoading } = useCategory(activeTab);

  const { data: allVideos, isLoading: isVideoLoading } = useVideos({
    ...paginationOption,
    type: activeTab,
    // cast to satisfy expected empty-tuple type when using the special 9999 marker
    categoryIds: (selectedCategory.includes(9999)
      ? []
      : selectedCategory) as unknown as [],
    enabled: isVideoTab,
  });

  const { data: articles } = useArticles({
    ...paginationOption,
    // cast to satisfy expected empty-tuple type when using the special 9999 marker
    categoryIds: (selectedCategory.includes(9999)
      ? []
      : selectedCategory) as unknown as [],
    enabled: activeTab === 4,
  });

  //   const handleRadioChange = (value: number) => {
  //     let final: number[];
  //     if (value === 9999) {
  //       final = [9999];
  //     } else {
  //       final = selectedCategory.includes(9999)
  //         ? [value]
  //         : selectedCategory.includes(value)
  //         ? selectedCategory.filter((p) => p !== value)
  //         : [...selectedCategory, value];
  //     }
  //     setSelectedCategory(final);

  //     const params = new URLSearchParams(searchParams.toString());
  //     if (final.length > 0 && !final.includes(9999)) {
  //       params.set("categoryId", final[0].toString());
  //     } else {
  //       params.delete("categoryId");
  //     }
  //     router.push(`${pathname}?${params.toString()}`, { scroll: false });
  //   };

  const handlePageChange = (newPage: number) => {
    updateUrlParam("page", newPage === 1 ? null : newPage);
  };

  //   const handleCategorySelect = (categoryId: number) => {
  //     updateUrlParam("categoryId", categoryId);
  //   };

  const handleCategorySelect = (clickedId: number) => {
    let updatedCategories: number[];

    if (clickedId === ALL_CATEGORIES_MARKER) {
      updatedCategories = [ALL_CATEGORIES_MARKER];
    } else {
      // 9999-u çıxarırıq
      const currentFiltered = selectedCategory.filter(
        (id) => id !== ALL_CATEGORIES_MARKER
      );

      if (currentFiltered.includes(clickedId)) {
        // Varsa silirik
        updatedCategories = currentFiltered.filter((id) => id !== clickedId);
      } else {
        // Yoxdursa əlavə edirik
        updatedCategories = [...currentFiltered, clickedId];
      }
    }

    // Əgər heç nə seçilməyibsə, default olaraq 9999 təyin edirik
    if (updatedCategories.length === 0) {
      updatedCategories = [ALL_CATEGORIES_MARKER];
    }

    const params = new URLSearchParams(searchParams.toString());

    if (
      updatedCategories.length > 0 &&
      !updatedCategories.includes(ALL_CATEGORIES_MARKER)
    ) {
      params.set("categoryId", updatedCategories.join(","));
    } else {
      params.delete("categoryId");
    }

    // Category dəyişdikdə səhifəni sıfırlayırıq
    params.delete("page");

    // useTransition ilə routinq donmalarının (lag) qarşısını alırıq
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const sorting = (a: Category, b: Category): number => {
    if (a?.Name === "Ümumi") return -1;
    if (b?.Name === "Ümumi") return 1;
    return 0;
  };

  const links = navLinks(null) as NavLinkItem[];
  const currentType = type_map[slug as keyof typeof type_map];

  return (
    <>
      <div className="block xl:hidden">
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
                {links
                  .filter((nav) => nav.icon)
                  .map((nav) => {
                    const Icon = nav.icon;
                    return (
                      <SwiperSlide key={nav.type} className="!w-auto">
                        <Link
                          className={`${
                            activeTab === nav.type
                              ? "bg-[#003A3C] text-white"
                              : "text-[#909090]"
                          } rounded-[6px] text-base p-2 font-[lexend] cursor-pointer flex justify-center items-center h-full`}
                          href={nav.href}
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <Icon
                            color={activeTab === nav.type ? "#fff" : "#909090"}
                          />
                          <div className="ml-2 whitespace-nowrap">
                            {nav.label}
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
                {categories?.data?.sort(sorting).map((d: Category) => (
                  <div
                    key={d.Id}
                    className="border-b border-gray-200 pt-4 pb-4"
                  >
                    <RadioItem
                      id={d.Id}
                      label={d.Name}
                      value={d.Id}
                      isSelected={selectedCategory.includes(d.Id)}
                      onChange={handleCategorySelect}
                      hasDropdown={(d.children?.length ?? 0) > 0}
                      onDropdownClick={() =>
                        setExpanded({
                          isExpanded: !(
                            expanded.isExpanded && expanded.id === d.Id
                          ),
                          id: d.Id,
                        })
                      }
                    />
                    {expanded.isExpanded &&
                      expanded.id === d.Id &&
                      d.children?.map((child: CategoryChild) => (
                        <div className="ml-8 mt-3 space-y-3" key={child.Id}>
                          <RadioItem
                            id={child.Id}
                            label={child.Name}
                            value={child.Id}
                            isSelected={selectedCategory.includes(child.Id)}
                            onChange={handleCategorySelect}
                          />
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Sidebar>
      </div>

      <div className="w-full sm:px-6 lg:px-8 max-w-7xl mx-auto box-border">
        <Breadcrumb title={`/${slug}`} />

        <div className="xl:grid hidden grid-cols-6 gap-x-2 md:mb-9 mt-4">
          {links
            .filter((nav) => nav.icon)
            .map((nav) => {
              const Icon = nav.icon;

              return (
                <Link
                  key={nav.type}
                  className={`${
                    activeTab === nav.type
                      ? "bg-[#003A3C] text-white"
                      : "text-[#909090]"
                  } rounded-[6px] text-base p-2 font-[lexend] cursor-pointer flex justify-center items-center`}
                  href={nav.href}
                >
                  <Icon color={activeTab === nav.type ? "#fff" : "#909090"} />
                  <div className="ml-2">{nav.label}</div>
                </Link>
              );
            })}
        </div>
        <div className="block xl:hidden mt-4">
          <SectionHeader
            label={currentType?.label}
            icon={currentType?.icon}
            FilterButton={
              (
                <FilterComponent setIsSidebarOpen={setIsSidebarOpen} />
              ) as unknown as null
            }
            TotalComponent={
              <SectionTotal
                total={allVideos?.total}
                icon={
                  currentType?.label === "Məqalələr"
                    ? "/icons/article-icon.svg"
                    : currentType?.label === "Kitablar"
                    ? "/icons/book-icon.svg"
                    : "/icons/play-circle.svg"
                }
              />
            }
          />
        </div>

        <br />
        <div className="flex flex-col lg:flex-row justify-between gap-6 w-full box-border">
          <div className="w-[231px] sticky top-[90px] self-start h-fit flex-shrink-0 xl:block hidden">
            {isLoading ? (
              <CategoryListSkeleton />
            ) : (
              categories?.data?.sort(sorting).map((d: Category) => (
                <div key={d.Id} className="border-b border-gray-200 pt-4 pb-4">
                  <RadioItem
                    id={d.Id}
                    label={d.Name}
                    value={d.Id}
                    isSelected={selectedCategory.includes(d.Id)}
                    onChange={handleCategorySelect}
                    hasDropdown={(d.children?.length ?? 0) > 0}
                    onDropdownClick={() =>
                      setExpanded({
                        isExpanded: !(
                          expanded.isExpanded && expanded.id === d.Id
                        ),
                        id: d.Id,
                      })
                    }
                  />
                  {expanded.isExpanded &&
                    expanded.id === d.Id &&
                    d.children?.map((child: CategoryChild) => (
                      <div className="ml-8 mt-3 space-y-3" key={child.Id}>
                        <RadioItem
                          id={child.Id}
                          label={child.Name}
                          value={child.Id}
                          isSelected={selectedCategory.includes(child.Id)}
                          onChange={handleCategorySelect}
                        />
                      </div>
                    ))}
                </div>
              ))
            )}
          </div>

          <main className="flex-1 pb-10 w-full box-border">
            {isVideoLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {Array.from({ length: 9 }).map((_, index) => (
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
                  <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 md:grid-cols-3 w-full">
                    {allVideos.data.map((video: VideoItem) => (
                      <VideoCard
                        key={video.Id}
                        data={video}
                        setOpen={setOpen}
                        variant="content"
                      />
                    ))}
                  </div>
                  <div className="mt-10">
                    {allVideos?.total !== undefined &&
                      allVideos.total > allVideos.data.length && (
                        <Pagination
                          totalPages={Math.ceil(allVideos.total / 9)}
                          currentPage={currentPage}
                          setCurrentPage={handlePageChange}
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
                setCurrentPage={handlePageChange}
              />
            )}
            {open.isOpen && (
              <div
                className="fixed inset-0 bg-[#00000073] bg-opacity-70 flex items-center justify-center z-50"
                onClick={() => setOpen({ isOpen: false })}
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
};

export default ContentComponent;

// --- Sub-components with Types ---

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose, children }) => {
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
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
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

const CategoryListSkeleton: FC = () => (
  <div className="flex flex-col w-full">
    {Array.from({ length: 9 }).map((_, i) => (
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
