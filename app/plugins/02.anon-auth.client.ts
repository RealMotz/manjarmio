// plugins/anon-auth.client.ts

import { user } from "~/composables/useUser";

export default defineNuxtPlugin(async () => {
  const { $supabase } = useNuxtApp();

  const {
    data: { session },
  } = await $supabase.auth.getSession();

  if (session) {
    user.value = session.user;
  } else {
    const { data, error } = await $supabase.auth.signInAnonymously();
    if (error) {
      throw new Error("Anonymous sign-in failed:", error);
    } else {
      user.value = data.user;
    }
  }

  // keep it in sync going forward (refresh, upgrade to real account, etc.)
  $supabase.auth.onAuthStateChange((_event, newSession) => {
    user.value = newSession?.user ?? null;
  });
});
