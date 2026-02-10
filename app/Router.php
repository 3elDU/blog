<?php

namespace App;

use Throwable;
use App\Exceptions\HttpException;
use App\Exceptions\NotFoundException;
use App\Exceptions\InternalServerError;

interface RouteHandler
{
    public function handle(string $path): void;
}

interface ExceptionHandler
{
    public function handle(Throwable $e): void;
}

class Router
{
    /** @var array<string, RouteHandler> */
    private array $prefixes = [];

    /**
     * Handlers to be called when (in order) when no route was matched.
     * Iteration stops at the first one that doesn't throw.
     *
     * @var array<RouteHandler>
     */
    public array $fallbackHandlers = [];

    /**
     * Handles to be called for specific exception types
     *
     * @var array<string, RouteHandler>
     */
    public array $exceptionHandlers = [];

    public function __construct(private string $requestUrl) {}

    /**
     * Assigns a fallback handler that will be called when no prefix handlers
     * matched
     */
    public function addFallbackHandler(RouteHandler $handler)
    {
        $this->fallbackHandlers[] = $handler;
    }

    /**
     * Assignes a handler for a specific prefix
     */
    public function addPrefixHandler(string $prefix, RouteHandler $handler)
    {
        $this->prefixes[$prefix] = $handler;
    }

    public function addExceptionHandler(string $exceptionType, RouteHandler $handler)
    {
        $this->exceptionHandlers[$exceptionType] = $handler;
    }


    private function handleException(Throwable $e)
    {
        $exception = $e;

        if (array_key_exists($e::class, $this->exceptionHandlers)) {
            try {
                $this->exceptionHandlers[$e::class]->handle($e);
                exit(0);
            } catch (Throwable $e) {
                $exception = $e;
            }
        }

        // at this point either no handler exists, or it also crashed
        new InternalServerError('exception encountered and either no handler was found or it crashed too', $e)->send();
    }

    /**
     * @return bool Whether execution should be continued by trying next
     * handler in chain
     */
    private function tryCallHandler(RouteHandler $handler): bool
    {
        try {
            $handler->handle($this->requestUrl);
            return false;
        } catch (NotFoundException $e) {
            return true;
        } catch (HttpException $e) {
            $e->send();
            return false;
        } catch (Throwable $e) {
            $this->handleException($e);
            return false;
        }
    }

    public function run()
    {
        foreach ($this->prefixes as $prefix => $handler) {
            if (str_starts_with($this->requestUrl, $prefix)) {
                if (!$this->tryCallHandler($handler)) {
                    return;
                }
            }
        }

        // Attempt to call fallback handlers
        foreach ($this->fallbackHandlers as $handler) {
            if (!$this->tryCallHandler($handler)) {
                return;
            }
        }

        // This is technically our error when there's no handler at all.
        // A 404 handler must be explicitly added to the list of fallback handlers
        new InternalServerError('no handler found for route')->send();
    }
}
