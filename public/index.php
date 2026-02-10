<?php

use App\Router;
use App\Controllers\PageController;
use App\Controllers\ApiViewController;
use App\Controllers\ArticleController;
use App\Controllers\NotFoundController;
use App\Repositories\ArticleRepository;

$devMode = !empty(getenv('DEVELOPMENT'));
$rootPath = '../';

/** @var \Twig\Environment $twig */
$twig = require __DIR__ . '/../env.php';

$articleRepo = new ArticleRepository();

$router = new Router($_SERVER['REQUEST_URI']);
$router->addPrefixHandler('/articles', new ArticleController($twig, $articleRepo));
$router->addPrefixHandler('/api/views/', new ApiViewController);
$router->addFallbackHandler(new PageController($twig));
$router->addFallbackHandler(new NotFoundController($twig));

$router->run();
