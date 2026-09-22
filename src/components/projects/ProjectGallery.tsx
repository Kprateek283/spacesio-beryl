import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProjectGallery({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {images.map((img, idx) => (
        <div 
          key={idx} 
          className={cn(
            "relative bg-muted overflow-hidden",
            idx % 3 === 0 ? "col-span-1 md:col-span-2 aspect-[21/9]" : "col-span-1 aspect-[4/5]"
          )}
        >
          <Image
            src={img}
            alt={`Project view ${idx + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
