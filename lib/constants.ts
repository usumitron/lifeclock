// lib/constants.ts

export const YEAR = 365.2425 * 24 * 60 * 60 * 1000;
export const DAY = 24 * 60 * 60 * 1000;
export const HOUR = 60 * 60 * 1000;
export const MINUTE = 60 * 1000;
export const SECOND = 1000;

export type Unit = "year" | "day" | "hour" | "minute" | "second" | "full";
export type Lang = "ja" | "en";
export type Translations = typeof TEXT.ja;

export const DECIMALS: Record<Unit, number> = {
  year: 7,
  day: 5,
  hour: 3,
  minute: 1,
  second: 0,
  full: 0,
};

export const widthClassMap = {
  years: "w-[3ch]",
  days: "w-[3ch]",
  hours: "w-[2ch]",
  minutes: "w-[2ch]",
  seconds: "w-[2ch]",
};

export const TEXT = {
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