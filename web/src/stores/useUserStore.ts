"use client";

import { getAuthSession } from "@/lib/auth-session";
import type { AuthUser } from "@/services/auth";

export function useAuthUser(): { user: AuthUser | null; isAuthenticated: boolean } {
  const user = getAuthSession();
  return { user, isAuthenticated: user !== null };
}
