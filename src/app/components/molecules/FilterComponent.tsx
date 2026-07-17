"use client";
import Image from "next/image";

const FilterComponent = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-end">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="flex-shrink-0 p-3 rounded-lg transition-colors"
      >
        <Image
          src="/icons/set-filter.svg"
          alt="Filter"
          width={20}
          height={20}
          priority
        />
      </button>
    </div>
  );
};

export default FilterComponent;
