"use client";

import React from "react";
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
import { cilLockLocked, cilSettings, cilUser } from "@coreui/icons";

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
          A
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="p-0">
        <CDropdownDivider />
        <CDropdownItem as="button" type="button" onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Hesabi bagla
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
