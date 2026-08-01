export default defineNuxtRouteMiddleware(async (to) => {
  const requestFetch = useRequestFetch();
  let authenticated: boolean;
  try {
    ({ authenticated } = await requestFetch<{ authenticated: boolean }>(
      "/api/admin/session",
    ));
  } catch {
    authenticated = false;
  }

  if (to.path === "/admin/login") {
    if (authenticated) return navigateTo("/admin");
    return;
  }

  if (!authenticated) {
    return navigateTo("/admin/login");
  }
});
