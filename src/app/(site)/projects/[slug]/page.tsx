import { getProjectBySlug, getAdjacentProjects } from "@/lib/api/projects";
import { notFound } from "next/navigation";
import { ProjectDetailContent } from "@/components/projects/ProjectDetailContent";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  return {
    title: project ? `${project.title} | Spacesio Beryl` : "Project Not Found",
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const { prev, next } = await getAdjacentProjects(params.slug);

  return <ProjectDetailContent project={project} prev={prev} next={next} variant="page" />;
}
