<?php

namespace App\Routing;

interface Redirector
{
    /**
     * @param string $url the request url, transformed by previous redirectors
     * in the chain
     * @return string the url that user should be redirected to. if null is
     * returned, no redirection is necessary. It is valid for the same URL to
     * be returned - this will also cause no redirects.
     */
    public function redirect(string $url): ?string;
}
