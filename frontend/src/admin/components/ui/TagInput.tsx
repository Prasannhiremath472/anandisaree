import { useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function TagInput({ values, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const trimmed = draft.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    } else if (e.key === "Backspace" && !draft && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  function removeValue(value: string) {
    onChange(values.filter((v) => v !== value));
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-neutral-300 px-2 py-1.5 focus-within:border-royal-500 focus-within:ring-1 focus-within:ring-royal-500">
      {values.map((v) => (
        <span key={v} className="flex items-center gap-1 rounded-full bg-royal-50 px-2.5 py-1 text-xs font-medium text-royal-700">
          {v}
          <button type="button" onClick={() => removeValue(v)} aria-label={`Remove ${v}`} className="hover:text-royal-900">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={values.length === 0 ? placeholder : ""}
        className="min-w-[100px] flex-1 border-0 py-1 text-sm outline-none focus:ring-0"
      />
    </div>
  );
}
