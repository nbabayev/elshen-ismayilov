import React from "react";
import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import { headers } from "next/headers";
import * as articleService from "@/services/article.service";
import { articleDetailDateFormat } from "@/app/utils/formatDate";
// import DOMPurify from "isomorphic-dompurify";
import sanitizeHtml from "sanitize-html";
import Container from "@/app/components/shared/Container";
import Slider from "@/app/components/molecules/CardSlider";
import Button from "@/app/components/atoms/Button/Button";
import ShareIcon from "@/app/components/shared/ShareIcon";
import Section from "@/app/components/molecules/Section/Section";
import SectionHeader from "@/app/components/atoms/SectionHeader/SectionHeader";
import ViewCounter from "@/app/components/shared/ViewCounter";
// interface PageProps {
//   params: Promise<{ slug: string }> | { slug: string };
// }
export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const slugParam = resolvedParams.slug;
  console.log(resolvedParams);
  if (!slugParam) {
    return <div>Xəta: Parametr tapılmadı</div>;
  }
  const article = await articleService.getById(slugParam);
  if (!article) {
    return <div>Məqalə tapılmadı (404)</div>;
  }
  return (
    <>
      <Container>
        <Breadcrumb title={article?.Title} />
      </Container>
      <div>
        {/* <ViewCounter id={id} /> */}
        {/* Main Container */}
        <div className="px-4 md:py-10">
          {/* Article Title */}
          <div className="text-[#878787] text-center font-roboto-slab">
            {" "}
            <time>
              {articleDetailDateFormat(article?.CreatedDate)} /{" "}
              {article?.ReadMinute} dəq. oxunur
            </time>
          </div>
          <h1 className="text-[28px] md:text-[44px] font-roboto-slab font-medium text-center mt-3 mb-6 text-[#003A3C] break-words md:w-[30%] mx-auto text-center">
            {article?.Title}
          </h1>
          <div className="bg-[url(/images/vector-article.png)] bg-repeat-x bg-center">
            <div className="max-w-5xl mx-auto">
              <img
                src={article?.Image}
                alt="Article"
                className="w-full rounded-md mb-6"
              />
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <ArticleContent content={article?.Content} />
            <Button>
              Paylaş <ShareIcon />
            </Button>
          </div>

          {/* Pagination Buttons */}
        </div>

        {/* Related Articles */}
        <div className="max-w-6xl mx-auto px-4">
          <Section
            // data={similarArticles}
            patternClass={null}
            sectionHeader={
              <SectionHeader label="Oxşar məqalələr" icon="/icons/pen.png" />
            }
          />
          {/* <Slider data={similarArticles} /> */}
          {/* {JSON.stringify(similarArticles[0])} */}
          {/* <Slider data={similarArticles} /> */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <img
                  src={`/images/related-${item}.jpg`}
                  alt={`related ${item}`}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2">
                    Məqalə başlığı {item}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Qısa məqalə təsviri. Qısa məqalə təsviri...
                  </p>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </>
  );
}

function ArticleContent({ content }) {
  const cleanContent = sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "figure",
      "figcaption",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "loading"],
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
  return (
    <div dangerouslySetInnerHTML={{ __html: cleanContent }} className="prose" />
  );
}
