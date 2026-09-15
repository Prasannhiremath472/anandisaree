import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, X } from "lucide-react";
import { cn } from "@/admin/utils";

interface SearchableMultiSelectProps {
  /** Known suggestions to search/filter (e.g. previously-used values, or saved tags). */
  suggestions: string[];
  values: string[];
  onChange: (values: string[]) => void;
  onCreate?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * A searchable multiselect combobox: selected values render as removable
 * chips, typing filters the suggestion list, and a value with no match can
 * be added as a brand-new custom entry. Shares the same hand-rolled
 * approach as SearchableSelect rather than pulling in a combobox library.
 */
export function SearchableMultiSelect({
  suggestions,
  values,
  onChange,
  onCreate,
  placeholder,
  className,
}: SearchableMultiSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedQuery = query.trim();
  const filtered = suggestions.filter(
    (s) => !values.includes(s) && (!trimmedQuery || s.toLowerCase().includes(trimmedQuery.toLowerCase()))
  );
  const exactMatchExists = suggestions.some((s) => s.toLowerCase() === trimmedQuery.toLowerCase());
  const canCreate = trimmedQuery.length > 0 && !exactMatchExists && !values.some((v) => v.toLowerCase() === trimmedQuery.toLowerCase());

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

  function addValue(value: string) {
    if (!values.includes(value)) {
      onChange([...values, value]);
      onCreate?.(value);
    }
    setQuery("");
    inputRef.current?.focus();
  }

  function removeValue(value: string) {
    onChange(values.filter((v) => v !== value));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (canCreate) addValue(trimmedQuery);
      else if (filtered.length > 0) addValue(filtered[0]);
    } else if (e.key === "Backspace" && !query && values.length > 0) {
      removeValue(values[values.length - 1]);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
        className="flex flex-wrap items-center gap-1.5 rounded-lg border border-neutral-300 px-2 py-1.5 focus-within:border-royal-500 focus-within:ring-1 focus-within:ring-royal-500"
      >
        {values.map((v) => (
          <span key={v} className="flex items-center gap-1 rounded-full bg-royal-50 px-2.5 py-1 text-xs font-medium text-royal-700">
            {v}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeValue(v);
              }}
              aria-label={t("common.removeValue", { value: v })}
              className="hover:text-royal-900"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? placeholder : ""}
          className="min-w-[100px] flex-1 border-0 py-1 text-sm outline-none focus:ring-0"
        />
      </div>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg">
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => addValue(option)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-royal-50"
                >
                  <Search className="h-3.5 w-3.5 text-neutral-400" />
                  {option}
                </button>
              </li>
            ))}
            {canCreate && (
              <li>
                <button
                  type="button"
                  onClick={() => addValue(trimmedQuery)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-royal-600 hover:bg-royal-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t("common.createValue", { value: trimmedQuery })}
                </button>
              </li>
            )}
            {filtered.length === 0 && !canCreate && (
              <li className="px-3 py-2 text-sm text-neutral-400">{t("common.noMatchesFound")}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
