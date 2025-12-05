import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  updateProfileClient,
  type ProfileUpdate,
} from "@/lib/client/profile.client";

/**
 * React Query hook to update user profile
 * Automatically gets userId from current session
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      return updateProfileClient(user.id, updates);
    },
    onSuccess: (data) => {
      // Invalidate and refetch profile queries
      queryClient.invalidateQueries({ queryKey: ["profile", data.id] });
      // Update cache directly for instant UI update
      queryClient.setQueryData(["profile", data.id], data);
    },
  });
}
