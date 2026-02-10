<?php

namespace App\Repositories;

use App\Models\Article;
use App\Helpers\UrlHelper;

class ArticleRepository
{
    /**
     * @return array<Article>
     */
    public function getArticles(): array
    {
        $metadataFiles = glob('../articles/*/metadata.json');
        $models = [];

        foreach ($metadataFiles as $filename) {
            $slug = UrlHelper::extractSlug($filename, '../articles/', '/metadata.json');

            $models[] = file_get_contents($filename)
            |> json_decode(...)
            |> (fn($obj) => Article::fromMetadata($slug, $obj));
        }

        return $models;
    }
}
