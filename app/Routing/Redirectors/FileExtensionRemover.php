<?php

namespace App\Routing\Redirectors;

use App\Routing\Redirector;

class FileExtensionRemover implements Redirector
{
    /** @var string[] */
    private array $extensions = ['twig', 'html', 'php'];

    public function redirect(string $url): ?string
    {
        foreach ($this->extensions as $ext) {
            if (preg_match("/\\." . preg_quote($ext, '/') . '$/', $url)) {
                return preg_replace("/\\." . preg_quote($ext, '/') . '$/', '', $url);
            }
        }
        return null;
    }
}
