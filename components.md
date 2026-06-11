---
description: Every component, asset, and Inspector field, explained.
---

# Components Reference

A WebAR scene has three moving parts: the **WebAR Controller** (receives the
pose, runs stabilisation, and renders the camera feed), one or more **Image
Trackers** (anchor your content to a target), and a **Marker asset** (the
compiled tracking data). A fourth, **WebARBridge**, is created automatically at
runtime.

```
Scene
 ├─ WebAR Controller            ← WebARTrackedRoot (the hub)
 │   └─ WebAR Image Tracker     ← WebARImageTracker (Target File + Target Index)
 │       └─ AR Content          ← your meshes / prefabs
 └─ Main Camera                 ← anywhere in the scene; assigned as Tracker Camera
```

## WebAR Controller (WebARTrackedRoot)

Created by **`GameObject ▸ WebAR ▸ Controller`**. A single component decodes
the tracker's per-frame matrix, runs the full stabilisation pipeline, renders
the live camera feed as Unity's background, keeps the camera's projection in
sync with the tracker's intrinsics, and owns post-processing. The camera can be
any camera in the scene - it does not need to be a child of the controller.

Two controls wrap the entire smoothing pipeline; for most projects they are the
only tracking settings you'll ever touch:

| Control | Default | What it does |
|---------|---------|--------------|
| **Tracking Stability** | 0.25 (Responsive) | The master dial, 0-1. Left = snappy: follows the marker exactly but jitters at rest. Right = smooth: rock-steady at rest with slight lag during motion. See [Tracking Quality & Tuning](tracking-quality.md). |
| **Viewing Distance** | Adaptive | Where users hold the device: `Close` (0.3-0.6 m), `Normal` (~1 m), `Far` (1.5 m+ signage), `Adaptive` (a wide envelope covering all of them). Tunes the close-range damping. |

### Tracking & content

| Field | Default | What it does |
|-------|---------|--------------|
| **Max Targets** | 1 | How many markers can be tracked and shown at once. Each extra simultaneous target lowers the tracking rate for all of them. See [Multi-Target Tracking](multi-target.md). |
| **Lost Grace Period (s)** | 0.4 | How long content stays visible after the marker leaves view, so brief dropouts don't flicker it off. During the window the pose is carried by the gyroscope, keeping content anchored to the marker rather than frozen to the screen. |
| **Content Rotation Offset** | (0, 0, 0) | Rotates content on the marker without editing your prefab - face a model the right way on the printed image. |
| **Prewarm Content** | Off | Invisibly renders scene-authored tracked content for a few frames at startup so its shaders compile up front - otherwise the first reveal can stutter ~0.1-0.2 s. Content scripts run `OnEnable`/`Start` at startup, and audio that auto-plays on enable will blip once. Content spawned from code should be prewarmed by that code. |
| **Start Content Locked** | Off | Keeps tracked content hidden - even while tracking - until you unlock it from code with `WebARTrackedRoot.Instance.SetContentLocked(false)`. For holding content behind a loading screen or onboarding flow. |

### Camera & post-processing

| Field | Default | What it does |
|-------|---------|--------------|
| **Tracker Camera** | (Main Camera) | The camera that sees the marker. Leave empty to use the scene's Main Camera. |
| **Camera Resolution** | Browser default | Camera feed resolution preset. Higher is sharper but tracks slower; lower is faster on weak devices. |
| **Render Camera Feed** | On | Show the live camera as the background (passthrough). Turn off to composite AR content over your own background - tracking and post-processing still run. |
| **Camera Fit Mode** | Cover | **Cover** fills the screen and crops the edges (no bars); **Contain** fits the whole frame with bars on one axis. |
| **Background Material** | Built-in unlit | Material that draws the feed; the live video binds to its texture (`_MainTex` / `_BaseMap`). Assign your own to run the feed through a custom shader - the sample ships a base Shader Graph to copy and extend. |
| **Mirror Horizontal / Quarter Turns** | Off / 0 | Flip or rotate the feed in 90° steps if a camera delivers it mirrored or sideways. |
| **WebGPU / WebGL2 Profile** | Empty | Per-backend post-processing profiles (Assets ▸ Create ▸ WebAR ▸ Graphics Profile): each picks a post scope - whole view, AR content only, or off - and a content render scale. **Feed Layer** appears only when a profile uses Content-Only post. |

