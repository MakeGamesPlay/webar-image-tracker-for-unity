---
description: Serve your build over HTTPS and watch the device console live.
---

# Testing on a Device

Camera access needs an HTTPS origin, and Unity's compressed build files need
the right `Content-Encoding` headers. The bundled **WebGL Build Host** covers
both for local testing:

1. Open **`Tools ▸ WebAR Image Tracker for Unity ▸ Test on Device`**.
2. Pick your WebGL build folder and press **Start**.
3. Scan the QR code with your device and accept the self-signed certificate.

The host serves over HTTPS on your LAN and streams each connected device's
console back into the editor. Desktop browsers also work directly with a
webcam for quick iteration.

> WebGL Build Host is also available on its own at
> [github.com/MakeGamesPlay/unity-webgl-build-host](https://github.com/MakeGamesPlay/unity-webgl-build-host).
> If you installed it separately via UPM, remove that copy before importing
> this package to avoid a duplicate assembly.

## The first-tap motion permission

iOS and Android ask for motion-sensor access separately from the camera. The
template requests it on the first tap anywhere on the page. Granting it
enables the gyro-fused rotation, dropout carry, and motion-adaptive smoothing;
declining still tracks, with reduced polish.

## Reading the diagnostics

Enable **Show Diagnostics Overlay** in the WebAR Controller's Debug foldout
and rebuild. A banner appears with tabs (**Device, Tracking, Smoothing,
Camera, Filter**) and a **Copy** button that captures everything to the
clipboard, which is ideal for
[reporting a new device](browser-support.md#reporting-a-new-device). See
[Tracking Quality & Tuning](tracking-quality.md) for what the values mean.

## Going public

For a shareable URL, see [Deploying Your Build](deploying.md).
