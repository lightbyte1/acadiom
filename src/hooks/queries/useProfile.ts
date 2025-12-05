import { useQuery } from "@tanstack/react-query";
import { getProfileClient } from "@/lib/client/profile.client";
import { UserProfile } from "@/types/index.t";

/**
 * React Query hook to fetch user profile
 */
export function useProfile(
  userId: string | undefined,
  initialData?: UserProfile | null
) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => {
      if (!userId) return null;
      return getProfileClient(userId);
    },
    enabled: !!userId,
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
