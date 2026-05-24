"use client";

import { useEffect, useState } from "react";
import { TEXT, Unit, Lang } from "../lib/constants";
import { formatDate } from "../lib/utils";
import { CurrentTimeClock } from "../components/Clock";
import { ElapsedTimeCounter } from "../components/Counter";
import { useBirthDate } from "../hooks/useBirthDate";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { styles } from "../lib/styles";

// --- メインコンポーネント（静的UIと状態管理を担当） ---
export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [draftDate, setDraftDate] = useState("");
  const [unit, setUnit] = useLocalStorage<Unit>("unit", "full");
  const [selectedTarget, setSelectedTarget] = useState<Date | null>(null); // 選択中のターゲット

  const [lang, setLang] = useLocalStorage<Lang>("lang", "ja");
  const t = TEXT[lang as keyof typeof TEXT] || TEXT.ja;
  const locale = lang === "ja" ? "ja-JP" : "en-US";

  const {
    birth,
    setBirth,
    editingBirth,
    setEditingBirth,
    resetKeyboardInput,
    handleDateChange,
    handleKeyDown,
    handleInputBlur,
  } = useBirthDate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);

    if (birth && !selectedTarget) {
      setSelectedTarget(birth);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
  };

  if (!isMounted) return null;

  return (
    <div className={styles.container}>
      {/* 言語切替 */}
      <div className={styles.langButton}>
        <button onClick={() => changeLang("ja")}>JA</button>
        <button onClick={() => changeLang("en")}>EN</button>
      </div>

      {/* 現在時刻と誕生日入力 */}
      <div className={styles.currentTimeAndBirthInput}>
        <CurrentTimeClock t={t} locale={locale} />

        <div className="text-sm sm:text-base max-h-[500px]:text-xs">
          {editingBirth ? (
            <input
              type="date"
              value={draftDate}
              autoFocus
              onClick={() => {
                resetKeyboardInput();
              }}
              onKeyDown={handleKeyDown}
              onChange={handleDateChange}
              onBlur={handleInputBlur}
              className={styles.input}
            />
          ) : (
            <span
              onClick={() => {
                setDraftDate(birth ? birth.toISOString().slice(0, 10) : "");
                setEditingBirth(true);
              }}
              className={styles.span}>
              {t.yourBirth}: {birth ? formatDate(birth, locale) : t.notSet}
            </span>
          )}
        </div>
      </div>

      {/* タイトル */}
      <div className="text-sm sm:text-base md:text-lg opacity-80 text-center max-h-[500px]:text-xs max-h-[500px]:opacity-50">
        {t.title}
      </div>

      {/* カウンター表示 */}
      <ElapsedTimeCounter
        targetDate={birth}
        unit={unit}
        locale={locale}
        t={t}
        isCountdown={false}
      />

      {/* 単位切り替えボタン */}
      <div className="grid grid-cols-3 sm:flex gap-2 max-h-[500px]:gap-1">
        {(["full", "year", "day", "hour", "minute", "second"] as Unit[]).map(
          (u) => (
            <button
              key={u}
              onClick={() => {
                setUnit(u);
                localStorage.setItem("unit", u);
              }}
              className={styles.unitButton(unit === u)}>
              {t[u]}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
