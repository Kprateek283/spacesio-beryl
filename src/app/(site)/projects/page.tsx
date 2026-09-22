import { getProjects } from "@/lib/api/projects";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Spacesio Beryl",
  description: "Spaces shaped by materials, precision and purpose.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-16 md:mb-24 text-center md:text-left">
        <div className="text-xs tracking-widest uppercase text-muted-foreground font-medium mb-6">
          Our Work
        </div>
        <h1 className="font-serif text-[clamp(3rem,6vw,6rem)] leading-none tracking-tight uppercase">
          Spaces We&apos;ve Transformed
        </h1>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
