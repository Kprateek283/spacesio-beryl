"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function ProjectHeroImage({
  slug,
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  slug: string;
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <motion.div
      layoutId={`project-image-${slug}`}
      className={className}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </motion.div>
  );
}
