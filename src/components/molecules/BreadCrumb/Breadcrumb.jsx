import Link from "next/link";
import shared_styles from "../../shared/shared.module.scss";
const Breadcrumb = () => {
  return (
    <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8 max-w-[1180px] flex items-center py-4 text-xs mb-4 ">
      <img src="./icons/mosque.svg" alt="" className="w-5" />
      <Link href="/" className="text-[#878787] hover:text-gray-700">
        Əsas səhifə /
      </Link>
      <Link href="/about" className="text-[#C88445] hover:text-gray-700 ml-1">
        Haqqında
      </Link>
    </div>
  );
};

export default Breadcrumb;
