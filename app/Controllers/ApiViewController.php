<?php

namespace App\Controllers;

use App\Helpers\UrlHelper;
use App\Routing\Handlers\RouteHandler;

class ApiViewController implements RouteHandler
{
    private function getViews(string $slug)
    {
        return intval(file_get_contents(
            UrlHelper::getArticleBasePath($slug) . '/views'
        ));
    }

    private function setViews(string $slug, int $views)
    {
        file_put_contents(
            UrlHelper::getArticleBasePath($slug) . '/views',
            strval($views)
        );
    }

    public function handle(string $path): void
    {
        $slug = UrlHelper::extractSlug($path, '/api/views/');

        $views = $this->getViews($slug);

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
