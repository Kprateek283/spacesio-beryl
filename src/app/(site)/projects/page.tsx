import { getProjects } from "@/lib/api/projects";
import { ProjectFullBleedList } from "@/components/projects/ProjectFullBleedList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Spacesio Beryl",
  description: "Spaces shaped by materials, precision and purpose.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="bg-background mt-14 md:mt-16 -mb-12">
      <ProjectFullBleedList projects={projects} />
    </div>
  );
}
