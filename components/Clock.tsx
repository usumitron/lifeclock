"use client";

import { useEffect, useState } from "react";
import { formatDateTime } from "../lib/utils";
import { Translations } from "../lib/constants";

export function CurrentTimeClock({ t, locale }: { t: Translations; locale: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="text-sm sm:text-base px-4 py-2 max-h-[500px]:py-0 max-h-[500px]:text-xs"
      style={{ fontVariantNumeric: "tabular-nums" }}>
      {t.currentTime}: {formatDateTime(new Date(now), locale)}
    </div>
  );
}