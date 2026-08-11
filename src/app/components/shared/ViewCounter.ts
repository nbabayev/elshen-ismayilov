"use client";
import { useEffect, useRef } from "react";
import { incrementArticleView } from "@/server-actions/article-actions";

export default function ViewCounter({ id }: { id: number }) {
  const hasCalled = useRef(false); // Bu render zamanı 2-ci dəfə işləməyə qoymur

  useEffect(() => {
    const viewedKey = `viewed_${id}`;
    const alreadyViewedInSession = sessionStorage.getItem(viewedKey);

    if (!hasCalled.current && !alreadyViewedInSession) {
      // API endpoint-ə `fetch` etmək əvəzinə, birbaşa Server Action-ı çağırırıq.
      // Next.js arxa planda təhlükəsiz RPC (Remote Procedure Call) yaradır.
      incrementArticleView(id);
      sessionStorage.setItem(viewedKey, "true");

      hasCalled.current = true;
    }
  }, [id]);

  return null;
}
