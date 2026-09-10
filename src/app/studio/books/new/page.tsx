import type { Metadata } from "next";
import { NewBookForm } from "@/components/studio/NewBookForm";
import { PageHeading, BackLink } from "@/components/studio/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "New book — Studio" },
  robots: { index: false, follow: false },
};

export default function NewBookPage() {
  return (
    <div>
      <div className="mb-6">
        <BackLink href="/studio/books">Books</BackLink>
      </div>
      <PageHeading title="Add a new book">
        Save a draft now; add the cover and chapters next. You can publish once
        it’s ready.
      </PageHeading>
      <NewBookForm />
    </div>
  );
}
