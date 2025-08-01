export async function getArticleViews(env: Env, key: string): Promise<number> {
  const val = await env.ARTICLE_VIEWS.get(key);
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
