<?php

namespace App\Controllers;

use App\Routing\Handlers\RouteHandler;

class NotFoundController implements RouteHandler
{
    public function __construct(private \Twig\Environment $twig) {}

    public function handle(string $path): void
    {
        http_response_code(404);
        $this->twig->display('@pages-internal/404.twig');
    }
}
