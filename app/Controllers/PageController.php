<?php

namespace App\Controllers;

use Twig\Error\LoaderError;
use App\Exceptions\NotFoundException;
use App\Routing\Handlers\RouteHandler;

/**
 * Tries to load template for the page from url
 */
class PageController implements RouteHandler
{
    public function __construct(private \Twig\Environment $twig) {}

    public function handle(string $path): void
    {
        $tryFiles = [
            // no slash after @pages because the path starts with a slash
            "@pages$path/index.twig",
            "@pages$path.twig",
        ];

        foreach ($tryFiles as $templatePath) {
            try {
                $template = $this->twig->load($templatePath);
                break;
            } catch (LoaderError) {
                continue;
            }
        }

        if (empty($template)) {
            throw new NotFoundException();
        }

        $template->display([]);
    }
}
