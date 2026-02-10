<?php

namespace App\Helpers;

class UrlHelper
{
    /**
     * Extracts a slug from the URL path.
     *
     * The slug allows lowercase alphanumeric characters and dashes.
     */
    static function extractSlug(string $path, string $prefix, string $suffix = ''): ?string
    {
        $prefixRegexSafe = preg_quote($prefix, '/');
        $suffixRegexSafe = preg_quote($suffix, '/');

        preg_match("/^$prefixRegexSafe([a-z1-9-]+)$suffixRegexSafe$/", $path, $matches);
        return $matches[1] ?? null;
    }

    /**
     * Returns the absolute path to article directory.
     * This assumes that the current directory is /public, relative to the
     * repository root
     *
     * @return ?string string or null if the path doesn't exist
     */
    static function getArticleBasePath(string $slug): ?string
    {
        $path = realpath('../articles/' . $slug);
        return $path === false ? null : $path;
    }
}
