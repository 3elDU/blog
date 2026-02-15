<?php

namespace App\Routing\Handlers;

interface RouteHandler
{
    public function handle(string $path): void;
}
