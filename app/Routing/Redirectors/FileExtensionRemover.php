<?php

namespace App\Routing\Redirectors;

use App\Routing\Redirector;

class FileExtensionRemover implements Redirector
{
    public function redirect(string $url): ?string
    {
        return preg_replace('/\..*$/', '', $url);
    }
}
