import { devFixturesEnabled } from "@/lib/data/fixtures";

/** Shown only when dev fixtures are active, so preview data is never mistaken
    for real content. Renders nothing in normal/production use. */
export function DevBanner() {
  if (!devFixturesEnabled()) return null;
  return (
    <div
      role="status"
      className="bg-accent px-4 py-1.5 text-center text-xs font-medium text-paper"
    >
      Development preview — sample data, not real content.
    </div>
  );
}
