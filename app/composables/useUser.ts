// composables/useUser.ts
import type { User } from "@supabase/supabase-js";

export const user = ref<User | null>(null);

export default function useUser() {
  return { user };
}
