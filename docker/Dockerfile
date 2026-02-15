FROM php:8.5-fpm

RUN apt-get update && apt-get install -y caddy tini

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh

COPY Caddyfile /etc/caddy

VOLUME ["/var/www/html", "/data"]

ENV KV_ROOT=/data/kv

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]