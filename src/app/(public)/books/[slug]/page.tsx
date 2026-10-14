import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/app/components/molecules/BreadCrumb/Breadcrumb";
import Container from "@/app/components/shared/Container";
import BookCover from "@/app/components/molecules/BookCover/BookCover";
import { BookCard } from "@/app/components/molecules/BookCard/BookCard";
import { BookMeta } from "@/app/components/molecules/BookMeta/BookMeta";
import { getBook, getOtherBooks } from "@/@lib/data-fetchers";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const book = await getBook(slug);
  if (!book) notFound();

  const { data: otherBooks = [], total: booksTotal = 0 } = await getOtherBooks(
    book.Id,
    3
  );

  const descriptionParagraphs = String(book.Description || "")
    .split(/\n+/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  const metaItems = [
    { label: "Format", value: book.Format },
    { label: "Barkod", value: book.Barcode },
    { label: "Nəşr tarixi", value: book.PublishYear },
    { label: "Nəşr dili", value: book.Language },
    { label: "Nəşr tirajı", value: book.Circulation },
    { label: "Nəşriyyat", value: book.Publisher },
    { label: "Səhifə sayı", value: book.PageCount },
    { label: "Üz qabığı", value: book.CoverType },
    { label: "Kağız", value: book.Paper },
    { label: "Ölçü", value: book.Size },
  ];

  return (
    <>
      <Container>
        <Breadcrumb title={book.Title} />
      </Container>

      <section className="pb-14 md:pb-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5">
              <BookCover
                title={book.Title}
                image={book.Image}
                audioUrl={book.SpotifyUrl}
                pdfUrl={book.PdfUrl}
              />
            </div>

            <div className="lg:col-span-7 pt-1">
              {book.Author && (
                <p className="text-[#C88445] font-lexend text-[14px] md:text-[15px] font-medium mb-3">
                  {book.Author}
                </p>
              )}

              <h1 className="font-roboto-slab text-[28px] md:text-[40px] leading-[1.2] font-medium text-[#003A3C] mb-6 md:mb-8 max-w-xl">
                {book.Title}
              </h1>

              {descriptionParagraphs.length > 0 && (
                <div className="space-y-4 text-[#4A5A5A] font-lexend text-[15px] md:text-[16px] leading-[1.8] text-justify">
                  {descriptionParagraphs.map(
                    (paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    )
                  )}
                </div>
              )}

              <BookMeta items={metaItems} />
            </div>
          </div>
        </Container>
      </section>

      {otherBooks.length > 0 && (
        <section className="pb-16 md:pb-24">
          <Container>
            <div className="flex items-center justify-between gap-4 pb-8 border-b border-[#BFBFBF]/60 mb-8 md:mb-10">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="relative w-10 h-10 md:w-20 md:h-20 flex-shrink-0">
                  <Image
                    src="/icons/section-book.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 40px, 80px"
                    className="object-contain"
                  />
                </div>
                <h2 className="font-lexend text-[20px] md:text-[32px] leading-none text-[#003A3C]">
                  Digər kitablar
                </h2>
              </div>

              <Link
                href="/books"
                className="flex items-center gap-2 text-[#AD6E33] hover:opacity-80 transition-opacity text-[14px] md:text-[16px] font-lexend"
              >
                <span>Arxiv</span>
                <Image
                  src="/icons/book-open.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="opacity-80"
                />
                <span>{booksTotal + 1}</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {otherBooks.map(
                (item: {
                  Id: number;
                  Title: string;
                  Slug: string;
                  Image?: string | null;
                }) => (
                  <BookCard key={item.Id} data={item} />
                )
              )}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
