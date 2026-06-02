---
description: What runs the tracker, how fast, and how to report a new device.
---

# Browser & Device Support

WebAR Image Tracker runs wherever the browser exposes the camera and a
WebGL2 + float-texture graphics path. It checks for these up front and shows a
named "unsupported because X" message rather than failing silently downstream.

## Minimum requirements

* **WebGL 2** — Chrome ≥ 89, Firefox ≥ 108, Safari ≥ 16.4, Edge ≥ 89.
* **`EXT_color_buffer_float`** WebGL extension. TensorFlow.js (mind-ar's
  inference backend) needs float-texture rendering. Some budget Mali GPUs claim
  WebGL 2 support but fail this extension.
* **Secure context** — HTTPS, or `localhost` for development. Required for
  `getUserMedia`.
* **iOS Safari 13+** additionally needs a separate motion-sensor permission
  grant for the accelerometer-driven smoothing. The template surfaces iOS's
  native dialog on the first tap. Denying it degrades quality slightly but
  doesn't break tracking.

## Performance tiers

| Tier | Example hardware | Expected tracker rate |
|------|------------------|-----------------------|
| iOS flagship (2020+) | iPhone 12+, iPad Pro M1+ | 35–55 Hz |
| Android flagship (2022+) | Galaxy S22+, Pixel 7+ | 30–45 Hz |
| Mid-range Android (2020+) | Pixel 6a, mid Snapdragon 7-series | 25–35 Hz |
| Older flagship (2019–2021) | iPhone XS–11, Galaxy S10/S20 | 25–40 Hz |
| Budget / older Android (2017–2019) | Huawei Mate 20 Lite, Galaxy A10 class | 10–20 Hz; first load may need a retry |
| Unsupported | Pre-WebGL 2, or no `EXT_color_buffer_float` | 0 Hz; named unsupported banner |

{% hint style="info" %}
**iOS runs the tracker faster than Android — even on older hardware.** On-device
testing consistently shows TensorFlow.js's WebGL backend running materially
faster on iOS WebKit than on Android Chromium. An iPhone 12 Pro Max (2020) in
Safari runs the tracker ~45% faster than a Galaxy S22 Ultra (2022) in Chrome,
despite the newer Android hardware. There's no Unity-side workaround — it's a
browser-platform characteristic. If you target Android, expect Chrome to trail
the device's nominal capability.
{% endhint %}

## Pose quality at a glance

Measured on an iPhone 12 Pro Max (iOS 18.7, Safari) tracking the standard
MindAR card example at ~0.3 m, after the full stabilisation pipeline:

| Metric | Typical | What it means |
|--------|---------|---------------|
| Tracker frame rate | 30–46 Hz | Keeps up with the camera stream. |
| Δpos at rest (filtered) | ~0.3 mm | No perceivable wobble holding the phone still. |
| Δrot at rest (filtered) | ~0.05° | Below display quantum at typical distances. |
| Δpos during slow motion | < 2 mm/frame | Content tracks the hand with no visible drag. |
| Lost-grace hold | 0.4 s (configurable) | Survives a brief blink, re-syncs without a pop. |
| Settle time | 3–8 stable frames | Hidden during acquisition until the pose is well-constrained. |

## Verified devices

Each row was verified from an on-device diagnostic snapshot (steady-state
`upd (Hz)` after ~5 s tracking the standard MindAR card example).

| Device | OS / Browser | GPU | Tracker rate | Notes |
|--------|--------------|-----|--------------|-------|
| iPhone 12 Pro Max | iOS 18.7 / Safari | Apple GPU | 46.3 Hz | Fastest verified rate. |
| iPhone 12 Pro Max | iOS 18.7 / Brave | Apple GPU (WebKit) | 39.4 Hz | Same device; Brave's shields cost ~15% vs Safari. |
| Samsung Galaxy S22 Ultra | Android / Chrome | Adreno 730 | 32.0 Hz | 2022 flagship, ~45% slower than the older iPhone — the iOS/Android gap. |
| Huawei Mate 20 Lite | Android 10 / Chrome | Mali-G51 | 12.6–14.3 Hz | Lowest verified tier; capability checks pass. |
| Huawei Mate 20 Lite | Android 10 / Firefox | Mali-G51 | 10.1 Hz | Firefox Android ~25% slower than Chrome on the same device. |

{% hint style="info" %}
**All iOS browsers are WebKit under the hood** (Apple mandate), so Safari, Chrome
and Brave on iOS share the tracker engine; differences come from each browser's
privacy/shield layers. Use **Safari** for performance-sensitive iOS demos.
{% endhint %}

## Reporting a new device

Help expand this matrix:

1. On **WebARTrackedRoot**, turn **Show Developer Diagnostic Overlay** on, then
   build and deploy.
2. The banner appears at the top of the screen with tabs: **Device**,
   **Tracking**, **Smoothing**, **Camera**, **Filter**.
3. **Tap the Copy button in the banner header.** It dumps every populated
   diagnostic — with the status line and a timestamp — to the clipboard as plain
   text. Paste that into an email, chat, or issue.

The definitive classifier is the **`gpu`** row (the `UNMASKED_RENDERER_WEBGL`
value); the achieved rate is **`upd (Hz)`** under Tracking. If Copy is
unavailable, two screenshots — the Device tab and the Tracking tab — carry the
same information. The banner stays readable under bright outdoor light, so a
photo of the screen works too.
