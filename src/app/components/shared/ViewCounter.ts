"use client";
import { useEffect, useRef } from "react";

export default function ViewCounter({ id }: { id: number }) {
  const hasCalled = useRef(false); // Bu render zamanı 2-ci dəfə işləməyə qoymur

  useEffect(() => {
    // sessionStorage yoxlayırıq ki, eyni session-da bu ID üçün POST atılıbmı
    const viewedKey = `viewed_${id}`;
    const alreadyViewedInSession = sessionStorage.getItem(viewedKey);

    if (!hasCalled.current && !alreadyViewedInSession) {
      fetch(`/api/articles/view/${id}`, { method: "POST" })
        .then(() => {
          sessionStorage.setItem(viewedKey, "true");
        })
        .catch(console.error);

      hasCalled.current = true;
    }
  }, [id]);

  return null;
}
