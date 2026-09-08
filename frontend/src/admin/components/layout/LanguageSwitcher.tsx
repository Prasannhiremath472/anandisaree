import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { cn } from "@/admin/utils";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "mr", label: "मराठी" },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1 rounded-full border border-neutral-200 p-0.5">
      <Languages className="ml-1.5 h-3.5 w-3.5 text-neutral-400" />
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => i18n.changeLanguage(lang.code)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            i18n.resolvedLanguage === lang.code
              ? "bg-royal-gradient text-white shadow-sm"
              : "text-neutral-500 hover:text-royal-600"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
