export default defineEventHandler(async (event) => {
  const session = await getAdminSession(event);

  return { authenticated: Boolean(session.data.isAdmin) };
});
