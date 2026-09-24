import { getProjectBySlug, getAdjacentProjects } from "@/lib/api/projects";
import { notFound } from "next/navigation";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { ProjectDetailContent } from "@/components/projects/ProjectDetailContent";

export default async function ProjectModalRoute({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const { prev, next } = await getAdjacentProjects(params.slug);

  return (
    <ProjectModal>
      <ProjectDetailContent project={project} prev={prev} next={next} variant="modal" />
    </ProjectModal>
  );
}
