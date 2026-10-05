import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  placeholder?: string;
}

export function SearchBar({ className, inputClassName, iconClassName, placeholder }: SearchBarProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value.trim()), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const { data: suggestions = [], isFetching } = useStorefrontProducts({
    search: debouncedValue || undefined,
    pageSize: 6,
  });

  const showSuggestions = open && debouncedValue.length >= 2;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToResults(term: string) {
    const trimmed = term.trim();
    setOpen(false);
    navigate(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToResults(value);
  }

  function handleSelectSuggestion(slug: string | undefined, name: string) {
    setOpen(false);
    setValue("");
    if (slug) {
      navigate(`/product/${slug}`);
    } else {
      goToResults(name);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      (e.target as HTMLInputElement).blur();
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative w-full">
          <Search className={cn("pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50", iconClassName)} />
          <input
            type="search"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? "Search for sarees, fabrics, colors..."}
            aria-label="Search products"
            autoComplete="off"
            className={cn(
              "w-full rounded-full border border-gold-200/60 bg-white pr-4 text-charcoal placeholder:text-charcoal/40 focus:border-royal-400 focus:outline-none focus:ring-2 focus:ring-royal-200",
              inputClassName
            )}
          />
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gold-200/60 bg-white shadow-soft">
          {isFetching ? (
            <p className="px-4 py-3 text-ds-sm text-charcoal/50">Searching...</p>
          ) : suggestions.length === 0 ? (
            <p className="px-4 py-3 text-ds-sm text-charcoal/50">No products found for "{debouncedValue}".</p>
          ) : (
            <>
              <ul>
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectSuggestion(p.slug, p.name)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-cream-100"
                    >
                      <img src={p.image} alt={p.name} className="h-10 w-8 shrink-0 rounded object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-ds-sm font-medium text-charcoal">{p.name}</span>
                        <span className="block text-ds-xs text-charcoal/50">{p.category}</span>
                      </span>
                      <span className="shrink-0 text-ds-sm font-semibold text-royal-600">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToResults(debouncedValue)}
                className="w-full border-t border-gold-200/40 px-4 py-2.5 text-center text-ds-sm font-medium text-royal-600 hover:bg-cream-100"
              >
                View all results for "{debouncedValue}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
