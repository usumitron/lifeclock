"use client";

import { useEffect, useState, useRef } from "react";

type Unit = "year" | "day" | "hour" | "minute" | "second" | "full";

const YEAR = 365.2425 * 24 * 60 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const SECOND = 1000;

const DECIMALS: Record<Unit, number> = {
  year: 7,
  day: 5,
  hour: 3,
  minute: 1,
  second: 0,
  full: 0,
};

const widthClassMap = {
  years: "w-[3ch]",
  days: "w-[3ch]",
  hours: "w-[2ch]",
  minutes: "w-[2ch]",
  seconds: "w-[2ch]",
};

type Lang = "ja" | "en";

const TEXT = {
  ja: {
    title: "生まれてからの経過時間",
    year: "年",
    day: "日",
    hour: "時間",
    minute: "分",
    second: "秒",
    full: "年日時分秒",
    input: "誕生日を入力",
    save: "保存",
    notSet: "未設定",
    currentTime: "現在時刻",
    yourBirth: "あなたの誕生日",
  },
  en: {
    title: "Time since you were born",
    year: "years",
    day: "days",
    hour: "hours",
    minute: "minutes",
    second: "seconds",
    full: "Y-D-h-m-s",
    input: "Enter your birth date",
    save: "Save",
    notSet: "Not set",
    currentTime: "Current time",
    yourBirth: "Your birth date",
  },
};

type Translations = typeof TEXT.ja;

function formatNumber(value: number, decimals: number, locale: string) {
  const parts = value.toFixed(decimals).split(".");
  const integer = Number(parts[0]).toLocaleString(locale);
  if (decimals === 0) return integer;
  return `${integer}.${parts[1]}`;
}

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatDateTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function getFullTime(diff: number) {
  let remaining = Math.max(0, diff);

  const years = Math.floor(remaining / YEAR);
  remaining -= years * YEAR;

  const days = Math.floor(remaining / DAY);
  remaining -= days * DAY;

  const hours = Math.floor(remaining / HOUR);
  remaining -= hours * HOUR;

  const minutes = Math.floor(remaining / MINUTE);
  remaining -= minutes * MINUTE;

  const seconds = Math.floor(remaining / SECOND);

  return { years, days, hours, minutes, seconds };
}

// --- パフォーマンス改善: 現在時刻表示（1秒ごとの更新で十分なため setInterval を使用） ---
function CurrentTimeClock({ t, locale }: { t: Translations; locale: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    // ▼ 変更: 横画面(高さ不足)時は余白を削り文字を小さくする (max-h-[500px]:...)
    <div
      className="text-sm sm:text-base px-4 py-2 max-h-[500px]:py-0 max-h-[500px]:text-xs"
      style={{ fontVariantNumeric: "tabular-nums" }}>
      {t.currentTime}: {formatDateTime(new Date(now), locale)}
    </div>
  );
}

