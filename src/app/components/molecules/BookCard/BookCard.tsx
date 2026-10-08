import Link from "next/link";

export type BookCardData = {
  Id: number;
  Title: string;
  Slug: string;
  Image?: string | null;
};

export function BookCard({ data }: { data: BookCardData }) {
  return (
    <Link href={`/books/${data.Slug}`} className="group block">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] aspect-square flex items-center justify-center p-8 md:p-10 overflow-hidden transition-shadow duration-200 group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)]">
        {data.Image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.Image}
            alt={data.Title}
            className="max-w-full max-h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-[#f5f5f5] rounded-lg" />
        )}
      </div>
      <h3 className="mt-5 text-center font-roboto-slab text-[16px] md:text-[18px] leading-snug font-medium text-[#003A3C] group-hover:text-[#C88445] transition-colors line-clamp-3">
        {data.Title}
      </h3>
    </Link>
  );
}
