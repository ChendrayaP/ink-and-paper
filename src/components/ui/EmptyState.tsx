/** A calm, human empty state — used when there is no content yet. */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-8">
      <p className="font-serif text-lg italic leading-relaxed text-ink-soft">
        {children}
      </p>
    </div>
  );
}
