"use client";

import { useEffect, useState } from "react";
import {
  YEAR,
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  DECIMALS,
  widthClassMap,
} from "../lib/constants";
import { getFullTime, formatNumber } from "../lib/utils";
import { Translations } from "../lib/constants";
import { Unit } from "../lib/constants";

export function ElapsedTimeCounter({
  targetDate, // 誕生日やイベントの日時
  unit,
  locale,
  t,
  isCountdown = false, // 追加：カウントダウンモードの切り替え
}: {
  targetDate: Date | null;
  unit: Unit;
  locale: string;
  t: Translations;
  isCountdown?: boolean;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 100); // 100ms ごとの更新で十分滑らかに見えます

    return () => clearInterval(timer);
  }, []);

  if (!targetDate) return null;

  const diff = isCountdown
    ? targetDate.getTime() - now
    : now - targetDate.getTime();

  // カウントダウンが終了したら0を表示
  const displayDiff = Math.max(0, diff);

  const display =
    unit === "full"
      ? getFullTime(displayDiff, YEAR, DAY, HOUR, MINUTE, SECOND)
      : unit === "second"
        ? Math.floor(displayDiff / SECOND).toLocaleString(locale)
        : formatNumber(
            displayDiff /
              (unit === "year"
                ? YEAR
                : unit === "day"
                  ? DAY
                  : unit === "hour"
                    ? HOUR
                    : unit === "minute"
                      ? MINUTE
                      : SECOND),
            DECIMALS[unit],
            locale,
          );

  const displayValues =
    unit === "full"
      ? (display as ReturnType<typeof getFullTime>)
      : { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <div
      className="font-bold text-center text-5xl sm:text-7xl md:text-8xl tracking-tight transition-all duration-100"
      style={{ fontVariantNumeric: "tabular-nums" }}>
      {unit === "full" ? (
        <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-6 gap-y-4 max-h-[500px]:gap-y-1">
          {[
            { key: "years", v: displayValues.years, l: t.year },
            { key: "days", v: displayValues.days, l: t.day },
            { key: "hours", v: displayValues.hours, l: t.hour },
            { key: "minutes", v: displayValues.minutes, l: t.minute },
            { key: "seconds", v: displayValues.seconds, l: t.second },
          ].map((item) => (
            <div key={item.key} className="text-center">
              <div
                className={`text-3xl min-[390px]:text-4xl sm:text-5xl md:text-6xl max-h-[500px]:text-4xl font-bold leading-none text-center ${widthClassMap[item.key as keyof typeof widthClassMap]} mx-0 sm:mx-1`}>
                {item.v ?? 0}
              </div>
              <div className="text-xs sm:text-base opacity-70 mt-1 max-h-[500px]:mt-0 tracking-wide">
                {item.l}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="font-bold text-center text-5xl sm:text-7xl md:text-8xl max-h-[500px]:text-5xl">
          {display as string}
        </div>
      )}
    </div>
  );
}
