"use client";

import { useState } from "react";
import { Translations } from "../lib/constants";

interface EventFormProps {
  t: Translations;
  onSave: (label: string, targetDate: string) => void;
  onCancel: () => void;
}

export function EventForm({ t, onSave, onCancel }: EventFormProps) {
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">イベント名</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-800"
            placeholder="例: 結婚記念日"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">日時</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-800"
          />
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            キャンセル
          </button>
          <button 
            onClick={() => onSave(label, date)}
            className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}