import { DesktopCoverSidebar } from "@/components/reader/DesktopCoverSidebar";

/*
  Reading layout. On large screens: a narrow, sticky cover sidebar on the left
  and the reading column beside it. On mobile: the reading column only, with
  comfortable margins. The reading column keeps a book-like measure at every
  width, and nothing overflows horizontally.
*/
export function ReaderShell({
  slug,
  title,
  coverUrl,
  children,
}: {
  slug: string;
  title: string;
  coverUrl: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
      <div className="lg:grid lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-16">
        <DesktopCoverSidebar slug={slug} title={title} coverUrl={coverUrl} />
        <div className="mx-auto w-full max-w-[42rem]">{children}</div>
      </div>
    </div>
  );
}
