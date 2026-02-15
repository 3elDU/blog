<?php

namespace App\Routing\Handlers;

use Throwable;

interface ExceptionHandler
{
    public function handle(Throwable $e): void;
}
