---
description: Track several printed images at the same time, each with its own content.
---

# Multi-Target Tracking

WebAR Image Tracker can track **several images simultaneously** - each printed
target gets its own content, and each is stabilised by the same proven pose
pipeline as a single target.

## How it works

You compile multiple source images into **one marker file**. Each image is
assigned a **Target Index** (0, 1, 2, …) in the order it was added. In the
scene, you place **one `WebARImageTracker` per index**, each anchoring its own
content. When the camera sees a target, that tracker's content appears; when
multiple targets are visible, multiple content sets appear at once.

## Setup

### 1. Compile a multi-image marker

In **`Tools ▸ WebAR Image Tracker for Unity ▸ Create Marker`**, drop **all** the
source images you want to track. They compile into a single `WebARImageTarget`
with one index per image, in the order you added them. See
[Creating Markers](creating-markers.md).

### 2. Raise Max Targets on the WebAR Controller

Select the **WebAR Controller** GameObject and, on its **WebARTrackedRoot**
component, set **Max Targets** to the number of targets you want tracked at
once (for example, `4`). This tells the underlying tracker to match more than
one image per frame.

### 3. Add one image tracker per index

Click **Add Image Tracker** on the WebAR Controller's Inspector once per target,
then configure each:

* **The first (primary) tracker** holds the compiled marker in its **Target
  File** slot, with **Target Index** `0`.
* **Each additional tracker** sets its **Target Index** to `1`, `2`, … matching
  the compile order (a named dropdown when the marker carries names), and
  **leaves Target File blank** (they share the primary's marker).
* Set each target's printed **Width** and **Height** (in centimetres) on the
  **marker asset**, per index - so a business card and a poster in the same
  marker each render at their own scale. (Sizes live on the asset, not the
  tracker.)

### 4. Parent content under each tracker

Put each target's content under its own `WebARImageTracker` GameObject. Each
tracker activates its own children when its target is visible and hides them
when it isn't - independently of the others.

## Performance

Tracking more than one target at a time adds matcher work per frame, which
lowers the tracker rate for every target. Set `Max Targets` to the smallest
number the experience needs. The live rate is visible as `upd (Hz)` on the
diagnostics overlay and via `WebARBridge.Instance.TrackerRateHz`; per-device
rates are in [Browser & Device Support](browser-support.md).

## Tips

* **Keep targets visually distinct.** Two similar images raise the chance of a
  mismatch. Distinct artwork per target tracks more reliably.
* **Order is the contract.** Target indices follow the order images were added
  in the compiler. If you recompile with images in a different order, update the
  **Target Index** on each tracker to match.
* **Set realistic physical sizes per target.** Printed sizes live on the marker
  asset, one per target index, so a business card and a poster compiled into the
  same marker each render their content at the right scale.
