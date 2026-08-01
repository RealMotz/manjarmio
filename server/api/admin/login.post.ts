import { timingSafeEqual } from "node:crypto";

function safeCompare(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    // still run a compare so failure timing doesn't leak the length
    timingSafeEqual(bufA, bufA);
    return false;
  }

  return timingSafeEqual(bufA, bufB);
}

export default defineEventHandler(async (event) => {
  const { password } = await readBody<{ password?: string }>(event);
  const config = useRuntimeConfig();

  if (
    !password ||
    typeof password !== "string" ||
    !safeCompare(password, config.adminPassword)
  ) {
    throw createError({ statusCode: 401, statusMessage: "Invalid password" });
  }

  const session = await getAdminSession(event);
  await session.update({ isAdmin: true });

  return { authenticated: true };
});
