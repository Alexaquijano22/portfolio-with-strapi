import { httpClient } from '../../../shared/api/httpClient.js';

// Fetches the Profile single type and normalises the Strapi 5 flat response.
// The avatar URL arrives relative; it is prefixed with VITE_API_URL here so no
// component ever has to construct a URL. SVG avatars have `formats: null`, so the
// base `url` field is always the one to use.
export async function getProfile() {
  const json = await httpClient('/api/profile?populate=*');
  const data = json.data;

  if (data.avatar?.url) {
    data.avatar.url = `${import.meta.env.VITE_API_URL}${data.avatar.url}`;
  }

  return data;
}
