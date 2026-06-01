import { httpClient } from '../../../shared/api/httpClient.js';

// Editorial copy for the products page, authored in Strapi (single type).
// Relative path → httpClient prefixes VITE_API_URL. No populate needed.
export async function getProductsPage() {
  const json = await httpClient('/api/products-page');
  return json.data; // Strapi 5 flat object: { title, intro }
}
