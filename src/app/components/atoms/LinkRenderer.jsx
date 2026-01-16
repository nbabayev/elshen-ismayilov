import React from "react";

const LinkRenderer = ({ open, setOpen }) => {
  return (
    <div
      className="fixed inset-0 bg-[#00000073] bg-opacity-70 flex items-center justify-center z-50"
      onClick={() => setOpen((prev) => ({ ...prev, isOpen: false }))}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-3xl relative">
        {/* Close Button */}
        {/* <button
                  onClick={() => setOpen({})}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                }>
                  ✕
                </button> */}
        <div className="w-full aspect-video">
          <iframe
            style={{
              aspectRatio: "9/16",
              height: "150vh", // Ekranın 80%-i qədər hündürlük
              width: "auto",
              maxHeight: "600px", // Çox böyüməməsi üçün
            }}
            src={open.link}
            // title={video.Title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default LinkRenderer;
