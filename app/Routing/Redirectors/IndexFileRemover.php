<?php

namespace App\Routing\Redirectors;

use App\Routing\Redirector;

class IndexFileRemover implements Redirector
{
    /**
     * Redirects paths ending in /index.{filename} to / (extension doesn't matter)
     *
     * Examples:
     * - /articles/example-article/index.twig -> /articles/example-article
     * - /path/index.twig -> /path
     * - /path/index.html -> /path
     * - /path/index -> /path
     * - /index -> /
     */
    public function redirect(string $url): ?string
    {
        return preg_replace(
            '/index(\.\S+)?$/',
            '',
            $url
        );
    }
}
