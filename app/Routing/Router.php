<?php

namespace App\Routing;

use Throwable;
use App\Exceptions\HttpException;
use App\Exceptions\NotFoundException;
use App\Routing\Handlers\RouteHandler;
use App\Exceptions\InternalServerError;
use App\Routing\Handlers\ExceptionHandler;

/**
 * Chooses the appropriate handler based on the provided request url.
 * Trailing slashes are removed automatically.
 */
class Router
{
    /**
     * Handlers to be called when the url starts with a prefix
     *
     * @var array<string, RouteHandler> associative array with the prefix as a
     * key, and handler as the value
     */
    private array $prefixes = [];

    /**
     * Handlers to be called when (in order) when no route was matched.
     * Iteration stops at the first one that doesn't throw.
     *
     * @var RouteHandler[]
     */
    public array $fallbackHandlers = [];

    /**
     * Handles to be called for specific exception types
     *
     * @var ExceptionHandler[]
     */
    public array $exceptionHandlers = [];

    /**
     * A list of url transformers to be called in sequence.
     * If the resulting URL is different from the original one, client is
     * given a permanent redirect.
     *
     * @var Redirector[]
     */
    public array $urlTransformers = [];

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
     * Assigns a handler for a specific prefix
     */
    public function addPrefixHandler(string $prefix, RouteHandler $handler)
    {
        $this->prefixes[$prefix] = $handler;
    }

    /**
     * Adds a url transformer to handle redirects
     */
    public function addRedirector(Redirector $redirector)
    {
        $this->urlTransformers[] = $redirector;
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
        // First, handle redirects
        $targetUrl = $this->requestUrl;
        foreach ($this->urlTransformers as $redirector) {
            $url = $redirector->redirect($targetUrl);
            if (!is_null($url)) {
                $targetUrl = $url;
            }
        }

        if ($this->requestUrl != $targetUrl) {
            header("Location: $targetUrl", response_code: 301);
            return;
        }

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
