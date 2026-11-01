"use client";

import { useAuth } from "@qsweber/auth-kit";
import { ApiClient } from "./client";

/**
 * The public-facing user returned by the API (GET/PUT /user).
 */
export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
}

/**
 * Hook returning the signed-in user's id (their Cognito `sub`), which is the id
 * the API keys user records by. Null when signed out.
 */
export const useUserId = (): string | null => {
  const { session } = useAuth();
  return session?.tokens?.idToken?.payload.sub ?? null;
};

const userEndpoint = (userId: string) =>
  `/user?id=${encodeURIComponent(userId)}`;

export const getUser = (apiClient: ApiClient, userId: string) =>
  apiClient.get<UserProfile>(userEndpoint(userId));

export const updateUser = (
  apiClient: ApiClient,
  userId: string,
  update: { display_name: string },
) => apiClient.put<UserProfile>(userEndpoint(userId), update);
