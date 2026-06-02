---
description: Serve your build over HTTPS and watch the device console live.
---

# Testing on a Device

WebAR needs a **secure (HTTPS) origin** to access the camera, and Unity's
compressed WebGL build files need the right `Content-Encoding` headers to load
quickly. A plain `http://` static server gives you neither — so the camera
prompt never fires and the build crawls.

## The fast path: WebGL Build Host

This package bundles **WebGL Build Host** for exactly this job.

1. Open **`Tools ▸ WebAR Image Tracker for Unity ▸ Test on Device`**.
2. Pick your WebGL **build folder**.
3. Press **Start**.
4. **Scan the on-screen QR code** with your phone.

It serves the build over **self-signed HTTPS on your LAN** with the correct
compression headers, and **streams each connected device's console back into the
editor** — so you can read what the phone sees without a tethered remote-debug
session.

> WebGL Build Host is free and open source on its own at
> [github.com/MakeGamesPlay/unity-webgl-build-host](https://github.com/MakeGamesPlay/unity-webgl-build-host).
> If you already installed it separately via a UPM Git URL, **remove that copy
> before importing this package** to avoid a duplicate assembly.

## Deploying for real

For a shareable, public URL, host the build on any provider that serves over
TLS:

* **GitHub Pages**
* **Netlify**
* **Cloudflare Pages**
* Any host that serves over HTTPS and supports the right compression headers.

> **`getUserMedia` won't fire on `http://` origins** (except `localhost`). If the
> camera permission never prompts, you're almost certainly loading over HTTP —
> redeploy over HTTPS.

### Slow first load?

If a build takes 30+ seconds to load, your host isn't serving the pre-compressed
Unity files with `Content-Encoding: br` / `gzip` headers. Either configure your
host to send them, enable **Decompression Fallback** in Player Settings, or use
WebGL Build Host (which sets these headers correctly).

## On iOS: the first-tap permission

iOS Safari splits **motion-sensor** permission from **camera** permission, and
both need a user gesture. The bundled WebGL template surfaces iOS's native
motion prompt on the first tap anywhere on the page (the loading overlay is that
gesture surface). Granting it lets the motion-adaptive smoothing engage; denying
it still tracks, just with a touch more drag during hand motion.

## Reading the diagnostics

To see live tracking telemetry on the device, enable the developer overlay:
on the **WebARTrackedRoot** component, turn **Show Developer Diagnostic Overlay**
on, then build and deploy. A banner appears at the top of the screen with tabs
for **Device**, **Tracking**, **Smoothing**, **Camera**, and **Filter**.

The banner's **Copy** button dumps every diagnostic to the clipboard as plain
text — ideal for filing a bug report or
[reporting a new device](browser-support.md#reporting-a-new-device). See
[Tracking Quality & Tuning](tracking-quality.md) for what the values mean.
