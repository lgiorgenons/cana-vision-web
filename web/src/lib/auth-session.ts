import type { AuthUser } from "@/services/auth";

const AUTH_STORAGE_KEY = "atmos-auth-user";
const SESSION_COOKIE = "atmos_session";

const safeWindow = typeof window !== "undefined" ? window : undefined;

function getStorage(persist: boolean) {
  if (!safeWindow) return undefined;
  return persist ? safeWindow.localStorage : safeWindow.sessionStorage;
}

export function saveAuthSession(user: AuthUser, persist = true) {
  const storage = getStorage(persist);
  if (!storage) return;
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

  const other = getStorage(!persist);
  other?.removeItem(AUTH_STORAGE_KEY);
}

export function getAuthSession(): AuthUser | null {
  if (!safeWindow) return null;
  const raw =
    safeWindow.localStorage.getItem(AUTH_STORAGE_KEY) ??
    safeWindow.sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    safeWindow.localStorage.removeItem(AUTH_STORAGE_KEY);
    safeWindow.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function clearAuthSession() {
  if (!safeWindow) return;
  safeWindow.localStorage.removeItem(AUTH_STORAGE_KEY);
  safeWindow.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function setSessionCookie(persist: boolean) {
  if (!safeWindow) return;
  const maxAge = persist ? 60 * 60 * 24 * 30 : undefined; // 30 days or session
  const expires = maxAge ? `; max-age=${maxAge}` : "";
  safeWindow.document.cookie = `${SESSION_COOKIE}=1; path=/${expires}; SameSite=Lax`;
}

export function clearSessionCookie() {
  if (!safeWindow) return;
  safeWindow.document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
