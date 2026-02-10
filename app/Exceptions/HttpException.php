<?php

namespace App\Exceptions;

use Exception;
use Throwable;

/**
 * An exception that corresponds to an HTTP code
 */
abstract class HttpException extends Exception
{
    protected function __construct(int $code, string $message, ?Throwable $previous = null)
    {
        parent::__construct("$message", $code, $previous);
    }

    /**
     * Sends the http response code with details to the client
     */
    public function send()
    {
        $previousError = '';
        if ($this->getPrevious() !== null) {
            $message = $this->getPrevious()->getMessage();
            $previousError = "<p>Previous exception: $message</p>";
        }

        http_response_code($this->code);
        echo <<<EOF
<!doctype html>
<html>
    <head>
        <title>server error</title>
        <style>
            :root {
                color-scheme: light dark;
                font-family: monospace;
            }

            *, *::before, *::after {
                margin: 0;
            }

            html, body {
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            body {
                display: flex;
                flex-direction: column;
                gap: 8px;
                justify-content: center;
                align-items: center;
            }
        </style>
    </head>
    <body>
        <h1>HTTP Error {$this->code}</h1>
        <p>{$this->message}</p>
        $previousError
    </body>
</html>
EOF;
    }
}
