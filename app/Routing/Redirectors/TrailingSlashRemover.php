<?php

namespace App\Routing\Redirectors;

use App\Routing\Redirector;

class TrailingSlashRemover implements Redirector
{
    /**
     * Detects if trailing slash is used in the url, and redirects the client
     * to url without the trailing slash.
     */
    public function redirect(string $url): ?string
    {
        if ($url === '/' || !str_ends_with($url, '/')) {
            return null;
        }

        return rtrim($url, '/');
    }
}
