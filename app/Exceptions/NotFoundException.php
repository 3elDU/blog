<?php

namespace App\Exceptions;

class NotFoundException extends HttpException
{
    public function __construct(string $message = 'Not found')
    {
        return parent::__construct(404, $message);
    }
}
