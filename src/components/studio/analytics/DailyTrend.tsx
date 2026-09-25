import type { DailyPoint } from "@/lib/studio/analytics";

/*
  Dependency-free 30-day bar chart. Pure CSS bars in a flex row; each bar's
  height is a percentage of the period's max. No charting library.
*/
export function DailyTrend({ data }: { data: DailyPoint[] }) {
  const max = Math.max(1, ...data.map((d) => d.views));
  return (
    <div>
      <div
        className="flex h-40 items-end gap-[3px] overflow-hidden"
        role="img"
        aria-label={`Daily views for the last ${data.length} days`}
      >
        {data.map((d) => (
          <div
            key={d.day}
            className="min-w-0 flex-1 rounded-t-[1px] bg-accent/70"
            style={{ height: `${Math.max(2, Math.round((d.views / max) * 100))}%` }}
            title={`${d.day}: ${d.views} ${d.views === 1 ? "view" : "views"}`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-sans text-xs text-ink-soft">
        <span>{data[0]?.day}</span>
        <span>Peak: {max}</span>
        <span>{data[data.length - 1]?.day}</span>
      </div>
    </div>
  );
}
