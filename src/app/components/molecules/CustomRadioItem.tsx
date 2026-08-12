type RadioItem = {
  id: number | string;
  label: string;
  value: number;
  isSelected: boolean;
  onChange: (value: number) => void;
  hasDropdown?: boolean;
  onDropdownClick?: () => void;
};
export const CustomRadioItem = ({
  id,
  label,
  value,
  isSelected,
  onChange,
  hasDropdown,
  onDropdownClick,
}: RadioItem) => {
  const stringId = `radio-item-${id}`;
  return (
    <div className="flex items-center">
      <label
        className="flex items-center cursor-pointer flex-1"
        htmlFor={stringId}
      >
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isSelected}
            onChange={() => onChange(value)}
            id={stringId}
            name="islamicStudies"
          />
          <div
            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
              isSelected ? "border-[#003A3C] bg-white" : "border-gray-300"
            }`}
          >
            {isSelected && (
              <div className="w-3 h-3 bg-[#003A3C] rounded-full"></div>
            )}
          </div>
        </div>
        <span
          className={`ml-3 text-sm hover:text-[#003A3C] font-[lexend] ${
            isSelected ? "text-[#003A3C]" : "text-[#878787]"
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
};
