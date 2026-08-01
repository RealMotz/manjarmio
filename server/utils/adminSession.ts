import type { H3Event } from "h3";

type AdminSessionData = {
  isAdmin?: boolean;
};

export function getAdminSession(event: H3Event) {
  const config = useRuntimeConfig();

  return useSession<AdminSessionData>(event, {
    password: config.sessionPassword,
    name: "manjarmio-admin-session",
    cookie: { sameSite: "lax" },
  });
}

export async function requireAdminSession(event: H3Event) {
  const session = await getAdminSession(event);

  if (!session.data.isAdmin) {
    throw createError({ statusCode: 401, statusMessage: "Not authenticated" });
  }

  return session;
}
