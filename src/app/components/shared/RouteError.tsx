"use client";

import { useEffect } from "react";
import Link from "next/link";

type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref?: string;
};

export default function RouteError({
  error,
  reset,
  homeHref = "/",
}: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md">
        <p className="mb-2 text-sm font-medium text-[#C88445]">Xəta</p>
        <h1 className="font-roboto-slab text-3xl font-medium text-[#003A3C]">
          Səhifəni açmaq mümkün olmadı
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#878787]">
          Gözlənilməz problem baş verdi. Səhifənin qalan hissəsi işlək qalır,
          bunu yenidən yoxlaya bilərsiniz.
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-[#B0B0B0]">Kod: {error.digest}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex rounded-md bg-[#003A3C] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#00585B]"
          >
            Yenidən cəhd et
          </button>
          <Link
            href={homeHref}
            className="inline-flex rounded-md border border-[#003A3C] px-5 py-3 text-sm font-medium text-[#003A3C] transition-colors hover:bg-white"
          >
            Geriyə qayıt
          </Link>
        </div>
      </div>
    </main>
  );
}
