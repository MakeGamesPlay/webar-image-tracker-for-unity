---
description: Make tracking feel native — one slider, a distance preset, and a live overlay.
---

# Tracking Quality & Tuning

Out of the box, content sticks to the marker with no perceivable wobble at rest
and no drag during motion. When you want to bias toward *snappier* or *smoother*,
you usually only touch one control.

## The Tracking Stability slider

On the **WebAR Controller**, **Tracking Stability** (0–1, default **0.25**)
drives the entire pose-stabilisation pipeline behind a single dial:

| Range | Feel |
|-------|------|
| `< 0.15` | **Snappy** — follows the marker exactly; expect visible jitter at rest. |
| `0.15–0.4` | **Responsive** — light smoothing (the default sits here). |
| `0.4–0.85` | **Balanced** — stable with near-zero rest jitter. |
| `≥ 0.85` | **Smooth** — maximum stability, slight motion lag. |

## The Viewing Distance preset

**Viewing Distance** configures the close-range damping ramp — close-hold tremor
needs more damping than arm's-length viewing:

* **Close** — handheld, 0.3–0.6 m.
* **Normal** — ~1 m.
* **Far** — signage / large prints, 1.5 m+.
* **Adaptive** (default) — a wide envelope covering 0.3–1.5 m.

## Motion-adaptive filtering

The pipeline isn't a fixed low-pass. It watches the device's **accelerometer and
gyroscope** and the **rate of change of the pose**, and **relaxes the filters
the moment real motion begins**. So heavy rest-smoothing damps close-hold tremor
without making deliberate movement feel laggy — the two goals that a single
fixed filter can't satisfy at once.

> On iOS, motion sensors need a permission grant (separate from the camera). The
> bundled template requests it on the first tap. If denied, tracking still works,
> but motion-adaptive relaxation can't engage and content feels slightly draggier
> during hand motion.

## The on-device tuning panel

Tuning by feel is best done on the actual device. Turn **Show On-Device Tuning
Panel** on (on WebARTrackedRoot), build, and deploy. A banner appears at the top
of the screen with tabs:

* **Tracking** — the Stability slider, Distance buttons, an **Advanced** toggle,
  and live telemetry.
* **Camera** — fit mode, projection sync, mirror, rotation.
* **Device / Smoothing / Filter** — diagnostics and A/B toggles.

Adjust against live tracking, then tap **Copy Config** in the banner. Back in
Unity, click **Paste Tuned Config** on the WebARTrackedRoot Inspector to bring
the values into your project. Works on desktop and mobile, no gesture required.

### Advanced Mode

Flip **Advanced** on the panel (or call the advanced API) to expose the
underlying fields — close-range smoothing strength and distance, deadbands,
plausibility caps, prediction thresholds, separate position/rotation strengths,
and more. Most projects never need these; they're there when you do.

## Reading the diagnostics

The same overlay surfaces live telemetry. A few values worth knowing:

* **`upd (Hz)`** — the tracker frame rate. Your device-performance signal.
* **`Δpos / Δrot` (raw vs smooth, rest vs move)** — per-frame pose change before
  and after the pipeline, split by motion state. Shows how much the filter is
  doing and where.
* **`motion`** — the blended motion factor (and per-channel `motion (a/g/p/r)`)
  that drives filter relaxation.
* **`settled`** — whether the acquisition gate has opened.
* **`dist`** — estimated marker distance.

Tap **Copy** to dump everything to the clipboard — see
[reporting a new device](browser-support.md#reporting-a-new-device).

## When a pose gets stuck

Image tracking occasionally locks onto a wrong-but-plausible pose. Three
escalating recoveries, all callable from your own UI (see
[Runtime API](runtime-api.md)):

1. **`WebARTrackedRoot.Instance.Recalibrate()`** — hides content and re-runs
   acquisition. Start here.
2. **`WebARBridge.Instance.SoftResetTracker()`** — clears the matcher's pose so
   the next frame re-detects, without dropping the camera.
3. **`WebARBridge.Instance.RestartTracker()`** — full tracker rebuild. The
   nuclear option; briefly drops the camera.
