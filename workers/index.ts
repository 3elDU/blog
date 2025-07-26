import { parse as parseCookies, serialize as serializeCookie } from "cookie";
import {
  getArticleKey,
  getArticleViews,
  incrementArticleViews,
} from "./lib/views";

function renderPage(page: string, variables: Record<string, string>): string {
  for (const [name, content] of Object.entries(variables)) {
    page = page.replaceAll(`{${name}}`, content);
  }
  return page;
}

async function incrementView(request: Request, env: Env): Promise<Response> {
  const articleUrl = getArticleKey(request.url);
  const { seen } = parseCookies(request.headers.get("Cookie") ?? "");

  // If the user has already viewed the article, do not increment the view count
  if (seen) {
    return new Response(null, { status: 400 });
  }

  const views = await incrementArticleViews(env, articleUrl);

  // Set the cookie on the web browser to prevent multiple views of the same page
  const cookie = serializeCookie("seen", "true", {
    secure: true,
    path: articleUrl,
  });

  if (request.headers.has("X-Requested-With")) {
    return new Response(views.toString(), {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } else {
    // Support browsers without JavaScript
    return new Response(null, {
      status: 302,
      headers: {
        Location: articleUrl,
        "Set-Cookie": cookie,
      },
    });
  }
}

export default {
  async fetch(request, env) {
    if (
      request.url.match(/\/articles\/[a-z\-]+$/) &&
      request.method === "POST"
    ) {
      return incrementView(request, env);
    }

    const response = await env.ASSETS.fetch(request);
    if (
      response.status !== 200 ||
      !response.headers.get("Content-Type")?.includes("text/html")
    ) {
      // Return back redirects and 404 errors
      return response;
    }
    const page = await response.text();

    const { seen } = parseCookies(request.headers.get("Cookie") ?? "");

    const variables = {
      viewCount: (
        await getArticleViews(env, getArticleKey(request.url))
      ).toString(),
      // Disable the "I've read this" button when "seen" cookie is set
      viewButtonExtraAttrs: seen ? 'disabled=""' : "",
    };

    return new Response(renderPage(page, variables), response);
  },
} satisfies ExportedHandler<Env>;
