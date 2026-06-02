---
description: Install the plugin, build the scene rig, and get content on a marker.
---

# Getting Started

This walkthrough takes you from a fresh import to tracked content on a printed
image, running in a mobile browser.

## Requirements

* **Unity 2022.3 LTS or newer** (tested on 2022.3, 6.0, 6.1). Pre-2022.3
  versions don't compile.
* **Universal Render Pipeline (URP)** recommended. Built-in and HDRP work via
  an auto-picked Unlit shader but are less thoroughly verified.
* **WebGL build target.**
* **An HTTPS host** for deployment — camera access requires a secure context.
* A target device: **iOS Safari 16.4+**, **Android Chrome 89+**, or a modern
  desktop browser with a webcam.

## Installation

### From the Unity Asset Store (recommended)

Import the package from the
[Unity Asset Store](https://assetstore.unity.com/). The plugin lands at
`Assets/MakeGamesPlay/WebARImageTracker/` and the bundled WebGL template at
`Assets/WebGLTemplates/WebARTemplate/`.

{% hint style="info" %}
The template's presence at exactly `Assets/WebGLTemplates/WebARTemplate/` is
what makes **WebARTemplate** appear in **Project Settings → Player → WebGL →
Resolution and Presentation → WebGL Template**. Unity only discovers templates
at that path — it can't load them from a package folder.
{% endhint %}

### From the Unity Package Manager (UPM)

* **Add package from git URL:**
  `https://github.com/makegamesplay/webar-image-tracker.git`
* **Or add package from disk:** select the package's `package.json`.

UPM places the plugin under `Packages/`, so the bundled WebGL template can't be
auto-placed at `Assets/WebGLTemplates/`. After installing via UPM, manually copy
`WebARTemplate/` into your project's `Assets/WebGLTemplates/WebARTemplate/`. The
[Compatibility Audit](#run-the-compatibility-audit) flags this if the template
is missing.

## Quick start

### 1. Set the WebGL template

**Project Settings → Player → WebGL → Resolution and Presentation → WebGL
Template → `WebARTemplate`.**

{% hint style="warning" %}
Can't see `WebARTemplate` in the picker? Switch your build target to **WebGL**
first (**File → Build Settings → WebGL → Switch Platform**). Templates only
appear for the active platform.
{% endhint %}

### 2. Create your target

**`Tools ▸ WebAR Image Tracker for Unity ▸ Create Marker`** opens the in-editor
compiler. Drop a source image; it compiles a tracking marker, scores its
trackability, and writes an editable **WebAR Marker** asset into your project.

Select that asset and, in its Inspector, set the printed **Width** and
**Height** in **centimetres**. The physical size belongs to the marker, so it
lives on the asset — one marker can hold several targets at different sizes —
and it's what lands your content at real-world scale.

You can also drop an existing `.mind` file under `Assets/`. It imports read-only
at a default 10 cm size; click **Convert to WebAR Marker** in its Inspector to
make the names and printed sizes editable.

See [Creating Markers](creating-markers.md) for what makes a good target image.

### 3. Add the WebAR Controller

**`GameObject ▸ WebAR ▸ Controller`** creates a `WebAR Controller` GameObject at
the scene root with two sibling components:

* **WebARTrackedRoot** — the scene's pose receiver. It drives transforms from
  tracker output, applies smoothing, and signals visibility state.
* **WebARCameraBackground** — renders the camera feed behind everything and
  syncs the camera's projection to the tracker's intrinsics.

The menu reuses your existing **MainCamera**-tagged camera if one exists,
otherwise it creates one, and auto-wires the bundled background material.

### 4. Add an image tracker

Click the **Add Image Tracker** button on the WebAR Controller's Inspector (or
use `GameObject ▸ WebAR ▸ Image Tracker`). Then:

* Drag your marker asset into the **Target File** slot.
* For a multi-target marker, pick the **Target Index** — a named dropdown
  ("1: carrot") sourced from the marker. Single-target markers don't show it.

The printed size comes from the marker asset (set in step 2), not the tracker.
The Scene-view gizmo updates live — a teal rectangle shows the marker footprint
at the tracker's origin in the XZ plane, with the +Y normal out of the marker
surface.

### 5. Place your content

Parent the content you want to appear on the marker as **children of the
`WebAR Image Tracker` GameObject** (the tracker's **Add Content Child** button
drops an empty child at the marker centre to nest your meshes under):

* A child at local `(0, 0, 0)` sits at the marker's centre.
* A child at `(0, 0.05, 0)` floats 5 cm above the marker surface.

Children start hidden. When tracking is acquired, the image tracker's transform
is mirrored to the tracked root's world pose and its children activate.

### 6. Model at real-world scale

Unity works in **1 unit = 1 metre**. A 0.3 × 0.3 × 0.3 cube under the tracker
shows up physically 30 cm on the marker. Size your content to match the physical
world you want it to inhabit.

### 7. Build and deploy

Build to WebGL and host over HTTPS (see [Testing on a Device](testing-on-device.md)
for the fastest path). Open the page on a phone, allow camera access — and on
iOS, the motion-permission prompt on first tap — then point at your printed
target.

{% hint style="success" %}
**Success looks like:** the camera feed renders behind the Unity canvas, the
status banner switches from "Searching for target…" to "Target 0 visible", and
your content appears anchored to the printed marker at the correct physical
scale. Content stays locked across portrait ↔ landscape rotation, follows the
marker as you move the phone, and disappears within ~0.4 s of the marker
leaving view.
{% endhint %}

## Run the Compatibility Audit

If something doesn't look right, run **`Tools ▸ WebAR Image Tracker for Unity ▸
Compatibility Audit`** for a battery of static checks — WebGL template selected,
runtime files present, URP active, Input System installed, and more. Each check
reports pass / warn / fail with a concrete remediation step. Run it before your
first build on a fresh project; it catches the common foot-guns before you blame
the tracker.

## Next steps

* [Creating Markers](creating-markers.md) — get the best tracking out of your
  source images.
* [Components Reference](components.md) — every component and field explained.
* [Tracking Quality & Tuning](tracking-quality.md) — dial in the feel.
* [Multi-Target Tracking](multi-target.md) — track several images at once.
