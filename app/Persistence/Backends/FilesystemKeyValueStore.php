<?php

namespace App\Persistence\Backends;

use App\Persistence\KV;

/**
 * A key-value store that stores each key in a file relative to the specified
 * root directory.
 */
class FilesystemKeyValueStore implements KV
{
    public function __construct(
        private string $root
    ) {
        if (!file_exists($this->root)) {
            mkdir($this->root, recursive: true);
        }
    }

    private function keyToPath(string $key): string
    {
        return $this->root . '/' . urlencode($key);
    }

    public function get(string $key): ?string
    {
        $path = $this->keyToPath($key);

        if (!file_exists($path)) return null;

        $contents = file_get_contents($path);
        if ($contents === false) {
            return null;
        }

        return $contents;
    }

    public function set(string $key, string $value): bool
    {
        $result = file_put_contents($this->keyToPath($key), $value);

        return $result === false ? false : true;
    }
}