// --- パフォーマンス改善: 経過時間カウンター（高速描画のため requestAnimationFrame を使用） ---
function ElapsedTimeCounter({
  birth,
  unit,
  locale,
  t,
}: {
  birth: Date | null;
  unit: Unit;
  locale: string;
  t: Translations;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let raf: number;
    const loop = () => {
      setNow(Date.now());
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const getValue = () => {
    if (!birth) return 0;
    const diff = now - birth.getTime();
    switch (unit) {
      case "year":
        return diff / YEAR;
      case "day":
        return diff / DAY;
      case "hour":
        return diff / HOUR;
      case "minute":
        return diff / MINUTE;
      case "second":
        return diff / SECOND;
      default:
        return 0;
    }
  };

  const diff = birth ? now - birth.getTime() : 0;
  const value = Math.max(0, getValue());

  const display =
    unit === "full"
      ? getFullTime(diff)
      : unit === "second"
        ? Math.floor(value).toLocaleString(locale)
        : formatNumber(value, DECIMALS[unit], locale);

  return (
    <div
      className="font-bold text-center text-5xl sm:text-7xl md:text-8xl tracking-tight transition-all duration-100"
      style={{ fontVariantNumeric: "tabular-nums" }}>
      {unit === "full" ? (
        // ▼ 変更: 横画面時は上下の隙間を減らす (max-h-[500px]:gap-y-1)
        <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-6 gap-y-4 max-h-[500px]:gap-y-1">
          {[
            {
              key: "years",
              v: (display as ReturnType<typeof getFullTime>).years,
              l: t.year,
            },
            {
              key: "days",
              v: (display as ReturnType<typeof getFullTime>).days,
              l: t.day,
            },
            {
              key: "hours",
              v: (display as ReturnType<typeof getFullTime>).hours,
              l: t.hour,
            },
            {
              key: "minutes",
              v: (display as ReturnType<typeof getFullTime>).minutes,
              l: t.minute,
            },
            {
              key: "seconds",
              v: (display as ReturnType<typeof getFullTime>).seconds,
              l: t.second,
            },
          ].map((item) => (
            <div key={item.key} className="text-center">
              {/* ▼ 変更: 横画面時は数字サイズを少し小さくする (max-h-[500px]:text-4xl) */}
              <div
                className={`text-3xl min-[390px]:text-4xl sm:text-5xl md:text-6xl max-h-[500px]:text-4xl font-bold leading-none text-center ${widthClassMap[item.key as keyof typeof widthClassMap]} mx-0 sm:mx-1`}
                style={{ fontVariantNumeric: "tabular-nums" }}>
                {item.v}
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

// --- メインコンポーネント（静的UIと状態管理を担当） ---
export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [birth, setBirth] = useState<Date | null>(null);
  const [draftDate, setDraftDate] = useState("");
  const [unit, setUnit] = useState<Unit>("full");
  const [editingBirth, setEditingBirth] = useState(false);
  const [lang, setLang] = useState<Lang>("ja");

  const t = TEXT[lang];
  const locale = lang === "ja" ? "ja-JP" : "en-US";
  const isKeyboardInput = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    const savedLang = localStorage.getItem("lang") as Lang | null;
    if (savedLang) {
      setLang(savedLang);
    } else {
      const browserLang =
        typeof navigator !== "undefined" && navigator.language.startsWith("ja")
          ? "ja"
          : "en";
      setLang(browserLang);
    }

    const savedUnit = localStorage.getItem("unit");
    if (
      savedUnit &&
      ["full", "year", "day", "hour", "minute", "second"].includes(savedUnit)
    ) {
      setUnit(savedUnit as Unit);
    }

    const savedBirth = localStorage.getItem("birth");
    if (savedBirth) {
      setBirth(new Date(savedBirth));
    }

    const resetScroll = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
    };

    window.addEventListener("orientationchange", resetScroll);
    window.addEventListener("resize", resetScroll);

    return () => {
      window.removeEventListener("orientationchange", resetScroll);
      window.removeEventListener("resize", resetScroll);
    };
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDraftDate(newValue);

    if (newValue) {
      const d = new Date(newValue);
      if (!isNaN(d.getTime())) {
        setBirth(d);
        localStorage.setItem("birth", d.toISOString());

        const isTouchDevice =
          typeof window !== "undefined" && "ontouchstart" in window;
        if (!isKeyboardInput.current && !isTouchDevice) {
          setEditingBirth(false);
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isMounted) {
      isKeyboardInput.current = true;
    }
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const handleInputBlur = () => {
    setEditingBirth(false);
    isKeyboardInput.current = false;
  };

  if (!isMounted) return null;

  return (
    // ▼ 変更: 100vh を 100dvh にし、横画面時の縦ギャップを縮小 (max-h-[500px]:gap-2)
    <div
      className="
        min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center
        px-4 sm:px-8 gap-6 landscape:gap-1
        bg-white text-black
        landscape:justify-start
        landscape:pt-6
        dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800
        dark:text-white
      ">
      {/* 2. 言語切替ボタンも高さに応じて小さく */}
      <div className="absolute top-4 right-4 max-h-[500px]:top-2 flex gap-2">
        <button onClick={() => changeLang("ja")}>JA</button>
        <button onClick={() => changeLang("en")}>EN</button>
      </div>

      <div className="sm:text-sm opacity-60 text-center leading-relaxed space-y-1 max-h-[500px]:space-y-0">
        <CurrentTimeClock t={t} locale={locale} />

        <div className="text-sm sm:text-base max-h-[500px]:text-xs">
          {editingBirth ? (
            <input
              type="date"
              value={draftDate}
              autoFocus
              onClick={() => {
                isKeyboardInput.current = false;
              }}
              onKeyDown={handleKeyDown}
              onChange={handleDateChange}
              onBlur={handleInputBlur}
              className="
                border rounded-md px-3 py-2 max-h-[500px]:py-1
                text-base sm:text-lg max-h-[500px]:text-sm bg-white text-black
                focus:outline-none focus:ring-2 focus:ring-blue-400
              "
            />
          ) : (
            <span
              onClick={() => {
                setDraftDate(birth ? birth.toISOString().slice(0, 10) : "");
                setEditingBirth(true);
              }}
              className="
                cursor-pointer px-2 py-1 rounded-md
                transition-all duration-200 hover:bg-gray-200 hover:text-black
                dark:hover:bg-white dark:hover:text-black
              ">
              {t.yourBirth}: {birth ? formatDate(birth, locale) : t.notSet}
            </span>
          )}
        </div>
      </div>

      <div className="text-sm sm:text-base md:text-lg opacity-80 text-center max-h-[500px]:text-xs max-h-[500px]:opacity-50">
        {t.title}
      </div>

      <ElapsedTimeCounter birth={birth} unit={unit} locale={locale} t={t} />

      <div className="grid grid-cols-3 sm:flex gap-2 max-h-[500px]:gap-1">
        {(["full", "year", "day", "hour", "minute", "second"] as Unit[]).map(
          (u) => (
            <button
              key={u}
              onClick={() => {
                setUnit(u);
                localStorage.setItem("unit", u);
              }}
              className={`
              px-3 py-2 sm:px-4 sm:py-2 rounded-lg border transition-all duration-150 active:scale-95
              max-h-[500px]:py-1 max-h-[500px]:px-2 max-h-[500px]:text-xs
              ${
                unit === u
                  ? `bg-black text-white border-black dark:bg-white dark:text-black dark:border-white`
                  : `bg-white text-black border-gray-300 hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/30`
              }
            `}>
              {t[u]}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
