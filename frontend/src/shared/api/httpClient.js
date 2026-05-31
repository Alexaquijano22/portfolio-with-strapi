export class ApiError extends Error {
  constructor(message, type, status) {
    super(message);
    this.name   = 'ApiError';
    this.type   = type;   // 'network' | 'client' | 'server'
    this.status = status; // HTTP status code, or 0 for network failures
  }
}

export async function httpClient(path, options) {
  const url = `${import.meta.env.VITE_API_URL}${path}`;

  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new ApiError('Network failure', 'network', 0);
  }

  if (!response.ok) {
    const type = response.status >= 500 ? 'server' : 'client';
    throw new ApiError(response.statusText, type, response.status);
  }

  return response.json();
}
