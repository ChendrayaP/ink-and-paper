/** Keyboard users can jump straight to the main content. */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only rounded-[2px] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
    >
      Skip to content
    </a>
  );
}
