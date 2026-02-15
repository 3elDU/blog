<?php

use App\Routing\Router;
use App\Controllers\PageController;
use App\Controllers\ApiViewController;
use App\Controllers\ArticleController;
use App\Controllers\NotFoundController;
use App\Repositories\ArticleRepository;
use App\Routing\Redirectors\IndexFileRemover;
use App\Routing\Redirectors\FileExtensionRemover;
use App\Routing\Redirectors\TrailingSlashRemover;
use App\Persistence\Backends\FilesystemKeyValueStore;

$devMode = !empty(getenv('DEVELOPMENT'));
$rootPath = '../';

/** @var \Twig\Environment $twig */
$twig = require __DIR__ . '/../env.php';

$articleRepo = new ArticleRepository();
$kv = new FilesystemKeyValueStore(getenv('KV_ROOT'));

$router = new Router($_SERVER['REQUEST_URI']);

$router->addRedirector(new TrailingSlashRemover);
$router->addRedirector(new FileExtensionRemover);
$router->addRedirector(new IndexFileRemover);

$router->addPrefixHandler('/articles', new ArticleController($twig, $articleRepo));
$router->addPrefixHandler('/api/views/', new ApiViewController($kv));

$router->addFallbackHandler(new PageController($twig));
$router->addFallbackHandler(new NotFoundController($twig));

$router->run();
