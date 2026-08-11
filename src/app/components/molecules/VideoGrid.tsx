"use client";
import CardSlider from "@/app/components/molecules/CardSlider";
import { useState } from "react";
export default function VideoGrid({
  videos,
  type,
}: {
  videos: [];
  type: string | undefined;
}) {
  const [open, setOpen] = useState({
    link: "",
    isOpen: false,
  });
  return (
    <div>
      <CardSlider data={videos} type={type} setOpen={setOpen} />
      {open.isOpen && (
        <div
          className="fixed inset-0 bg-[#00000073] bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setOpen((prev) => ({ ...prev, isOpen: false }))}
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-lg w-[90%] max-w-3xl relative">
            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={open.link}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
