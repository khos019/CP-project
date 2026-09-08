# Judge0, self-hosted

The site has never had a judge of its own. With `JUDGE0_URL` unset,
`app/api/_lib/judge.ts` falls back to `https://ce.judge0.com` — the free shared
instance — with no auth token. That is why compile-heavy sessions return
"the shared judge queue is busy": the site is standing in a queue with everyone
else on the internet, from Cloudflare IPs that get throttled first.

This sets up your own instance. Nothing in the app code changes — it already
reads `JUDGE0_URL`, `JUDGE0_API_KEY` and `JUDGE0_API_HOST`.

## What you need

A Linux VPS, 2 vCPU / 4 GB is comfortable for a classroom. A domain name
pointed at it (Judge0 must be reachable over HTTPS — a Cloudflare Worker
calling plain HTTP would send your auth token in the clear).

## 1. The cgroup v1 flag

**Do this first.** Judge0 sandboxes each run with `isolate`, which needs
cgroup v1. Ubuntu 22.04 and newer boot with cgroup v2 only, and on those hosts
Judge0 installs fine and then returns an internal error for every single
submission. It is the most common way a self-hosted Judge0 fails, and the error
message never mentions cgroups.

```bash
sudo sed -i 's/GRUB_CMDLINE_LINUX_DEFAULT="/GRUB_CMDLINE_LINUX_DEFAULT="systemd.unified_cgroup_hierarchy=0 systemd.legacy_systemd_cgroup_controller /' /etc/default/grub
sudo update-grub
sudo reboot
```

After the reboot, confirm it took:

```bash
stat -fc %T /sys/fs/cgroup
```

It must print `tmpfs` (cgroup v1). If it prints `cgroup2fs`, the flag did not
apply and Judge0 will not work — fix that before continuing.

## 2. Install Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
```

## 3. Configure

Copy this repo's `deploy/judge0/` to the server, then:

```bash
cd judge0
cp judge0.conf.example judge0.conf
openssl rand -hex 32   # run three times: AUTHN_TOKEN, POSTGRES_PASSWORD, REDIS_PASSWORD
```

Fill those three blanks in `judge0.conf`. Put your own domain in `Caddyfile` in
place of `judge.example.com`.

`judge0.conf` is gitignored. Keep it that way — it holds the token that lets
anyone run arbitrary code on your server.

## 4. Start

Judge0's database migration has to finish before the workers connect, so the
first start is two steps:

```bash
docker compose up -d db redis
sleep 10
docker compose up -d
```

Check it answers:

```bash
curl https://judge.example.com/about
```

And that the token is actually enforced — this must come back `401`:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://judge.example.com/submissions
```

If that prints `200`, `AUTHN_TOKEN` is empty and your judge is open to the
internet. Stop and fix it.

## 5. Point the site at it

Three secrets on the Worker. Run these yourself so the token never passes
through a chat log — each command prompts for the value:

```bash
npx wrangler secret put JUDGE0_URL
```

```bash
npx wrangler secret put JUDGE0_API_KEY
```

`JUDGE0_URL` is `https://judge.example.com` (no trailing slash, no `/api`).
`JUDGE0_API_KEY` is the `AUTHN_TOKEN` from `judge0.conf`.

**Do not set `JUDGE0_API_HOST`.** It exists only for RapidAPI: when it is
present the code switches to `X-RapidAPI-Key` / `X-RapidAPI-Host` headers, and
a self-hosted Judge0 expects `X-Auth-Token`. Setting it is the difference
between a working judge and a 401 on every submission.

For local `vinext dev`, put the same two names in `.env.local` instead.

## 6. Redeploy

Secrets are bindings, so they attach to the Worker without a rebuild — but a
deploy makes it take effect immediately and predictably:

```bash
npx vinext deploy
```

Then submit a deliberately broken C++ program on any problem. You should get
the compiler's actual message, not "the judge queue is busy".

## Notes

- **Language ids.** `languageIds` in `app/api/_lib/judge.ts` uses 54 (C++) and
  71 (Python 3). Those are the ids in Judge0 CE 1.13.1, the version pinned in
  the compose file, so they carry over unchanged. If you ever bump the Judge0
  image, check `/languages` before assuming they still match — a shifted id
  silently judges C++ submissions as some other language.
- Id 54 is GCC 9.2.0, which is C++17 in practice despite the `cpp20` name in
  our code. That is true of `ce.judge0.com` today as well, so self-hosting does
  not change what compiles.
- **Backups.** `deploy/judge0/data/postgres` holds the submission history.
  Nothing the site needs lives only there — the site keeps its own record in
  Supabase — so this is not critical to back up.
