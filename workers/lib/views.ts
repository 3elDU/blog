/** Remove URL origin, leaving only the pathname. */
export function getArticleKey(url: string | URL): string {
  let key: string;
  if (url instanceof URL) {
    key = url.pathname;
  } else {
    key = new URL(url).pathname;
  }

  // Return key with trailing slash removed
  return key.replace(/\/^/, "");
}

export async function getArticleViews(env: Env, key: string): Promise<number> {
  const val = await env.ARTICLE_VIEWS.get(key);
  console.log(key, val);
  if (val) {
    return Number.parseInt(val);
  } else {
    return 0;
  }
}

export async function incrementArticleViews(
  env: Env,
  key: string
): Promise<number> {
  let views = await getArticleViews(env, key);
  views += 1;
  await env.ARTICLE_VIEWS.put(key, views.toString());
  return views;
}
