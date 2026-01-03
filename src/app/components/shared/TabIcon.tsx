import React from "react";
type IconProps = {
  className?: string;
  color?: string;
};

export const LessonIcon = ({
  className,
  color = "currentColor",
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M1.66675 2.5H6.66675C7.5508 2.5 8.39865 2.85119 9.02377 3.47631C9.64889 4.10143 10.0001 4.94928 10.0001 5.83333V17.5C10.0001 16.837 9.73669 16.2011 9.26785 15.7322C8.79901 15.2634 8.16312 15 7.50008 15H1.66675V2.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.3333 2.5H13.3333C12.4493 2.5 11.6014 2.85119 10.9763 3.47631C10.3512 4.10143 10 4.94928 10 5.83333V17.5C10 16.837 10.2634 16.2011 10.7322 15.7322C11.2011 15.2634 11.837 15 12.5 15H18.3333V2.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MicIcon = ({ className, color = "currentColor" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M10 7.14223L3.68364 13.4729C3.47692 13.6548 3.3097 13.8772 3.19229 14.1263C3.07488 14.3754 3.00979 14.6459 3.00102 14.9211C2.99226 15.1964 3.04001 15.4705 3.14133 15.7265C3.24264 15.9826 3.39538 16.2152 3.5901 16.4099C3.78482 16.6046 4.0174 16.7574 4.27346 16.8587C4.52952 16.96 4.80363 17.0077 5.07887 16.999C5.35411 16.9902 5.62462 16.9251 5.87372 16.8077C6.12281 16.6903 6.3452 16.5231 6.52713 16.3164L12.8578 10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 10C15.433 10 17 8.433 17 6.5C17 4.567 15.433 3 13.5 3C11.567 3 10 4.567 10 6.5C10 8.433 11.567 10 13.5 10Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const TrainingIcon = ({ color = "currentColor" }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clipPath="url(#clip0_521_5462)">
        <path
          d="M1.77783 2.7H18.0001"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.1889 2.7V11.6222C17.1889 12.0525 17.018 12.4651 16.7137 12.7693C16.4095 13.0735 15.9969 13.2444 15.5666 13.2444H4.21109C3.78085 13.2444 3.36823 13.0735 3.064 12.7693C2.75978 12.4651 2.58887 12.0525 2.58887 11.6222V2.7"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.8335 17.3001L9.88905 13.2445L13.9446 17.3001"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_521_5462">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const SpeechIcon = ({ color = "currentColor" }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M9.16675 4.16667L5.00008 7.50001H1.66675V12.5H5.00008L9.16675 15.8333V4.16667Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.95 7.05C13.7311 7.83137 14.1699 8.89099 14.1699 9.99584C14.1699 11.1007 13.7311 12.1603 12.95 12.9417"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.8916 4.10834C17.4539 5.67107 18.3315 7.7903 18.3315 10C18.3315 12.2097 17.4539 14.3289 15.8916 15.8917"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PenIcon = ({ color = "currentColor" }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clipPath="url(#clip0_521_5473)">
        <path
          d="M10 16.6667H17.5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.75 2.91666C14.0815 2.58514 14.5312 2.3989 15 2.3989C15.2321 2.3989 15.462 2.44462 15.6765 2.53346C15.891 2.6223 16.0858 2.75251 16.25 2.91666C16.4142 3.08081 16.5444 3.27569 16.6332 3.49017C16.722 3.70464 16.7678 3.93452 16.7678 4.16666C16.7678 4.39881 16.722 4.62868 16.6332 4.84316C16.5444 5.05763 16.4142 5.25251 16.25 5.41666L5.83333 15.8333L2.5 16.6667L3.33333 13.3333L13.75 2.91666Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_521_5473">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const BookIcon = ({ color = "currentColor" }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <g clipPath="url(#clip0_521_5479)">
        <path
          d="M3.33325 16.25V3.75001C3.33325 3.19747 3.55275 2.66757 3.94345 2.27687C4.33415 1.88617 4.86405 1.66667 5.41659 1.66667H16.6666V18.3333H5.41659C4.86405 18.3333 4.33415 18.1138 3.94345 17.7231C3.55275 17.3324 3.33325 16.8025 3.33325 16.25ZM3.33325 16.25C3.33325 15.6975 3.55275 15.1676 3.94345 14.7769C4.33415 14.3862 4.86405 14.1667 5.41659 14.1667H16.6666"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 8.33333H12.5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_521_5479">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
