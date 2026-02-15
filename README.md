# Blog

This is the source code of my blog website. It is written in PHP and uses [twig](https://twig.symfony.com) for templating. All articles are written in Markdown

# Tinkering

1. PHP 8.5, composer, and a semi-recent Node version with NPM should be on your system
1. `composer install`
2. `npm install`
3. `npm run dev`

# Architecture
I've decided to not use any of the available frameworks for PHP, same goes for all the frontend assets.

On frontend, CSS and TypeScript are transpiled and bundled with esbuild - take a look at [bundle.js](bundle.js)

# Directory structure

The PHP entry point is at [/public/index.php](public/index.php). It sets up all the templating, routing, repositories, controllers and such.

Look inside [/bundle.js](bundle.js) to see all CSS/JS entrypoints.

## Templates
Twig templates all live inside [/templates](templates) folder, also separated in components, layouts and pages.

## CSS
CSS lives in [/styles](styles). I use [CSS layers](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer) feature for separating styles for different parts of the website, and a semi-recent [& nesting selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Nesting_selector) to nest selectors inside each other.

## TypeScript and JavaScript
Mostly TypeScript, though. Everything is in [/scripts](scripts).

## Articles
Each article lives in its own directory inside [/articles](articles). The directory also serves as a slug. Besides the markdown file, there's also a json file with metedata that is loaded and parsed by PHP.

## Fonts

Main fonts (Roboto and DM Sans) are optimized with subfont to only include used glyps, and are [loaded inline](/styles/fonts/subfont.css) from a data url.

I don't really like the inline part, but subfont's CLI is not very nice to use, and the fonts load fine in their current state.

## PHP

Remember the no-framework part? Yeah, but it doesn't mean I can't have any abstractions. The PHP code will change  frequently, and I will definetely forget to update this section, so if you want to see how things work, take a look at the [code](/app) yourself.

# Deployment

I [build](/docker/Dockerfile) a docker image with PHP and caddy that has everything copied inside an image, only having a volume for auxilary data, such as the key-value store and cache.

If you want to test this out for yourself, first, do you really need docker? Just run `npm run dev`.

For everyone else, the container exposes the port 80, so all requests should be proxied to it.