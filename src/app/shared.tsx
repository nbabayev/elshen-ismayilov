import {
  BookIcon,
  LessonIcon,
  MicIcon,
  PenIcon,
  SpeechIcon,
  TrainingIcon,
} from "@/app/components/shared/TabIcon";

type tabs = object[];
export const tabs: tabs = [
  {
    type: 0,
    label: "Dərslər",
    icon: LessonIcon,
  },
  {
    type: 1,
    label: "Moizələr",
    icon: MicIcon,
  },
  {
    type: 2,
    label: "Verilişlər",
    icon: SpeechIcon,
  },
  {
    type: 3,
    label: "Təlimlər",
    icon: TrainingIcon,
  },
  {
    type: 4,
    label: "Məqalələr",
    icon: PenIcon,
  },
  {
    type: 5,
    label: "Kitablar",
    icon: BookIcon,
  },
];

export const navLinks = (sub: any) => [
  // {
  //   href: "/",
  //   label: "Əsas səhifə",
  //   position: "main",
  // },
  {
    href: "/about",
    label: "Haqqında",
    position: "main",
  },
  {
    href: "/gallery",
    label: "Qalereya",
    position: "top-right",
  },
  {
    type: 0,
    label: "Dərslər",
    href: "/lessons",
    icon: LessonIcon,
    position: "main",
  },
  {
    type: 1,
    href: "/sermons",
    label: "Moizələr",
    icon: MicIcon,
    position: "main",
  },
  {
    type: 2,
    href: "/speeches",
    label: "Verilişlər",
    icon: SpeechIcon,
    position: "main",
  },
  {
    type: 3,
    href: "/trainings",
    label: "Təlimlər",
    icon: TrainingIcon,
    position: "main",
  },
  {
    type: 4,
    label: "Məqalələr",
    href: "/articles",
    sub: {
      href: `/articles/${sub}`,
      label: sub,
    },
    icon: PenIcon,
    position: "main",
  },
  {
    type: 5,
    href: "/books",
    label: "Kitablar",
    icon: BookIcon,
    position: "main",
  },

  {
    href: "/contact",
    label: "Əlaqə",
    position: "top-right",
  },
];
export const type_map = {
  lessons: {
    label: "Dərslər",
    icon: "/icons/section-book.png",
  },
  sermons: {
    label: "Moizələr",
    icon: "/icons/section-sermons.png",
  },
  speeches: {
    label: "Verilişlər",
    icon: "/icons/section-training.png",
  },
  trainings: {
    label: "Təlimlər",
    icon: "/icons/section-speech.png",
  },
  articles: {
    label: "Məqalələr",
    icon: "/icons/pen.png",
  },
  books: {
    label: "Kitablar",
    icon: BookIcon,
  },
};

export type BaseParams = {
  limit?: number;
  page: number;
  type?: number;
  isAdmin?: boolean;
};

export type TabContentType = BaseParams & {
  enabled?: boolean;
  categoryIds?: [];
  selectedOnly?: boolean;
};
