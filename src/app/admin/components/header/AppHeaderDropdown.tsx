"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilSettings, cilInfo, cilPeople } from "@coreui/icons";

const AppHeaderDropdown: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.replace("/admin/login");
  };

  return (
    <CDropdown variant="nav-item" placement="bottom-end">
      <CDropdownToggle className="py-0 pe-0" caret={false}>
        <CAvatar color="primary" size="md">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="w-[25px] h-[25px] rounded-full object-cover"
          />
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem as={Link} href="/admin/settings">
          <CIcon icon={cilSettings} className="me-2" />
          Sayt parametrləri
        </CDropdownItem>
        <CDropdownItem as={Link} href="/admin/about">
          <CIcon icon={cilInfo} className="me-2" />
          Haqqında
        </CDropdownItem>
        <CDropdownItem as={Link} href="/admin/subscriptions">
          <CIcon icon={cilPeople} className="me-2" />
          Abunəçilər
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem as="button" type="button" onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Çıxış
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
