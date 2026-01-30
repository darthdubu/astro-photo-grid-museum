import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  if (url.pathname.startsWith("/admin")) {
    const session = cookies.get("admin_session");
    if (!session || session.value !== "true") {
      return redirect("/login");
    }
  }

  return next();
});
