// lib/utils.ts

export function formatNumber(value: number, decimals: number, locale: string) {
  const parts = value.toFixed(decimals).split(".");
  const integer = Number(parts[0]).toLocaleString(locale);
  if (decimals === 0) return integer;
  return `${integer}.${parts[1]}`;
}

export function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatDateTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

export function getFullTime(diff: number, YEAR: number, DAY: number, HOUR: number, MINUTE: number, SECOND: number) {
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