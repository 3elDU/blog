import { getArticleViews, incrementArticleViews } from "./views";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

const hono = new Hono<{ Bindings: Env }>();

hono.on(["get", "post"], "/api/views/:article{[a-z-]+}", async (c) => {
  const key = c.req.param("article");
  const seen = getCookie(c, "seen");

  if (c.req.method == "POST") {
    if (seen) {
      c.status(400);
      return c.text("You've already seen this article");
    } else {
      const views = await incrementArticleViews(c.env, key);

      setCookie(c, "seen", "true", {
        secure: true,
        path: `/articles/${c.req.param("article")}`,
      });

      return c.text(views.toString());
    }
  } else {
    const views = await getArticleViews(c.env, key);
    return c.text(views.toString());
  }
});

export default hono satisfies ExportedHandler<Env>;
