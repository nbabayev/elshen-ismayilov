"use client";
import React from "react";
import { ArticleCard } from "@/app/components/molecules/ArticleCard/ArticleCard";
import { useMediaQuery } from "@/app/utils/useMediaQuery";
import Link from "next/link";
// import { Container } from "@mui/material";

// const Articles = ({ data }) => {
//   const isDesktop = useMediaQuery("(min-width: 768px)");

//   if (!data?.length) return null;

//   const [firstArticle, ...restArticles] = data;

//   return (
//     <div className="grid md:grid-cols-2 gap-4 auto-rows-max">
//       {/* İlk məqalə - 2 row-a uzanır */}
//       {isDesktop && firstArticle && (
//         <Link href={`/articles/${firstArticle.Id}`} className="md:row-span-2">
//           <Article data={firstArticle} highlighted />
//         </Link>
//       )}

//       {/* Qalanları */}
//       {(isDesktop ? restArticles : data).map((d) => (
//         <Link key={d.Id} href={`/articles/${d.Id}`}>
//           <Article data={d} />
//         </Link>
//       ))}
//     </div>
//   );
// };
// export default Articles;

const Articles = ({ data }) => {
  if (!data?.length) return null;

  const [firstArticle, ...restArticles] = data;

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-start">
        {/* SOL - BÖYÜK CARD */}
        <div>
          <Link href={`articles/${firstArticle.Id}`} key={firstArticle.Id}>
            <ArticleCard data={firstArticle} highlighted={true} />
          </Link>
        </div>

        {/* SAĞ - KIÇIK CARD-LAR */}
        <div className="flex flex-col gap-6">
          {restArticles.map((article) => (
            <Link href={`articles/${article.Id}`} key={article.Id}>
              <ArticleCard
                key={article.Id}
                data={article}
                highlighted={false}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;
