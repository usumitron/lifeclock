// hooks/useBirthDate.ts
import { useState, useRef } from "react";

export function useBirthDate() {
  const [birth, setBirth] = useState<Date | null>(null);
  const [editingBirth, setEditingBirth] = useState(false);
  const isKeyboardInput = useRef(false);

  const resetKeyboardInput = () => {
    isKeyboardInput.current = false;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
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
    isKeyboardInput.current = true;
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const handleInputBlur = () => {
    setEditingBirth(false);
    isKeyboardInput.current = false;
  };

  return {
    birth,
    setBirth,
    editingBirth,
    setEditingBirth,
    resetKeyboardInput,
    handleDateChange,
    handleKeyDown,
    handleInputBlur,
  };
}
