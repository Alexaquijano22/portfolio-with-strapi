import { httpClient } from '../../../shared/api/httpClient.js';

// Fetches the Skills collection and normalises each item's icon URL.
// `icon` is nullable: when Strapi returns null we preserve null (no invented URL).
// When present, icon.url is relative and gets prefixed with VITE_API_URL. SVG icons
// have `formats: null`, so the base `url` field is always the one to use.
export async function getSkills() {
  const json = await httpClient('/api/skills?populate=*');

  return json.data.map((skill) => ({
    ...skill,
    icon: skill.icon
      ? { ...skill.icon, url: `${import.meta.env.VITE_API_URL}${skill.icon.url}` }
      : null,
  }));
}
