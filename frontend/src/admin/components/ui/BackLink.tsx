import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-royal-600">
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