**Button:** **Add Image Tracker** spawns a child tracker - the same as
`GameObject ▸ WebAR ▸ Image Tracker`.

### The Debug foldout

Diagnostics and validated A/B switches - for isolating problems, not everyday
tuning. The switches ship in their device-validated configuration.

| Field | Default | What it does |
|-------|---------|--------------|
| **Show Diagnostics Overlay** | Off | The on-device tuning / telemetry overlay in builds. See [Tracking Quality & Tuning](tracking-quality.md#the-on-device-overlay). Turn off for release. |
| **Show Crash Recovery Banner** | Off | A "previous session ended unexpectedly" banner with a Copy Crash Log button after a page crash. Developer-facing - leave off so end users never see it. Crash logs are captured either way; `?debug=1` on the URL force-shows it. |
| **Show Reference Marker** | Off | A wireframe marker at the tracked pose, sized to the physical marker dimensions - confirms tracking before your content renders. |
| **Log Tracking Events / Log Applied Pose (1 Hz)** | Off | Browser-console diagnostics. Development builds only; stripped from release. |
| **Quality-Adaptive Damping** | On | Keeps damping partially engaged while motion blur starves the tracker, so content drifts gently and recovers instead of wandering and snapping back. |
| **Gyro Rotation Anchor** | On | Drives content rotation from the gyroscope at display rate, continuously corrected toward the tracker - rotation stays fluid even where the tracker runs slower than the screen. |
| **Bypass IMU (debug)** | Off | Ignores all motion sensors - A/B test to isolate whether sensor input is involved in an issue. |

## WebARImageTracker

The content anchor. Place it (the Controller menu parents it under the WebAR
Controller), point it at a marker, and parent your content under it. When its
target is visible, the tracker mirrors the tracked root's world pose and
activates its children; when the target is lost (after the grace window), it
deactivates them.

| Field | What it does |
|-------|--------------|
| **Target File** | The compiled marker asset. The **primary** tracker holds it; **secondary** trackers (for other indices in the same marker) leave it blank. |
| **Target Index** | Which image in a multi-target marker this tracker follows - a **named dropdown** ("1: carrot") when the marker carries names. Hidden for single-target markers (always 0). |

**Local coordinate convention:** +X = marker width, **+Y = marker normal (out of
the paper)**, +Z = marker height. A child at `(0, 0, 0)` sits at the marker
centre; `(0, 0.05, 0)` floats 5 cm above the surface. Model at `1 unit = 1 m`.

> Only **one** marker file loads per scene (the bridge runs a single tracker
> instance). If trackers point at *different* marker files, the extras won't
> track - the Inspector flags this. Compile all images into one multi-target
> marker instead. See [Multi-Target Tracking](multi-target.md).

## Marker asset (WebAR Marker)

The compiled tracking data, produced by **Create Marker** or by importing a
`.mind` file. It holds, per target index: the tracking features, a **name**, and
the printed **Width / Height in centimetres**.

* A **WebAR Marker** (`.webarmarker`, what Create Marker produces) is
  **editable** - select it to set each target's name and printed size.
* A raw **`.mind`** imports **read-only** with default names and 10 cm sizing.
  Click **Convert to WebAR Marker** in its Inspector to make them editable.

See [Creating Markers](creating-markers.md).

## WebARBridge (automatic)

The singleton that bridges the mind-ar JavaScript runtime into Unity. It's
**created automatically** at runtime - you don't add it to a scene. It owns the
camera-feed texture, raises tracking events, and exposes the programmatic API.
See [Runtime API](runtime-api.md).

## Editor menus

**Tools ▸ WebAR Image Tracker for Unity**

* **About** - version, quick start, credits.
* **Compatibility Audit** - one-click project readiness check.
* **Create Marker** - the in-editor marker compiler + trackability checks.
* **Test on Device** - opens [WebGL Build Host](testing-on-device.md).

**GameObject ▸ WebAR** (also in the Hierarchy right-click ▸ Create menu)

* **Controller** - the scene rig (a single WebARTrackedRoot).
* **Image Tracker** - a content anchor under the Controller.
