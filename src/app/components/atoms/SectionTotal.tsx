import Image from "next/image";

const SectionTotal = ({ total, icon }: { icon: string; total: number }) => {
  return (
    <>
      <Image
        src={icon}
        alt="section-icon"
        width={24}
        height={24}
        className="ml-2 mr-2"
      />
      {total || 0}
    </>
  );
};

export default SectionTotal;
