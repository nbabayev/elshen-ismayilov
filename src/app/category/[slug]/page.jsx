"use client";
import { useEffect, useState } from "react";
import { Metadata } from "next";

// SEO metadata
// export async function generateMetadata({ params }) {
//   const titles = {
//     books: "Books - My Website",
//     movies: "Movies - My Website",
//     music: "Music - My Website",
//     lessons: "Lessons - My Website",
//   };

//   return {
//     title: titles[params.slug] ?? "Categories - My Website",
//     description: `Explore the best ${params.slug} on our website`,
//   };
// }

export default function CategoryPage({ params }) {
  const [checkedItems, setCheckedItems] = useState({
    umumi: false,
    islamEtiqadi: true,
    islamDunyagorusu: false,
    nubuvvet: false,
    tovhidVeEdi: false,
    imamet: false,
    mead: false,
    islamExlaqi: true,
    islamTarixi: false,
    imamlarinTarixi: false,
    irfanla: false,
    quranla: false,
    mehdaviyyet: false,
  });

  const [selectedItem, setSelectedItem] = useState("islamEtiqadi");
  const [isEtiqadiExpanded, setIsEtiqadiExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect;

  const handleRadioChange = (value) => {
    setSelectedItem(value);
  };

  const RadioItem = ({
    id,
    label,
    value,
    isSelected,
    onChange,
    hasDropdown,
    isMainItem,
    onDropdownClick,
  }) => (
    <div className="flex items-center">
      <label className="flex items-center cursor-pointer flex-1" htmlFor={id}>
        <div className="relative">
          <input
            type="radio"
            className="sr-only peer"
            checked={isSelected}
            onChange={() => onChange(value)}
            id={id}
            name="islamicStudies"
          />
          <div
            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
              isSelected ? "border-[#003A3C] bg-white" : "border-gray-300"
            }`}
          >
            {isSelected && (
              <div className="w-3 h-3 bg-[#003A3C] rounded-full"></div>
              // <svg
              //   className="w-3 h-3 text-green-600"
              //   fill="currentColor"
              //   viewBox="0 0 20 20"
              // >
              //   <path
              //     fillRule="evenodd"
              //     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              //     clipRule="evenodd"
              //   />
              // </svg>
            )}
          </div>
        </div>
        <span
          className={`ml-3 text-sm text-[#878787] hover:text-[#003A3C] ${
            isMainItem && isSelected ? "text-[#003A3C] font-[lexend]" : ""
          }`}
        >
          {label}
        </span>
      </label>
      {hasDropdown && (
        <div className="cursor-pointer p-1" onClick={onDropdownClick}>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div>
        <button type="button"></button>
      </div>
      <div className="flex">
        <div className="w-[235px] mx-auto bg-white rounded-lg shadow-sm">
          {/* Ümumi */}
          <div className="border-b border-gray-200 p-4">
            <RadioItem
              id="umumi"
              label="Ümumi"
              value="umumi"
              isSelected={selectedItem === "umumi"}
              onChange={handleRadioChange}
            />
          </div>

          {/* İslam Etiqadı (Əqaid) */}
          <div className="border-b border-gray-200 p-4">
            <RadioItem
              id="islamEtiqadi"
              label="İslam Etiqadı (Əqaid)"
              value="islamEtiqadi"
              isSelected={selectedItem === "islamEtiqadi"}
              onChange={handleRadioChange}
              hasDropdown={true}
              isMainItem={true}
              onDropdownClick={() => setIsEtiqadiExpanded(!isEtiqadiExpanded)}
            />

            {/* Sub-items */}
            {isEtiqadiExpanded && (
              <div className="ml-8 mt-3 space-y-3">
                <RadioItem
                  id="islamDunyagorusu"
                  label="İslam dünyagörüşü"
                  value="islamDunyagorusu"
                  isSelected={selectedItem === "islamDunyagorusu"}
                  onChange={handleRadioChange}
                />

                <RadioItem
                  id="nubuvvet"
                  label="Nübuvvət"
                  value="nubuvvet"
                  isSelected={selectedItem === "nubuvvet"}
                  onChange={handleRadioChange}
                />

                <RadioItem
                  id="tovhidVeEdi"
                  label="Tövhid və ədi"
                  value="tovhidVeEdi"
                  isSelected={selectedItem === "tovhidVeEdi"}
                  onChange={handleRadioChange}
                />

                <RadioItem
                  id="imamet"
                  label="İmamet"
                  value="imamet"
                  isSelected={selectedItem === "imamet"}
                  onChange={handleRadioChange}
                />

                <RadioItem
                  id="mead"
                  label="Mead"
                  value="mead"
                  isSelected={selectedItem === "mead"}
                  onChange={handleRadioChange}
                />
              </div>
            )}
          </div>

          {/* İslam əxlaqı və fəlsəfəsi */}
          <div className="border-b border-gray-200 p-4">
            <RadioItem
              id="islamExlaqi"
              label="İslam əxlaqı və fəlsəfəsi"
              value="islamExlaqi"
              isSelected={selectedItem === "islamExlaqi"}
              onChange={handleRadioChange}
              isMainItem={true}
            />
          </div>

          {/* İslam tarixi və təhlili */}
          <div className="border-b border-gray-200 p-4">
            <RadioItem
              id="islamTarixi"
              label="İslam tarixi və təhlili"
              value="islamTarixi"
              isSelected={selectedItem === "islamTarixi"}
              onChange={handleRadioChange}
            />
          </div>

          {/* İmamların tarixi və təhlili */}
          <div className="border-b border-gray-200 p-4">
            <RadioItem
              id="imamlarinTarixi"
              label="İmamların tarixi və təhlili"
              value="imamlarinTarixi"
              isSelected={selectedItem === "imamlarinTarixi"}
              onChange={handleRadioChange}
            />
          </div>

          {/* İrfanla tanışlıq */}
          <div className="border-b border-gray-200 p-4">
            <RadioItem
              id="irfanla"
              label="İrfanla tanışlıq"
              value="irfanla"
              isSelected={selectedItem === "irfanla"}
              onChange={handleRadioChange}
            />
          </div>

          {/* Quranla tanışlıq */}
          <div className="border-b border-gray-200 p-4">
            <RadioItem
              id="quranla"
              label="Quranla tanışlıq"
              value="quranla"
              isSelected={selectedItem === "quranla"}
              onChange={handleRadioChange}
            />
          </div>

          {/* Məhdəviyyət */}
          <div className="p-4">
            <RadioItem
              id="mehdaviyyet"
              label="Məhdəviyyət"
              value="mehdaviyyet"
              isSelected={selectedItem === "mehdaviyyet"}
              onChange={handleRadioChange}
            />
          </div>
        </div>

        <main className="flex-1">
          {/* <h1>Category: {params.slug}</h1> */}
          {/* Content */}
        </main>
      </div>
    </div>
  );
}
