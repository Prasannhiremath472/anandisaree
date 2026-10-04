import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t("common.search")}
        className="w-full rounded-lg border border-neutral-300 py-1.5 pl-8 pr-3 text-xs focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500"
      />
    </div>
  );
}
