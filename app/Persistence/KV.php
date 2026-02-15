<?php

namespace App\Persistence;

/**
 * A key-value store.
 *
 * Allows associating string keys with string values and retrieving them later.
 * This persists between requests.
 */
interface KV
{
    /**
     * @param string $key
     * @return null|string the associated value, or null in case the key doesn't exist
     */
    public function get(string $key): ?string;

    /**
     * @param string $key
     * @param string $value
     * @return bool whether the value was set correctly
     */
    public function set(string $key, string $value): bool;
}
