# GreyVoice on dev2

Domain: `grenery.xyz` and `www.grenery.xyz`. SSH alias `dev2` currently resolves to `103.122.2.72` using the machine's SSH configuration.

The public site is a static export of the existing React page. The demo form remains UI only. No database, Node service, or patient data is deployed. Dokploy's existing Traefik handles public ports 80/443; only the new `greyvoice-web` container and `greyvoice.yml` route belong to this site.

## Build and update

```sh
npm ci
npm run build:dev2
```

Output is `out/`. The release directory is `/opt/greyvoice/releases/<git-sha>/site`. `/opt/greyvoice/current` is a relative symlink to the active release. The container mounts the parent directory so switching the symlink also switches the served content. Keep previous releases for rollback.

Server files:

- `/opt/greyvoice/source`: GitHub checkout, `https://github.com/leaksopan/greyVoice.git`.
- `/opt/greyvoice/compose.yaml` and `/opt/greyvoice/nginx.conf`: copy of the tracked deployment configuration.
- `/etc/dokploy/traefik/dynamic/greyvoice.yml`: copy of `traefik.yml`; file provider reloads it automatically.

Start or update the container with `sudo docker compose -p greyvoice -f /opt/greyvoice/compose.yaml up -d`. Content-only updates need a new release and an atomic change of the relative `current` symlink. Verify `/healthz`, page content, JavaScript assets, and routing before switching DNS.

## Cloudflare DNS and TLS

1. Point A record `@` to `103.122.2.72` and `www` to the same IP (or CNAME `www` to `grenery.xyz`). Remove conflicting records for these two hosts, including an old AAAA record if the origin is IPv4 only. Other subdomains are unaffected.
2. Use DNS only initially so the existing Let's Encrypt HTTP challenge can reach dev2 directly. Traefik's `letsencrypt` resolver handles certificates for both hosts after DNS points to this server.
3. Verify a valid certificate for both hosts before enabling the Cloudflare proxy and setting SSL/TLS to Full (strict). Do not use Flexible.

HTTP is served while DNS and certificate issuance are pending. HTTPS is configured; a valid certificate depends on the DNS cutover. The deployer must verify certificate issuance after cutover and reload only this site's routing configuration if a failed pre-cutover request needs retrying.

## Pre-DNS checks

```sh
curl --resolve grenery.xyz:80:103.122.2.72 http://grenery.xyz/
curl --resolve www.grenery.xyz:80:103.122.2.72 http://www.grenery.xyz/healthz
```
