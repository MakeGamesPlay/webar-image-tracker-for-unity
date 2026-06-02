---
description: Every component, asset, and Inspector field, explained.
---

# Components Reference

A WebAR scene has three moving parts: the **WebAR Controller** (receives the
pose and renders the camera feed), one or more **Image Trackers** (anchor your
content to a target), and a **Marker asset** (the compiled tracking data). A
fourth, **WebARBridge**, is created automatically at runtime.

```
WebAR Controller            ← WebARTrackedRoot + WebARCameraBackground
└── WebAR Image Tracker     ← WebARImageTracker (Target File + Target Index)
    └── AR Content          ← your meshes / prefabs
```

## WebAR Controller

Created by **`GameObject ▸ WebAR ▸ Controller`**. It carries two components and
reuses your existing MainCamera (or makes one).

### WebARTrackedRoot

The scene's pose receiver. It decodes the tracker's per-frame matrix, runs the
full stabilisation pipeline, and exposes the smoothed world pose that image
trackers mirror. Its Inspector is deliberately curated — the headline controls
are visible; the dozens of fine-tuning fields are reached through Advanced Mode
on the [on-device tuning panel](tracking-quality.md#the-on-device-tuning-panel).

| Field | What it does |
|-------|--------------|
| **Tracking Stability** | One slider (0–1, default **0.25**) driving the whole smoothing pipeline. Snappy on the left, glassy on the right. See [Tracking Quality & Tuning](tracking-quality.md). |
| **Viewing Distance** | Preset for the close-range damping envelope: `Close` (0.3–0.6 m), `Normal` (~1 m), `Far` (1.5 m+), `Adaptive` (0.3–1.5 m, default). |
| **Max Targets** | How many markers track simultaneously. `1` (default) shows one at a time; raise it for [multi-target](multi-target.md). Higher values cost more per frame. Needs a tracker restart to take effect. |
| **Tracker Camera** | The camera the marker pose is composed against. Empty → `Camera.main`. |
| **Camera Resolution** | Camera passthrough resolution multiplier. Higher = sharper video, lower tracker rate; lower = faster on weak devices. Default `1.0` lets the browser choose. |
| **Content Rotation Offset** | Rotates tracked content on the marker without editing your prefab — align a model that sits the wrong way round. |
| **Lost Grace Period (s)** | How long content stays visible after the marker leaves view, smoothing brief occlusions. `0` hides immediately. |
| **Show On-Device Tuning Panel** | Surfaces the runtime overlay (diagnostics + live tuning) in WebGL builds. Off in shipping builds. Also enables verbose logging. |

**Buttons:** **Add Image Tracker** (spawns a child tracker) and **Paste Tuned
Config** (applies a config copied from the on-device panel).

**Debug foldout:** **Show Reference Marker** (+ **Reference Marker Material**) —
a wireframe cube at the tracked pose to confirm tracking before your content
renders; **Log Tracking Events** and **Log Applied Pose (1 Hz)** — console
diagnostics (editor / development builds only); **Recalibrate Key** — an editor
key that triggers a soft tracker reset.

### WebARCameraBackground

Renders the live camera feed as Unity's background and syncs the camera's
projection to the tracker's intrinsics so content and video stay aligned across
rotation.

| Field | What it does |
|-------|--------------|
| **Target Camera** | The camera to drive. Auto-wired by the Controller menu. |
| **Material Template** | The material used for the feed quad. The bundled `WebARBackground.mat` (URP/Unlit) is wired by default; on Built-in / HDRP the plugin auto-resolves a fitting Unlit shader if this doesn't match. |
| **Fit Mode** | `Contain` (letterbox the whole video) or `Cover` (fill the screen, cropping the video's minor axis). |

The on-device panel's **Camera** tab also exposes projection-sync, horizontal
mirror, and quarter-turn rotation for field adjustment.

## WebARImageTracker

The content anchor. Place it (the Controller menu parents it under the WebAR
Controller), point it at a marker, and parent your content under it. When its
target is visible, the tracker mirrors the tracked root's world pose and
activates its children; when the target is lost (after the grace window), it
deactivates them.

| Field | What it does |
|-------|--------------|
| **Target File** | The compiled marker asset. The **primary** tracker holds it; **secondary** trackers (for other indices in the same marker) leave it blank. |
| **Target Index** | Which image in a multi-target marker this tracker follows — a **named dropdown** ("1: carrot") when the marker carries names. Hidden for single-target markers (always 0). |

**Add Content Child** drops an empty `AR Content` GameObject at the marker
centre to nest your meshes under.

**Local coordinate convention:** +X = marker width, **+Y = marker normal (out of
the paper)**, +Z = marker height. A child at `(0, 0, 0)` sits at the marker
centre; `(0, 0.05, 0)` floats 5 cm above the surface. Model at `1 unit = 1 m`.

> Only **one** marker file loads per scene (the bridge runs a single tracker
> instance). If trackers point at *different* marker files, the extras won't
> track — the Inspector flags this. Compile all images into one multi-target
> marker instead. See [Multi-Target Tracking](multi-target.md).

## Marker asset (WebAR Marker)

The compiled tracking data, produced by **Create Marker** or by importing a
`.mind` file. It holds, per target index: the tracking features, a **name**, and
the printed **Width / Height in centimetres**.

* A **WebAR Marker** (`.webarmarker`, what Create Marker produces) is
  **editable** — select it to set each target's name and printed size.
* A raw **`.mind`** imports **read-only** with default names and 10 cm sizing.
  Click **Convert to WebAR Marker** in its Inspector to make them editable.

See [Creating Markers](creating-markers.md).

## WebARBridge (automatic)

The singleton that bridges the mind-ar JavaScript runtime into Unity. It's
**created automatically** at runtime — you don't add it to a scene. It owns the
camera-feed texture, raises tracking events, and exposes the programmatic API.
See [Runtime API](runtime-api.md).

## Editor menus

**Tools ▸ WebAR Image Tracker for Unity**

* **About** — version, quick start, credits.
* **Compatibility Audit** — one-click project readiness check.
* **Create Marker** — the in-editor marker compiler + trackability scorer.
* **Test on Device** — opens [WebGL Build Host](testing-on-device.md).

**GameObject ▸ WebAR** (also in the Hierarchy right-click ▸ Create menu)

* **Controller** — the scene rig (WebARTrackedRoot + WebARCameraBackground).
* **Image Tracker** — a content anchor under the Controller.
