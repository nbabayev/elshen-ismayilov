"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <p className="mb-2 text-sm font-medium text-[#C88445]">404</p>
        <h1 className="font-roboto-slab text-3xl font-medium text-[#003A3C]">
          Səhifə mövcud deyil
        </h1>
        <p className="mt-3 text-sm text-[#878787]">
          Axtardığınız səhifə silinib və ya ünvanı yanlışdır.
        </p>
        <Link
          href={pathname.includes("/admin") ? "/admin" : "/"}
          className="mt-6 inline-flex rounded-md bg-[#003A3C] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#00585B]"
        >
          Geriyə Qayıt
        </Link>
      </div>
    </main>
  );
}
