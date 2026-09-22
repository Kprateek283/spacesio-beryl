"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images }: { images: string[] }) {
  const [activeImage, setActiveImage] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative w-full aspect-[4/5] bg-muted overflow-hidden">
        <Image
          src={images[activeImage]}
          alt="Product view"
          fill
          priority={activeImage === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              aria-label={`View image ${idx + 1}`}
              onClick={() => setActiveImage(idx)}
              className={cn(
                "relative w-full aspect-square bg-muted overflow-hidden transition-all duration-300",
                activeImage === idx ? "ring-2 ring-foreground ring-offset-2" : "opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="25vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
