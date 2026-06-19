"use client";

import React from "react";
import { CFooter } from "@coreui/react";

const AppFooter: React.FC = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a
          href="https://www.youtube.com/@elshanismayilovofficial"
          target="_blank"
          rel="noopener noreferrer"
        >
          Elshan Ismayilov
        </a>
        <span className="ms-1">&copy; 2026 Darul Hikmet.</span>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
