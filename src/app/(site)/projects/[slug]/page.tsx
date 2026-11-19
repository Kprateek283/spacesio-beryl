import { getProjectBySlug, getAdjacentProjects } from "@/lib/api/projects";
import { notFound } from "next/navigation";
import { ProjectDetailContent } from "@/components/projects/ProjectDetailContent";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return { title: "Project Not Found", robots: { index: false } };
  }
  return {
    title: project.title,
    alternates: { canonical: `/projects/${params.slug}` },
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
