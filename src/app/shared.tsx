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
    label: "Çıxışlar",
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
  {
    href: "/",
    label: "Əsas səhifə",
  },
  {
    href: "/about",
    label: "Haqqında",
  },
  {
    href: "/gallery",
    label: "Qalereya",
  },
  {
    type: 0,
    label: "Dərslər",
    href: "/lessons",
    icon: LessonIcon,
  },
  {
    type: 1,
    href: "/sermons",
    label: "Moizələr",
    icon: MicIcon,
  },
  {
    type: 2,
    href: "/speeches",
    label: "Çıxışlar",
    icon: SpeechIcon,
  },
  {
    type: 3,
    href: "/trainings",
    label: "Təlimlər",
    icon: TrainingIcon,
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
  },
  {
    type: 5,
    href: "/books",
    label: "Kitablar",
    icon: BookIcon,
  },

  {
    href: "/contact",
    label: "Əlaqə",
  },
];

export type BaseParams = {
  limit?: number;
  page: number;
  type?: number;
};

export type TabContentType = BaseParams & {
  enabled?: boolean;
  categoryIds?: [];
};
