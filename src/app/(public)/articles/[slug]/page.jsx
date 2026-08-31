import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import { getArticle, getSimilarArticles } from "@/@lib/data-fetchers";
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
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function ArticlePage({ params }) {
  const slugParam = await params;

  if (!slugParam) {
    return <div>Xəta: Parametr tapılmadı</div>;
  }

  const article = await getArticle(slugParam?.slug);
  const similarArticles = await getSimilarArticles(slugParam?.slug);
  console.log(similarArticles, "similarArticle");
  // console.log(article, "article");
  if (!article) {
    return <div>Məqalə tapılmadı (404)</div>;
  }
  return (
    <>
      <Container>
        <Breadcrumb title={article?.Title} />
      </Container>
      <div className=" ">
        <ViewCounter id={article.Id} />
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
            {/* <div>{article?.Content}</div> */}
            <ArticleContent content={article?.Content} />
            <br />
            <br />
            <Button>
              Paylaş <ShareIcon />
            </Button>
          </div>

          {/* Pagination Buttons */}
        </div>

        {/* Related Articles */}
        {similarArticles?.length > 0 && (
          <Section
            patternClass={null}
            sectionHeader={
              <SectionHeader label="Oxşar məqalələr" icon="/icons/pen.png" />
            }
            content={<Slider data={similarArticles} type="4" />}
          />
        )}
      </div>
    </>
  );
}

function ArticleContent({ content }) {
  // const normalizedContent = content?.replace(/&nbsp;/g, " ");
  const normalizedContent = content
    ?.replace(/<p>(\s|&nbsp;)*<\/p>/gi, "<p><br></p>") // boş paraqrafları qoru
    .replace(/&nbsp;/g, " ");
  const cleanContent = sanitizeHtml(normalizedContent, {
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
    <div
      dangerouslySetInnerHTML={{ __html: cleanContent }}
      className="prose max-w-none"
    />
  );
}
