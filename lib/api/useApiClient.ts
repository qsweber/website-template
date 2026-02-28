"use client";

import { useMemo } from "react";
import { useAuth } from "../auth/useAuth";
import { ApiClient } from "./client";

/**
 * Hook to get an authenticated API client
 */
export const useApiClient = () => {
  const { getIdToken } = useAuth();

  const apiClient = useMemo(() => {
    return new ApiClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
      getIdToken,
    });
  }, [getIdToken]);

  return apiClient;
};
