import React from "react";
import { ArticleCard } from "@/app/components/molecules/ArticleCard/ArticleCard";
import Pagination from "@/app/components/layouts/navbar/pagination";
import Link from "next/link";

const ArticleDataUI = ({ data, paginationOption, setCurrentPage }) => {
  console.log(data?.data, "nanan");
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 268px))",
          gap: "20px",
        }}
      >
        {data?.data?.map((article) => (
          <Link href={`/articles/${article.Id}`} key={article.Id}>
            <ArticleCard key={article.Id} data={article} variant="stack" />
          </Link>
        ))}
      </div>
      <div>
        {data?.total !== undefined && data?.total > data?.length && (
          <Pagination
            totalPages={Math.ceil(data?.total / 9)}
            currentPage={paginationOption?.page}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </>
  );
};

export default ArticleDataUI;
