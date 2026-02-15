<?php

// Composer autoloader

require_once __DIR__ . '/vendor/autoload.php';

// Twig global environment

$rootDir = $rootPath ?? getcwd();

$loader = new Twig\Loader\FilesystemLoader(rootPath: $rootDir);
$loader->addPath('templates/layouts', 'layouts');
$loader->addPath('templates/components', 'components');
$loader->addPath('templates/pages', 'pages');
$loader->addPath('templates/pages-internal', 'pages-internal');

$twig = new Twig\Environment($loader, [
    'debug' => true,
    'cache' => getenv('TWIG_TEMPLATE_CACHE') ?: $rootPath . '/.cache',
    'strict_variables' => true
]);

$twig->addGlobal('page', [
    'url' => $_SERVER['REQUEST_URI'],
    'dev' => $devMode,
]);

return $twig;
