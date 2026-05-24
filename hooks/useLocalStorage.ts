// hooks/useLocalStorage.ts
import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // ▼ 修正: 初期値の決定を useState のInitializerとして記述
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          return JSON.parse(item);
        } catch {
          return item as unknown as T;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return initialValue;
  });

  // 値を更新し、localStorage に保存する関数
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // 書き込み処理を保護
      try {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (e) {
        // 容量不足エラーの場合はここに来る
        console.warn(`localStorage full: could not save key "${key}"`, e);
      }
    } catch (error) {
      console.error("useLocalStorage setValue error:", error);
    }
  };
  return [storedValue, setValue] as const;
}
