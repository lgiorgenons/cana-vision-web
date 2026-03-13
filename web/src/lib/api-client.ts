const rawBase = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "/api";
const API_BASE_URL = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type ApiFetchOptions = RequestInit & {
  skipJson?: boolean;
  _isRetry?: boolean;
};

function isJsonLike(body: BodyInit | null | undefined) {
  if (!body) return false;
  if (body instanceof FormData || body instanceof Blob) return false;
  return true;
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const url = `${API_BASE_URL}/auth/refresh-token`;
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function apiFetch<TResponse>(path: string, options: ApiFetchOptions = {}): Promise<TResponse> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body && isJsonLike(options.body)) {
    headers.set("Content-Type", "application/json");
  }

  const { skipJson, _isRetry, ...fetchOptions } = options;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (skipJson) {
    if (!response.ok) {
      throw new Error(`Erro ao chamar API (${response.status})`);
    }
    return undefined as TResponse;
  }

  const text = await response.text();
  const parsed = text ? safeParseJson(text) : null;

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined" && !_isRetry) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        return apiFetch<TResponse>(path, { ...options, _isRetry: true });
      }
      window.location.href = "/login";
    }
    const message = parsed?.message || parsed?.detail || `Erro ao chamar API (${response.status})`;
    throw new ApiError(message, response.status, parsed);
  }

  return parsed as TResponse;
}

function safeParseJson(payload: string) {
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export { API_BASE_URL };
