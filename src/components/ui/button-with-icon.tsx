import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";

interface ButtonWithIconProps {
  href: string;
  text?: string;
  className?: string;
}

export default function ButtonWithIcon({
  href,
  text = "Contact",
  className,
}: ButtonWithIconProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center justify-center overflow-hidden rounded-full border-2 px-4 py-2 md:px-4  transition-all duration-300",
        className
      )}
    >
      <span className="relative z-10 flex items-center transition-transform duration-300 group-hover:-translate-x-2">
        {text}
      </span>
      <ArrowRight className="absolute right-3 md:right-4 w-4 h-4 opacity-0 transition-all duration-300 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  );
}
