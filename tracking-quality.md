---
description: One slider, a distance preset, and a live on-device overlay.
---

# Tracking Quality & Tuning

Out of the box, content sticks to the marker with no perceivable wobble at
rest and no drag during motion. Two controls cover most tuning needs.

## Tracking Stability

On the **WebAR Controller**, **Tracking Stability** (0-1, default **0.25**)
drives the whole pose pipeline:

| Range | Feel |
|-------|------|
| `< 0.15` | Snappy. Follows the marker exactly; visible jitter at rest. |
| `0.15-0.4` | Responsive. Light smoothing (the default sits here). |
| `0.4-0.85` | Balanced. Stable with near-zero rest jitter. |
| `≥ 0.85` | Smooth. Maximum stability, slight motion lag. |

## Viewing Distance

Sets the close-range damping for how far users hold the device: **Close**
(0.3-0.6 m), **Normal** (~1 m), **Far** (1.5 m+ signage), or **Adaptive**
(default, covers any distance).

## What the pipeline does for you

* **Motion-adaptive filtering.** Smoothing relaxes the moment real motion
  begins (accelerometer + gyroscope + pose delta), so rest is steady and
  movement stays responsive.
* **Gyro-fused rotation.** Rotation runs at display rate on the gyroscope,
  continuously corrected by the tracker.
* **Dropout carry.** During brief tracking losses the gyroscope keeps content
  anchored to the marker, then re-syncs on re-find. The window follows **Lost
  Grace Period**.
* **Quality-adaptive damping.** When motion blur starves the tracker, damping
  stays partially engaged so content drifts gently and recovers.
* **Gated acquisition.** Content stays hidden until the first pose is
  well-constrained.

> Motion sensors need a permission grant (separate from the camera) on iOS and
> Android; the template requests it on the first tap. If declined, tracking
> still works with reduced polish.

## The on-device overlay

Turn **Show Diagnostics Overlay** on (Debug foldout), build, and deploy. A
banner appears with tabs (**Device, Tracking, Smoothing, Camera, Filter**),
live telemetry, the Stability and Distance controls, an **Advanced** toggle
exposing every underlying field, and a **Copy Logs** button for support
reports.

Useful values:

* **`upd (Hz)`**: tracker frame rate (the device-performance signal).
* **`Δpos / Δrot`** (raw vs smooth, rest vs move): how much the filter is
  doing and where.
* **`motion`**: the factor driving filter relaxation.
* **`settled`**: whether the acquisition gate has opened.
* **`dist`**: estimated marker distance.

## The Debug foldout A/B switches

**Quality-Adaptive Damping**, **Gyro Rotation Anchor**, and **Bypass IMU** can
each be toggled to isolate an issue on specific hardware. They ship in the
validated configuration; see the
[Components Reference](components.md#the-debug-foldout).

## When a pose gets stuck

Three escalating recoveries, callable from your own UI
([Runtime API](runtime-api.md)):

1. `WebARTrackedRoot.Instance.Recalibrate()` re-runs acquisition.
2. `WebARBridge.Instance.SoftResetTracker()` resets the matcher without
   dropping the camera.
3. `WebARBridge.Instance.RestartTracker()` rebuilds the tracker fully.
