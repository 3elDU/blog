FROM alpine:latest AS builder

WORKDIR /app
COPY . .

RUN apk add npm composer

RUN npm install
RUN composer install --no-dev --ignore-platform-reqs -o

RUN npm run build

# Clean out files
RUN rm -rf node_modules styles scripts

FROM php:8.5-fpm AS runner

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y caddy

# Copy project files
COPY --from=builder /app .

RUN pwd && ls -lah .

COPY ./docker/entrypoint.sh /
RUN chmod +x /entrypoint.sh

COPY ./docker/Caddyfile /etc/caddy

VOLUME ["/data"]
ENV KV_ROOT=/data/kv
ENV TWIG_TEMPLATE_CACHE=/data/templates/cache

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]