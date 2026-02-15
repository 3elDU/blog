<?php

namespace App\Controllers;

use App\Models\Article;
use App\Helpers\UrlHelper;
use App\Exceptions\NotFoundException;
use App\Routing\Handlers\RouteHandler;
use App\Repositories\ArticleRepository;
use League\CommonMark\CommonMarkConverter;

/**
 * Shows an article matching the slug from URL
 */
class ArticleController implements RouteHandler
{
    public function __construct(
        private \Twig\Environment $twig,
        private ArticleRepository $repo
    ) {}

    /**
     * Renders markdown into an HTML string
     */
    private function renderMarkdown(string $markdown): string
    {
        $converter = new CommonMarkConverter();

        return (string) $converter->convert($markdown);
    }

    public function handle(string $path): void
    {
        if ($path === '/articles') {
            $this->articleList();
            return;
        }

        $slug = UrlHelper::extractSlug($path, '/articles/');
        if (is_null($slug)) throw new NotFoundException();

        $articleBaseDir = UrlHelper::getArticleBasePath($slug);
        if (!$articleBaseDir) throw new NotFoundException();

        $model = file_get_contents($articleBaseDir . '/metadata.json')
        |> json_decode(...)
        |> (fn($obj) => Article::fromMetadata($slug, $obj));

        $markdown = $this->renderMarkdown($model->getContent());

        $this->twig->display('@pages-internal/article.twig', [
            'article' => $model,
            'renderedMarkdown' => $markdown,
        ]);
    }

    private function articleList()
    {
        $this->twig->display('@pages-internal/article-list.twig', [
            'articles' => $this->repo->getArticles()
        ]);
    }
}
