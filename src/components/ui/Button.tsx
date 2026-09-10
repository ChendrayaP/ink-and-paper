import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "quiet";

const base =
  "inline-flex items-center justify-center rounded-[2px] text-sm font-medium " +
  "transition-colors focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-2 focus-visible:outline-accent";

const styles: Record<Variant, string> = {
  primary: "bg-ink px-6 py-3 text-paper hover:opacity-90",
  quiet:
    "px-1 py-1 text-ink underline decoration-ink-soft/40 underline-offset-4 " +
    "hover:decoration-ink",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
};

/** A link styled as a button (primary) or a quiet inline link. */
export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className,
}: Props) {
  const cls = cn(base, styles[variant], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
