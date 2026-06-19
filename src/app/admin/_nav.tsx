import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilPencil,
  cilPlus,
  cilViewColumn,
  cilMediaPlay,
  cilNotes,
  cilBook,
  cilFilterPhoto,
  cilBold,
  cilSpeech,
  cilTv,
  cilSpeedometer,
  cilSettings,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

export interface NavItem {
  component: typeof CNavItem | typeof CNavGroup | typeof CNavTitle;
  name: string | React.ReactNode;
  to?: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: {
    color: string;
    text: string;
  };
  items?: NavItem[];
}

const _nav: NavItem[] = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/admin",
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Sayt parametrləri",
    to: "/admin/settings",
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Haqqında",
    to: "/admin/about",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  // gallery
  {
    component: CNavTitle,
    name: "Qalereya",
  },
  {
    component: CNavItem,
    name: "Qalereya",
    to: "/admin/gallery",
    icon: <CIcon icon={cilFilterPhoto} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Qalereya yarat",
    to: "/admin/gallery/add",
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  // sliders
  {
    component: CNavTitle,
    name: "Slayderler",
  },
  {
    component: CNavItem,
    name: "Slayderler",
    to: "/admin/sliders",
    icon: <CIcon icon={cilViewColumn} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Slayder elave et",
    to: "/admin/sliders/add",
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  // mini-sliders
  {
    component: CNavTitle,
    name: "Mini Slayderler",
  },
  {
    component: CNavItem,
    name: "Mini Slayderler",
    to: "/admin/mini-sliders",
    icon: <CIcon icon={cilViewColumn} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Mini Slayder elave et",
    to: "/admin/mini-sliders/add",
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  // categories
  {
    component: CNavTitle,
    name: "Kateqoriylar",
  },
  {
    component: CNavItem,
    name: "Kateqoriyalar",
    to: "/admin/categories",
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Kateqoriya elave et",
    to: "/admin/categories/add",
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  // videos
  {
    component: CNavTitle,
    name: "Videolar",
  },
  {
    component: CNavGroup,
    name: "Videolar",
    to: "/admin/videos",
    icon: <CIcon icon={cilMediaPlay} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Dersler",
        to: "/admin/videos/type/0",
        icon: <CIcon icon={cilBold} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Moizeler",
        to: "/admin/videos/type/1",
        icon: <CIcon icon={cilSpeech} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Verilişlər",
        to: "/admin/videos/type/2",
      },
      {
        component: CNavItem,
        name: "Təlimlər",
        to: "/admin/videos/type/3",
        icon: <CIcon icon={cilTv} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavItem,
    name: "Video əlavə et",
    to: "/admin/videos/add",
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  // articles
  {
    component: CNavTitle,
    name: "Meqaleler",
  },
  {
    component: CNavItem,
    name: "Meqaleler",
    to: "/admin/articles",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Meqale elave et",
    to: "/admin/articles/add",
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  // books
  {
    component: CNavTitle,
    name: "Kitablar",
  },
  {
    component: CNavItem,
    name: "Kitablar",
    to: "/admin/books",
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Kitab elave et",
    to: "/admin/books/add",
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
];

export default _nav;
