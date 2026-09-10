import type { Metadata } from "next";
import { getSiteSettingsRow } from "@/lib/studio/queries";
import { SettingsForm } from "@/components/studio/SettingsForm";
import { PageHeading } from "@/components/studio/ui";
import { siteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "Site settings — Studio" },
  robots: { index: false, follow: false },
};

export default async function StudioSettingsPage() {
  const s = await getSiteSettingsRow();
  return (
    <div>
      <PageHeading title="Site settings">
        Public details shown across the site. The canonical URL is configured
        separately, in the environment.
      </PageHeading>
      <SettingsForm
        initial={{
          siteName: s?.site_name ?? siteConfig.brand,
          authorName: s?.author_name ?? siteConfig.author,
          siteDescription: s?.site_description ?? siteConfig.description,
          instagramUrl: s?.instagram_url ?? "",
          contactEmail: s?.contact_email ?? "",
        }}
      />
    </div>
  );
}
