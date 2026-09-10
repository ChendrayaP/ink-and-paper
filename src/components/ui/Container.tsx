import { cn } from "@/lib/utils";

/**
 * Centered content column with responsive gutters. The reading column in the
 * book reader uses a narrower max width; this is the general page container.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-6 sm:px-8", className)}>
      {children}
    </div>
  );
}
