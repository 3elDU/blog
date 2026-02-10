<?php

namespace App\Exceptions;

use Throwable;

class InternalServerError extends HttpException
{
    public function __construct(string $message = 'Internal Server Error', ?Throwable $previous = null)
    {
        parent::__construct(500, $message, $previous);
    }
}
