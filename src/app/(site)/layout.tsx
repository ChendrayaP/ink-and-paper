import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SkipLink } from "@/components/layout/SkipLink";
import { DevBanner } from "@/components/ui/DevBanner";
import { ViewBeacon } from "@/components/analytics/ViewBeacon";

/** Layout for the public reading site. The private /auth and /studio areas do
    NOT use this chrome, keeping the public navigation off those screens. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ViewBeacon />
      <DevBanner />
      <div className="flex min-h-screen flex-col">
        <SkipLink />
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
