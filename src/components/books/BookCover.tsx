import { cn } from "@/lib/utils";

/*
  Renders a book's front cover with the ENTIRE image always visible — top to
  bottom, including the author's name at the foot of the artwork. The image is
  height-capped and sized with object-contain, so covers of different aspect
  ratios are never cropped, stretched, or distorted. A plain <img> is used
  deliberately: cover dimensions are not known ahead of time, and contain-style
  intrinsic sizing guarantees the whole artwork shows. (Can move to next/image
  once real cover dimensions are stored.)
*/
export function BookCover({
  src,
  alt,
  className,
}: {
  src: string | null;
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex aspect-[2/3] items-center justify-center border border-line bg-paper-raised p-4",
          className,
        )}
      >
        <span className="text-center font-serif text-sm italic text-ink-soft">
          {alt}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Cover of ${alt}`}
      loading="lazy"
      className={cn(
        "max-h-full w-auto max-w-full object-contain",
        "border border-line shadow-[0_1px_12px_rgba(41,37,31,0.08)]",
        className,
      )}
    />
  );
}
