import type { Metadata } from "next";
import { getAnalytics } from "@/lib/studio/analytics";
import { DailyTrend } from "@/components/studio/analytics/DailyTrend";
import { PageHeading } from "@/components/studio/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Analytics — Studio" },
  robots: { index: false, follow: false },
};

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line bg-paper-raised p-5">
      <div className="font-serif text-3xl text-ink">{value.toLocaleString()}</div>
      <div className="mt-1 font-sans text-sm text-ink-soft">{label}</div>
    </div>
  );
}

export default async function StudioAnalyticsPage() {
  const { summary, daily, topPages, bookViews } = await getAnalytics();

  return (
    <div>
      <PageHeading title="Analytics">
        Privacy-light page views. Counting begins when this is deployed — there is
        no historical backfill.
      </PageHeading>

      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Total page views" value={summary.total} />
        <Stat label="Views today" value={summary.today} />
        <Stat label="Last 7 days" value={summary.last7} />
        <Stat label="Last 30 days" value={summary.last30} />
      </div>

      {/* 30-day trend */}
      <section className="mt-10">
        <h2 className="font-serif text-xl text-ink">Daily views — last 30 days</h2>
        <div className="mt-4 border border-line bg-paper-raised p-5">
          <DailyTrend data={daily} />
        </div>
      </section>

      {/* Two tables side by side on desktop, stacked on mobile */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="min-w-0">
          <h2 className="font-serif text-xl text-ink">Top pages</h2>
          {topPages.length === 0 ? (
            <p className="mt-4 font-serif text-base italic text-ink-soft">
              No views recorded yet.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto border border-line">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-line bg-paper-raised">
                    <th className="px-4 py-2.5 font-sans text-xs font-semibold tracking-wide text-ink-soft">
                      Page
                    </th>
                    <th className="px-4 py-2.5 text-right font-sans text-xs font-semibold tracking-wide text-ink-soft">
                      Views
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.map((r) => (
                    <tr key={r.path} className="border-b border-line last:border-0">
                      <td className="px-4 py-2.5">
                        <span className="block truncate font-sans text-sm text-ink">
                          {r.path}
                        </span>
                        <span className="font-sans text-xs text-ink-soft">{r.kind}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-sans text-sm text-ink">
                        {r.views.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="min-w-0">
          <h2 className="font-serif text-xl text-ink">Book &amp; reader views</h2>
          {bookViews.length === 0 ? (
            <p className="mt-4 font-serif text-base italic text-ink-soft">
              No book views recorded yet.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto border border-line">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-line bg-paper-raised">
                    <th className="px-4 py-2.5 font-sans text-xs font-semibold tracking-wide text-ink-soft">
                      Book
                    </th>
                    <th className="px-4 py-2.5 text-right font-sans text-xs font-semibold tracking-wide text-ink-soft">
                      Views
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookViews.map((r) => (
                    <tr key={r.bookSlug} className="border-b border-line last:border-0">
                      <td className="px-4 py-2.5">
                        <span className="block truncate font-serif text-base text-ink">
                          {r.title}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-sans text-sm text-ink">
                        {r.views.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
