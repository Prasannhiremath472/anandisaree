interface TooltipProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * CSS-only hover/focus tooltip for icon-only buttons. Wraps the trigger in a
 * relatively-positioned span so the tooltip bubble can be absolutely
 * positioned above it, shown via group-hover/group-focus-within rather than
 * JS state — no new dependency, consistent with this project's small
 * hand-rolled UI primitives.
 */
export function Tooltip({ label, children, className }: TooltipProps) {
  return (
    <span className={`group/tooltip relative inline-flex ${className ?? ""}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-800 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
