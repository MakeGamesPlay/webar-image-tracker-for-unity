---
description: >-
  Image-target augmented reality for Unity WebGL — runs in the mobile browser,
  no app install, no ARKit, no ARCore, no WebXR.
---

# WebAR Image Tracker for Unity

**Point a phone's browser at a printed image and watch your Unity content lock
onto it.** No app to install, no native SDK, no WebXR. WebAR Image Tracker
brings image-target augmented reality to plain `https://` web pages on **iOS
Safari** and **Android Chrome**, built entirely on a Unity WebGL build.

It fills a gap that no first-party tooling covers: Unity's AR Foundation
doesn't support WebGL, and iOS Safari doesn't support WebXR image tracking. This
plugin bridges [mind-ar-js](https://github.com/hiukim/mind-ar-js)
(TensorFlow.js + WebGL2) into Unity so AR content you author in the editor
deploys straight to the mobile web.

{% hint style="success" %}
### 🛒 Get it on the Unity Asset Store

**[→ WebAR Image Tracker for Unity on the Unity Asset Store](https://assetstore.unity.com/packages/slug/384314)**

One import, a custom WebGL template, and a one-click scene rig. Build to WebGL,
host over HTTPS, and your AR experience runs in the browser on the devices
already in your users' pockets.
{% endhint %}

## Why WebAR

* **No app, no store review, no install friction.** Share a URL. The user taps
  it, allows the camera, points at the image. That's the entire funnel —
  perfect for packaging, print ads, posters, business cards, museum placards,
  trading cards, and event signage.
* **Reaches iOS where WebXR can't.** iOS Safari has no WebXR image tracking, so
  every "WebAR" SDK that relies on WebXR silently fails there. This plugin uses
  computer-vision tracking (mind-ar-js) that runs on TensorFlow.js, so it works
  on iOS Safari and Android Chrome alike.
* **Author in Unity.** Model, animate, light, and script in the editor you
  already know. Content lives under a tracked GameObject at real-world metric
  scale — a 30 cm model shows up 30 cm on the marker.

## What you get

* **Single-slider tracking tuning.** A `Tracking Stability` slider drives the
  whole pose-stabilisation pipeline — snappy on the left, glassy-smooth on the
  right. Advanced Mode exposes every underlying field when you want it.
* **On-device tuning overlay.** Flip one toggle to surface a live tuning panel
  on the phone: stability slider, distance preset, and diagnostic telemetry.
  Copy tweaked values to the clipboard and paste them back into the Inspector.
* **Motion-adaptive filtering.** Filters relax automatically while the device
  is moving, so close-hold tremor is damped without lag during deliberate
  motion.
* **Simultaneous multi-target tracking.** Compile several source images into one
  marker file, drop one tracker per image, and track them all at once — each
  with its own content and the same proven stabilisation pipeline.
* **In-editor marker compiler.** Drop a source image; the plugin compiles a
  tracking marker, scores its trackability, and drops the result back into your
  project — no command line, no separate website.
* **One-click setup.** `GameObject ▸ WebAR ▸ Controller` builds the scene rig
  and reuses your existing camera. An `Add Image Tracker` button spawns each
  target in a click.
* **URP-first, with Built-in & HDRP fallback.** The camera-feed and content
  materials resolve a pipeline-appropriate shader at runtime.
* **Self-hosted JS runtime.** mind-ar-js and three.js ship bundled in the WebGL
  template — no CDN dependency at runtime, no third-party hosting to break.

## Start here

* [**Getting Started**](getting-started.md) — install, quick start, first build.
* [**Creating Markers**](creating-markers.md) — compile and score your own
  target images.
* [**Components Reference**](components.md) — every component and Inspector field.
* [**Multi-Target Tracking**](multi-target.md) — track several images at once.
* [**Tracking Quality & Tuning**](tracking-quality.md) — make it feel native.
* [**Testing on a Device**](testing-on-device.md) — HTTPS, QR codes, live logs.
* [**Browser & Device Support**](browser-support.md) — the compatibility matrix.
* [**Runtime API**](runtime-api.md) — drive tracking from your own C#.
* [**Troubleshooting**](troubleshooting.md) — the common first-build foot-guns.

## Requirements at a glance

| | |
|---|---|
| **Unity** | 2022.3 LTS or newer (tested on 2022.3, 6.0, 6.1) |
| **Render pipeline** | URP recommended; Built-in & HDRP supported |
| **Build target** | WebGL |
| **Hosting** | HTTPS (camera access needs a secure context) |
| **Devices** | iOS Safari 16.4+, Android Chrome 89+, modern desktop browser with a webcam |

## Credits

Built on [mind-ar-js](https://github.com/hiukim/mind-ar-js) by hiukim (MIT),
[three.js](https://threejs.org), and [TensorFlow.js](https://www.tensorflow.org/js).

Published by **MakeGamesPlay**.
