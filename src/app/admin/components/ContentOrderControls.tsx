"use client";

import { CButton } from "@coreui/react";
import { FiChevronDown, FiChevronUp, FiEye, FiEyeOff } from "react-icons/fi";

export function OrderButtons({
  disabledUp,
  disabledDown,
  pending,
  onUp,
  onDown,
}: {
  disabledUp: boolean;
  disabledDown: boolean;
  pending: boolean;
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <div className="d-inline-flex flex-column me-2 align-middle">
      <CButton
        color="secondary"
        variant="outline"
        size="sm"
        className="px-1 py-0"
        title="Yuxarı"
        disabled={disabledUp || pending}
        onClick={onUp}
      >
        <FiChevronUp />
      </CButton>
      <CButton
        color="secondary"
        variant="outline"
        size="sm"
        className="px-1 py-0 mt-1"
        title="Aşağı"
        disabled={disabledDown || pending}
        onClick={onDown}
      >
        <FiChevronDown />
      </CButton>
    </div>
  );
}

export function VisibilityButton({
  hidden,
  pending,
  onToggle,
}: {
  hidden: boolean;
  pending: boolean;
  onToggle: () => void;
}) {
  return (
    <CButton
      color={hidden ? "secondary" : "success"}
      variant="outline"
      size="sm"
      className="me-2"
      title={hidden ? "Göstər" : "Gizlət"}
      disabled={pending}
      onClick={onToggle}
    >
      {hidden ? <FiEyeOff /> : <FiEye />}
    </CButton>
  );
}
