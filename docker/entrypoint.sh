#! /usr/bin/env bash

# ensure php will have access to the data volume
chown -R www-data:www-data /data

php-fpm -R &
caddy run --environ --config /etc/caddy/Caddyfile &

trap 'kill -TERM $(jobs -p); wait' SIGTERM SIGINT
wait