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
        mkdir($this->root, recursive: true);
    }

    private function keyToPath(string $key): string
    {
        return $this->root . '/' . urlencode($key);
    }

    public function get(string $key): ?string
    {
        $contents = file_get_contents($this->keyToPath($key));
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
