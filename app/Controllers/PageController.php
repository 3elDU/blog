<?php

namespace App\Controllers;

use App\RouteHandler;
use Twig\Error\LoaderError;
use App\Exceptions\NotFoundException;

/**
 * Tries to load template for the page from url
 */
class PageController implements RouteHandler
{
    public function __construct(private \Twig\Environment $twig) {}

    public function handle(string $path): void
    {
        // Replace trailing slash
        $path = preg_replace('/\/$/', '/index', $path);
        // Replace extension
        $path = preg_replace('/\..*$/', '', $path);

        try {
            $template = $this->twig->load('@pages' . $path . '.twig');
        } catch (LoaderError) {
            throw new NotFoundException();
        }

        $template->display([]);
    }
}
