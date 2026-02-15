<?php

namespace App\Controllers;

use App\Persistence\KV;
use App\Helpers\UrlHelper;
use App\Routing\Handlers\RouteHandler;

class ApiViewController implements RouteHandler
{
    public function __construct(private KV $kv) {}

    private function keyForSlug(string $slug): string
    {
        return "article-views-$slug";
    }

    private function getViews(string $slug)
    {
        return intval($this->kv->get($this->keyForSlug($slug)));
    }

    private function setViews(string $slug, int $views)
    {
        $this->kv->set(
            $this->keyForSlug($slug),
            strval($views)
        );
    }

    public function handle(string $path): void
    {
        $slug = UrlHelper::extractSlug($path, '/api/views/');

        $views = $this->getViews($slug);

        if (!empty($_COOKIE['seen'])) {
            echo $views;
            return;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $this->setViews($slug, ++$views);

            setcookie(
                'seen',
                'true',
                path: '/articles/' . $slug,
                secure: true
            );

            echo $views;
        } else {
            echo $views;
        }
    }
}
