"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Project } from "@/data/projects";
import { ProjectHeroImage } from "./ProjectHeroImage";

function ProjectFullBleedItem({ project, index }: { project: Project; index: number }) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <Link
      ref={itemRef}
      href={`/projects/${project.slug}`}
      scroll={false}
      className="group relative block h-screen w-full overflow-hidden bg-black"
    >
      {/* Parallax image, fades/scales in on scroll entrance */}
      <motion.div
        style={{ y: imageY }}
        initial={{ opacity: 0, scale: 1.15 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 -top-[10%] -bottom-[10%]"
      >
        <ProjectHeroImage
          slug={project.slug}
          src={project.heroImage}
          alt={project.title}
          priority={index === 0}
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
      </motion.div>

      {/* Darken on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-700 ease-out" />

      {/* Always-visible index */}
      <div className="absolute top-8 left-6 md:left-12 text-white/60 text-xs tracking-widest uppercase">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Hover-revealed text, masked slide-up reveal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <div className="overflow-hidden">
          <p
            className="text-white/70 text-xs md:text-sm tracking-[0.3em] uppercase mb-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out"
          >
            {project.location} &middot; {project.category}
          </p>
        </div>
        <div className="overflow-hidden">
          <h2
            className="text-white font-serif text-[clamp(2.5rem,7vw,6.5rem)] uppercase leading-none translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-[80ms]"
          >
            {project.title}
          </h2>
        </div>
        <div className="overflow-hidden mt-6">
          <span
            className="inline-block text-white/80 text-xs font-medium tracking-widest uppercase border-b border-white/50 pb-1 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-[160ms]"
          >
            View Project →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProjectFullBleedList({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="w-full">
      {projects.map((project, index) => (
        <ProjectFullBleedItem key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
