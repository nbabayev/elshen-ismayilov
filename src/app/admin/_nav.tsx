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
  cilMap,
  cilColumns,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

export interface NavItem {
  component: typeof CNavItem | typeof CNavGroup | typeof CNavTitle;
  name: string | React.ReactNode;
  to?: string;
  href?: string;
  icon?: React.ReactNode;
  visible?: boolean;
  badge?: {
    color: string;
    text: string;
  };
  items?: NavItem[];
}

const _nav: NavItem[] = [
  // sliders
  {
    component: CNavTitle,
    name: "Slayderlər",
  },
  {
    component: CNavItem,
    name: "Əsas Slayder",
    to: "/admin/sliders",
    icon: <CIcon icon={cilViewColumn} customClassName="nav-icon" />,
  },
  // mini-sliders
  {
    component: CNavItem,
    name: "Mini Slayder",
    to: "/admin/mini-sliders",
    icon: <CIcon icon={cilColumns} customClassName="nav-icon" />,
  },
  // categories
  {
    component: CNavItem,
    name: "Kateqoriyalar",
    to: "/admin/categories",
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: "Videolar",
    to: "/admin/videos",
    visible: true,
    icon: <CIcon icon={cilMediaPlay} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Dersler",
        to: "/admin/videos/type/0",
        icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
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
        icon: <CIcon icon={cilTv} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: "Təlimlər",
        to: "/admin/videos/type/3",
        icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavItem,
    name: "Məqalələr",
    to: "/admin/articles",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Kitablar",
    to: "/admin/books",
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: "Qalereya",
    to: "/admin/gallery",
    icon: <CIcon icon={cilFilterPhoto} customClassName="nav-icon" />,
  },
];

export default _nav;
