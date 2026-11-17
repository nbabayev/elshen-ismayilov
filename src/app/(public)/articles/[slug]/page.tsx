import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import { getArticle, getSimilarArticles } from "@/@lib/data-fetchers";
import { articleDetailDateFormat, formatDateISO } from "@/app/utils/formatDate";
import sanitizeHtml from "sanitize-html";
import Container from "@/app/components/shared/Container";
import ArticleShare from "@/app/components/molecules/ArticleShare";
import Section from "@/app/components/molecules/Section";
import ViewCounter from "@/app/components/shared/ViewCounter";
import { notFound } from "next/navigation";
import Link from "next/link";
import SliderWrapper from "@/app/components/molecules/SliderWrapper";
import ArticleToc from "@/app/components/molecules/ArticleToc/ArticleToc";
import { prepareArticleContent } from "@/app/utils/articleToc";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slugParam = await params;

  if (!slugParam) {
    return <div>Xəta: Parametr tapılmadı</div>;
  }

  const article = await getArticle(slugParam?.slug);
  const similarArticles = await getSimilarArticles(slugParam?.slug);
  if (!article || article.isHidden) {
    notFound();
  }

  const { html: contentWithIds, items: tocItems } = prepareArticleContent(
    article?.Content || ""
  );

  return (
    <>
      <Container>
        <Breadcrumb title={article?.Title} />
      </Container>
      <div className=" ">
        <ViewCounter id={article.Id} />
        <div className="px-4 md:py-10">
          <div className="text-[#878787] text-center font-roboto-slab">
            <time>
              {articleDetailDateFormat(article?.CreatedDate)} /{" "}
              {article?.ReadMinute} dəq. oxunur
            </time>
          </div>
          <h1 className="text-[28px] md:text-[44px] font-roboto-slab font-medium text-center mt-3 mb-6 text-[#003A3C] max-w-3xl mx-auto text-center">
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
            <ArticleToc items={tocItems} />
            <ArticleContent content={contentWithIds} />
            <br />
            <br />
            <ArticleShare title={article?.Title} />
          </div>
        </div>

        {similarArticles?.length > 0 && (
          <>
            <div className="hidden md:block">
              <Section label="Oxşar məqalələr" icon="/icons/pen.png">
                <SliderWrapper data={similarArticles} type="4" />
              </Section>
            </div>
            <SimilarArticlesMobile articles={similarArticles} />
          </>
        )}
      </div>
    </>
  );
}

const SANITY_OPTIONS = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "figure",
    "figcaption",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height", "loading"],
    a: ["href", "target", "rel", "name"],
    h1: ["id"],
    h2: ["id"],
    h3: ["id"],
    h4: ["id"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

function similarArticleDate(dateISO?: string) {
  if (!dateISO) return "";
  const [day, month] = formatDateISO(dateISO).split(" ");
  if (!day || !month) return "";
  return `${day} ${month.charAt(0).toUpperCase()}${month.slice(1)}`;
}

function SimilarArticlesMobile({ articles }: { articles: any[] }) {
  return (
    <section className="md:hidden px-4 pb-12 mt-4">
      <div className="rounded-2xl bg-[#F6F6F4] px-4">
        <div className="flex items-center justify-between gap-3 border-b border-[#E4E4E4] py-4">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src="/icons/pen.png"
              alt=""
              className="h-8 w-8 shrink-0 object-contain"
            />
            <h2 className="truncate font-lexend text-[18px] leading-none text-[#003A3C]">
              Oxşar məqalələr
            </h2>
          </div>
          <Link
            href="/articles"
            className="shrink-0 font-lexend text-[14px] text-[#C88445]"
          >
            Arxiv
          </Link>
        </div>

        {articles.map((item, index) => {
          const article = item?.article ?? item;
          return (
            <Link
              key={article?.Id ?? index}
              href={`/articles/${article.Slug}`}
              className="block border-b border-[#E6E6E6] py-4 last:border-b-0"
            >
              <p className="mb-2 font-lexend text-[12px] text-[#9A9A9A]">
                {similarArticleDate(article?.CreatedDate)}
              </p>
              <h3 className="mb-2 line-clamp-2 font-roboto-slab text-[16px] font-medium leading-snug text-[#003A3C]">
                {article?.Title}
              </h3>
              {article?.ShortDescription ? (
                <p className="mb-3 line-clamp-2 font-lexend text-[13px] leading-relaxed text-[#6E6E6E]">
                  {article.ShortDescription}
                </p>
              ) : null}
              <div className="flex items-center gap-1.5 font-lexend text-[13px] text-[#8A8A8A]">
                <img src="/icons/eye.svg" alt="" className="h-4 w-4" />
                <span>{article?.ViewCount ?? 0}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ArticleContent({ content }: { content: string }) {
  const normalizedContent = content
    ?.replace(/<p>(\s|&nbsp;)*<\/p>/gi, "<p><br></p>")
    .replace(/&nbsp;/g, " ");

  const cleanContent = sanitizeHtml(normalizedContent, SANITY_OPTIONS);
  return (
    <div
      dangerouslySetInnerHTML={{ __html: cleanContent }}
      className="prose max-w-none prose-headings:scroll-mt-[var(--article-heading-scroll-mt,10rem)]"
    />
  );
}
