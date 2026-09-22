import { Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
