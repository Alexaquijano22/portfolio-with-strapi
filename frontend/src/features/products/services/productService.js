import { httpClient } from '../../../shared/api/httpClient.js';

// Third-party API base URL (not the app's own backend). Kept in the service layer,
// out of components. httpClient passes absolute URLs through as-is, so the same
// typed ApiError (4xx/5xx/network) covers this external call.
const PRODUCTS_API = 'https://fakestoreapi.com/products';

export async function getProducts() {
  const data = await httpClient(PRODUCTS_API);
  // fakestoreapi returns a bare array (no Strapi-style envelope).
  return Array.isArray(data) ? data : [];
}
