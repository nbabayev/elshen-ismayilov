"use client";
import dynamic from "next/dynamic";
const Slider = dynamic(() => import("@/app/components/molecules/CardSlider"), {
  ssr: false,
});
const SliderWrapper = ({ data, type }: { data: any[]; type: string }) => {
  return <Slider data={data} type={type} />;
};

export default SliderWrapper;
