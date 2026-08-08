---
description: Export settings, hosting options, and the server headers a WebGL build needs.
---

# Deploying Your Build

A WebGL build is a self-contained folder (`index.html`, `Build/`,
`TemplateData/`). Deploying means copying that folder to any web host that
serves HTTPS - the only catch is serving Unity's compressed files with the
right headers.

## Recommended export settings

* **WebGL Template:** `WebARTemplate` (required - it carries the tracking
  runtime).
* **Compression Format:** Brotli. Smallest builds, supported by all current
  browsers over HTTPS.
* **Decompression Fallback:** leave **off** when your host sends the headers
  below; turn **on** for hosts where you can't configure headers (loads still
  work everywhere, just slower to start).
* **Stripping / optimisation:** defaults are safe. The plugin ships a
  `link.xml` that protects its runtime against High managed stripping.
* **Name Files As Hashes:** turn **on** (Player Settings ▸ Publishing
  Settings). Each build's files then carry content-derived names, so a
  returning visitor can never load a mix of old and new build files after
  you redeploy. Off by default, and worth turning on before your first
  release rather than after.

## Uploading

Upload the **entire** build output folder, preserving its structure -
`index.html` at the root with `Build/` and `TemplateData/` beside it. Any
static HTTPS host works: Netlify, Cloudflare Pages, GitHub Pages, S3 +
CloudFront, or your own nginx / Apache.

> **`getUserMedia` won't fire on `http://` origins** (except `localhost`). If
> the camera permission never prompts, you're loading over HTTP - HTTPS is
> mandatory.

## Server settings

* **Declare the encoding of pre-compressed files.** Serve them as-is with the
  headers below; they should not be re-compressed by the server.

| File | Response headers |
|------|------------------|
| `*.wasm.br` | `Content-Encoding: br` + `Content-Type: application/wasm` |
| `*.js.br` | `Content-Encoding: br` + `Content-Type: application/javascript` |
| `*.data.br` | `Content-Encoding: br` + `Content-Type: application/octet-stream` |
| `*.gz` builds | Same pattern with `Content-Encoding: gzip` per file type. |

* **No cross-origin isolation needed.** The plugin doesn't use threads, so
  COOP / COEP headers are not required.
* **Caching:** with **Name Files As Hashes** on, files under `Build/` are
  content-hashed and safe to cache permanently (`immutable`); keep
  `index.html` short-lived (`no-cache, must-revalidate`) so returning
  visitors always pick up the current build's file references. Without that
  setting the filenames are reused between builds, and caching them hard
  causes the error below.

Ready-to-paste **Apache (`.htaccess`)** and **nginx** blocks live in
[Troubleshooting → Build loads slowly or doesn't load at all](troubleshooting.md#build-loads-slowly-or-doesnt-load-at-all).

> **First load takes 30+ seconds?** The host is serving the compressed files
> without their `Content-Encoding` header, so Unity decompresses in JavaScript.
> Fix the headers, or rebuild with Decompression Fallback enabled.

## Verify before publishing

Open the deployed URL on a device and confirm tracking - any capability problem
surfaces as a named message on the status banner. For live telemetry during the
check, see [Testing on a Device](testing-on-device.md#reading-the-diagnostics).
