import React from "react";

const Tabs = () => {
  let tabs = [
    {
      id: "1",
      label: "Dərslər",
      icon: "/icons/book-open.svg",
    },
    { id: "2", label: "Moizələr", icon: "/icons/mic.svg" },
    { id: "3", label: "Təlimlər", icon: "/icons/.svg" },
    { id: "4", label: "Verilişlər", icon: "/icons/presentation.svg" },
    { id: "5", label: "Məqalələr", icon: "/icons/volume.svg" },
    { id: "6", label: "Kitablar", icon: "/icons/pen.svg" },
  ];
  return (
    <div>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className="flex items-center gap-2 border border-#E1E1E1 rounded-full px-4 py-2 text-sm text-#F0EDEA4D font-[lexend] bg-[#003A3C] hover:bg-#F0EDEA4D hover:text-#003A3C transition"
        >
          <img src={tab.icon} alt={tab.label} />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
