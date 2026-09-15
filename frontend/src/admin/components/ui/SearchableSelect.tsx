import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/admin/utils";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A single-select dropdown with a type-to-filter search box. Built without a
 * combobox library — matches this project's pattern of small hand-rolled UI
 * primitives (TagInput, SearchInput) instead of pulling in a new dependency.
 */
export function SearchableSelect({ options, value, onChange, placeholder, disabled, className }: SearchableSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleOpen() {
    if (disabled) return;
    setOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-neutral-300 px-3 py-2 text-left text-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500",
          disabled && "cursor-not-allowed bg-neutral-50 text-neutral-500"
        )}
      >
        <span className={selected ? "text-neutral-800" : "text-neutral-400"}>
          {selected?.label ?? placeholder ?? t("common.select")}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-neutral-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("common.search")}
              className="w-full border-0 p-0 text-sm outline-none focus:ring-0"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-neutral-400">{t("common.noMatchesFound")}</li>
            ) : (
              filtered.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-royal-50"
                  >
                    {option.label}
                    {option.value === value && <Check className="h-4 w-4 text-royal-600" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
