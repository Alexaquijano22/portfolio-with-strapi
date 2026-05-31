import { httpClient } from '../../../shared/api/httpClient.js';

// Fetches the Projects collection and normalises each cover image URL.
// API order is preserved (no sorting). coverImage is nullable: when present its
// relative url is prefixed with VITE_API_URL; SVG covers have `formats: null`, so
// the base `url` field is always the one to use. liveUrl/repoUrl/techStack pass
// through untouched (any of them may be null).
export async function getProjects() {
  const json = await httpClient('/api/projects?populate=*');

  return json.data.map((project) => ({
    ...project,
    coverImage: project.coverImage
      ? { ...project.coverImage, url: `${import.meta.env.VITE_API_URL}${project.coverImage.url}` }
      : null,
  }));
}
