<?php

namespace App\Models;

use stdClass;
use Carbon\Carbon;
use App\Helpers\UrlHelper;

class Article
{
    public function __construct(
        public string $title,
        public string $slug,
        public Carbon $publishDate,
        /** @var array<int, string> */
        public array $tags
    ) {}

    static function fromMetadata(string $slug, stdClass $obj)
    {
        return new self(
            $obj->title,
            $slug,
            Carbon::parse($obj->date),
            $obj->tags
        );
    }

    public function getUrl(): string
    {
        return '/articles/' . $this->slug;
    }

    public function getContent(): string
    {
        return file_get_contents(
            UrlHelper::getArticleBasePath($this->slug) . '/index.md'
        );
    }
}
