"use client";
import { useSettings } from "@/app/hooks/useSettings";
import React from "react";
import sharedStyles from "../shared/shared.module.scss";
import { createContext, useContext, useState, useEffect } from "react";
const SocialLinks = () => {
  const { data: settings, isLoading } = useSettings();

  return (
    <div
      className={`flex gap-4 flex-col gap-2 socialLink ${sharedStyles.socialLink}`}
    >
      <a href={settings?.Instagram} target="_blank" rel="noopener noreferrer">
        <div>
          <img src="/icons/ig.svg" alt="" />
        </div>
      </a>
      <a href={settings?.Facebook} target="_blank" rel="noopener noreferrer">
        <div>
          <img src="/icons/fb.svg" alt="" />
        </div>
      </a>
      <a href={settings?.Youtube} target="_blank" rel="noopener noreferrer">
        <div>
          <img src="/icons/yt.svg" alt="" />
        </div>
      </a>
      <a href={settings?.Telegram} target="_blank" rel="noopener noreferrer">
        <div>
          <img src="/icons/telegram.svg" alt="" />
        </div>
      </a>
      <a href={settings?.TikTok} target="_blank" rel="noopener noreferrer">
        <div>
          <img src="/icons/tk.svg" alt="" />
        </div>
      </a>
    </div>
  );
};

export default SocialLinks;
