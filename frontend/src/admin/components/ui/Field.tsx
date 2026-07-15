import { cn } from "@/admin/utils";

interface FieldProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function Field({ label, error, children, required, className, ...rest }: FieldProps) {
  return (
    <label className={cn("block", className)} {...rest}>
      <span className="text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-royal-500 focus:outline-none focus:ring-1 focus:ring-royal-500";
