---
description: What runs the tracker, how fast, and how to report a new device.
---

# Browser & Device Support

The tracker runs wherever the browser exposes the camera and a WebGL2 +
float-texture graphics path: phones, tablets, laptops, and desktops. All
checks run up front; an unsupported browser gets a clear "unsupported because
X" message.

## Minimum requirements

* **WebGL 2**: Chrome ≥ 89, Firefox ≥ 108, Safari ≥ 16.4, Edge ≥ 89.
* **`EXT_color_buffer_float`** WebGL extension (needed by the inference
  backend; some budget GPUs report WebGL 2 but lack it).
* **Secure context**: HTTPS, or `localhost` during development.
* **Motion permission** (iOS and Android): requested on the first tap.
  Declining keeps tracking working with reduced polish.

## Performance tiers

| Tier | Example hardware | Expected tracker rate |
|------|------------------|-----------------------|
| iOS flagship (2020+) | iPhone 12+, iPad Pro M1+ | 35-55 Hz |
| Android flagship (2022+) | Galaxy S22+, Pixel 7+ | 30-45 Hz |
| Mid-range Android (2020+) | Pixel 6a class | 25-35 Hz |
| Older flagship (2019-2021) | iPhone XS-11, Galaxy S10/S20 | 25-40 Hz |
| Budget / older Android | Kirin 710 / Mali-G51 class | 10-20 Hz; first load may retry |
| Below requirements | Pre-WebGL 2, or no float textures | Named unsupported banner |

Desktop browsers with a webcam typically exceed the mobile tiers. iOS WebKit
generally runs the tracker faster than Android Chromium on comparable
hardware; the live rate is always visible as `upd (Hz)` on the diagnostics
overlay and via `WebARBridge.Instance.TrackerRateHz`.

## Pose quality at a glance

Measured on an iPhone 12 Pro Max (iOS 18.7, Safari) at ~0.3 m, after the full
pipeline:

| Metric | Typical |
|--------|---------|
| Tracker frame rate | 30-46 Hz |
| Δpos at rest (filtered) | ~0.3 mm |
| Δrot at rest (filtered) | ~0.05° |
| Δpos during slow motion | < 2 mm/frame |
| Lost-grace hold | 0.4 s (configurable), gyro-anchored |
| Settle time | 3-8 stable frames |

## Verified devices

Steady-state `upd (Hz)` after ~5 s on the standard MindAR card example:

| Device | OS / Browser | GPU | Rate |
|--------|--------------|-----|------|
| iPhone 12 Pro Max | iOS 18.7 / Safari | Apple GPU | 46.3 Hz |
| iPhone 12 Pro Max | iOS 18.7 / Brave | Apple GPU (WebKit) | 39.4 Hz |
| Samsung Galaxy S22 Ultra | Android / Chrome | Adreno 730 | 32.0 Hz |
| Huawei Mate 20 Lite | Android 10 / Chrome | Mali-G51 | 12.6-14.3 Hz |
| Huawei Mate 20 Lite | Android 10 / Firefox | Mali-G51 | 10.1 Hz |

All iOS browsers use WebKit, so the engine is shared; differences come from
each browser's privacy layers. Safari posted the fastest iOS rates.

## Reporting a new device

1. Enable **Show Diagnostics Overlay** (Debug foldout), build, deploy.
2. Tap **Copy** in the banner header and paste the snapshot into an email,
   chat, or issue.

The `gpu` row identifies the hardware; `upd (Hz)` under Tracking is the
achieved rate. Screenshots of the Device and Tracking tabs work too.
