import Image from "next/image";
import Link from "next/link";
import { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, index }: { project: Project, index: number }) {
  const isEven = index % 2 === 0;

  return (
    <Link 
      href={`/projects/${project.slug}`} 
      className={cn(
        "group flex flex-col md:flex-row gap-8 md:gap-16 items-center w-full mb-32 last:mb-0",
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      <div className="w-full md:w-1/2 flex flex-col gap-6 order-2 md:order-none">
        <div className="text-sm tracking-widest uppercase text-muted-foreground border-b border-border pb-4 font-serif">
          {String(index + 1).padStart(2, '0')}
        </div>
        
        <div>
          <h2 className="font-serif text-[clamp(2rem,4vw,4rem)] leading-none uppercase mb-2 group-hover:text-accent transition-colors duration-300">
            {project.title}
          </h2>
          <p className="text-sm tracking-widest uppercase text-muted-foreground">
            {project.location}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          {project.materials.map(mat => (
            <span key={mat} className="text-foreground/80 font-light text-sm tracking-wide">
              {mat.split('-').join(' ')}
            </span>
          ))}
        </div>

        <div className="mt-8 text-xs font-medium tracking-widest uppercase flex items-center gap-4">
          <span className="border-b border-transparent group-hover:border-foreground transition-colors duration-300">
            View Project
          </span>
          <span className="transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            →
          </span>
        </div>
      </div>

      <div className="w-full md:w-1/2 relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-muted order-1 md:order-none">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transform transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </Link>
  );
}
