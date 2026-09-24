import { cache } from "react";
import { Project, mockProjects } from "@/data/projects";

export const getProjects = cache(async (): Promise<Project[]> => {
  return mockProjects;
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  return mockProjects.find(p => p.slug === slug) || null;
});

export async function getAdjacentProjects(currentSlug: string): Promise<{ prev: Project | null, next: Project | null }> {
  const allProjects = await getProjects();
  const index = allProjects.findIndex((p: Project) => p.slug === currentSlug);
  if (index === -1) return { prev: null, next: null };

  const prev = index > 0 ? allProjects[index - 1] : null;
  const next = index < allProjects.length - 1 ? allProjects[index + 1] : null;

  return { prev, next };
}
