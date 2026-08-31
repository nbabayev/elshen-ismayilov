"use client";
import { useSettings } from "@/app/hooks/useSettings";
const SocialLinks = () => {
  const { data: settings, isLoading } = useSettings();

  return (
    <div
      className={`flex gap-4 flex-col gap-2 socialLink
  text-[20px] text-[#003a3c] md:text-[24px]
  [&_a:hover_img]:[filter:brightness(0)_saturate(100%)_invert(37%)_sepia(62%)_saturate(433%)_hue-rotate(16deg)_brightness(93%)_contrast(87%)]
"`}
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
