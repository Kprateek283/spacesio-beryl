import { CSSProperties, FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedShinyTextProps {
  children: ReactNode;
  className?: string;
  shimmerWidth?: number;
  isDark?: boolean;
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
  isDark = true,
}) => {
  return (
    <span
      style={
        {
          "--shimmer-width": `${shimmerWidth}px`,
        } as CSSProperties
      }
      className={cn(
        "inline-block",
        isDark ? "text-white/50" : "text-black/50",

        // Shimmer effect
        "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shimmer gradient
        isDark 
          ? "bg-gradient-to-r from-transparent via-white via-50% to-transparent"
          : "bg-gradient-to-r from-transparent via-black via-50% to-transparent",

        className,
      )}
    >
      {children}
    </span>
  );
};

export default AnimatedShinyText;
