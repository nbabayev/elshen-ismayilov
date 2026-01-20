"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/app/components/organisms/SaearchPanel/searchPanel.module.scss";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getYoutubeEmbedUrl } from "@/app/(public)/gallery/page";

interface SearchResult {
  Id: number;
  Title: string;
  searchType: "article" | "video";
  Link: string;
}

const SearchModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [open, setOpen] = useState({
    link: "",
    isOpen: false,
  });

  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  useEffect(() => {
    if (pathname !== lastPathname) {
      onClose();
      setLastPathname(pathname);
    }
  }, [pathname, lastPathname, onClose]);

  const handleOpenContent = (link: string) => {
    if (!link) return;
    const embedUrl = getYoutubeEmbedUrl(link);
    setOpen({
      isOpen: true,
      link: `${embedUrl}?rel=0&modestbranding=1&autoplay=1`,
    });
  };
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(false);
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(true);
      // Wait for animation (300ms) before unmounting
      document.body.style.overflow = "unset";
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => {
        document.body.style.overflow = "unset";
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  const type_map: Record<string, string> = {
    all: "kontent",
    video: "videolar",
    book: "kitablar",
    article: "məqalələr",
  };
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/search?q=${query}&type=${type}`);
        setResults(data.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, type]);

  //   if (!isOpen) return null;
  if (!shouldRender) return null;
  return (
    <div
      className={`${styles.modalOverlay} ${
        isAnimating ? styles.isClosing : ""
      }`}
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.header}>
          <Image src="/images/logo.png" alt="Logo" width={163} height={26} />
          <button onClick={onClose} className={styles.closeBtn}>
            <Image
              src="/icons/hamburger.svg"
              alt="Close"
              width={24}
              height={24}
              style={{ transform: "rotate(45deg)" }}
            />
          </button>
        </div>

        {/* Search Area */}
        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <div className={styles.inputWrapper}>
              <Image
                src="/icons/search.svg"
                alt="Search"
                width={20}
                height={20}
              />
              <input
                type="text"
                placeholder="Axtarış"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className={styles.divider} />
            <select
              className={styles.typeSelect}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">Ümumi</option>
              <option value="video">Videolar</option>
              <option value="book">Kitablar</option>
              <option value="article">Məqalələr</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className={styles.resultsArea}>
          {isLoading && <p>Yüklənir...</p>}
          {!isLoading && results.length > 0 && (
            <div className={styles.resultsGrid}>
              {results.map((item) => (
                <Link
                  key={item.Id}
                  href={
                    item.searchType === "article" ? `/articles/${item.Id}` : ``
                  }
                  className={styles.resultItem}
                  onClick={() => handleOpenContent(item?.Link)}
                >
                  <p>{item.Title}</p>
                  <span>
                    {item.searchType === "article" ? "Məqalə" : "Video"}
                  </span>
                </Link>
              ))}
            </div>
          )}
          {!isLoading && query && results.length === 0 && (
            <p>Tezliklə {type_map[type]} yüklənəcək.</p>
          )}
        </div>

        {/* Bottom Pattern */}
        <div className={styles.bottomPattern}>
          <Image
            src="/images/vector-bottom.png"
            alt="pattern"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        {open.isOpen && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000]"
            onClick={() => setOpen({ link: "", isOpen: false })}
          >
            <div 
              className={`relative w-[95%] max-w-3xl ${styles.videoContainer}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen({ link: "", isOpen: false })}
                className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-0"
                  src={open.link}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
