---
description: Compile your own target images and understand what tracks well.
---

# Creating Markers

A **marker** is a compiled tracking file built from one or more source images.
The tracker matches the live camera feed against the features baked into the
marker. This plugin compiles markers **inside the editor** - no command line, no
separate website.

## The in-editor Marker Compiler

Open **`Tools ▸ WebAR Image Tracker for Unity ▸ Create Marker`**.

1. **Drop one or more source images** (PNG / JPG) onto the window.
2. The tool **compiles a marker** client-side, using the same mind-ar version
   the plugin ships at runtime - so what you score here is what tracks on
   device.
3. It **scores each image's trackability** with a per-scale feature view, so you
   can see where the tracker finds detail and where it finds none.
4. It writes the result straight into your project as a **`WebARImageTarget`**
   asset, ready to drop into an image tracker's **Target File** slot.

> Already have a `.mind` file (for example, one compiled with the mind-ar-js
> online tool)? Drop it anywhere under `Assets/` and the plugin's scripted
> importer converts it into a `WebARImageTarget` automatically.

## What makes a good target image

Image tracking matches **distinctive local features**. The more unique,
high-contrast detail an image has, the more reliably and accurately it tracks.

**Tracks well:**

* Busy, detailed artwork - illustrations, dense photography, intricate logos.
* High contrast and sharp edges.
* Asymmetric, non-repeating content (so each region is uniquely identifiable).

**Tracks poorly:**

* Large flat or gradient areas - a plain sky, a solid-colour background, a wide
  uniform border. The tracker finds nothing to lock onto there.
* Repeating patterns - grids, polka dots, regular tiling. The tracker can't tell
  one repeat from another, which causes the pose to flip between equally-valid
  matches.
* Low contrast, soft focus, or heavy noise.
* Strong rotational symmetry (the tracker can lock at the wrong orientation).

> **Crop out dead borders.** A wide uniform margin around your artwork is wasted
> tracking area and a frequent cause of unstable pose. If the trackability view
> shows a large featureless region, crop it before compiling.

## Physical dimensions matter

The printed image's physical **Width** and **Height** (in **centimetres**) are a
property of the marker, so you set them on the **marker asset's Inspector**, per
target - not on the image tracker. This is how the plugin converts the tracker's
normalised output into real-world metres, so your content lands at the correct
physical scale.

A marker produced by **Create Marker** is editable: select it and type each
target's printed size. A raw `.mind` dropped into the project imports read-only
at a 10 cm default - click **Convert to WebAR Marker** in its Inspector to make
the names and printed sizes editable.

* Measure the **printed** size, not the source-file pixel size.
* Get the **aspect ratio** right - a stretched aspect skews the pose.
* Print at a sensible size for the viewing distance. Marker-sized
  (business-card to A5) works at arm's length; poster-sized works across a room.

## Multiple images in one marker

The compiler accepts several source images at once and bakes them into a single
marker file. Each image gets a **Target Index** in the order you added them
(0, 1, 2, …). You then place one image tracker per index to track them
independently - including all at the same time. See
[Multi-Target Tracking](multi-target.md).

## Tips for a clean print

* Print on **matte** stock if you can - glossy prints throw specular glare that
  washes out features under direct light.
* Keep the print **flat**. A curled or folded marker no longer matches the flat
  image the tracker learned.
* Light it **evenly**. Hard shadows across the marker change its apparent
  contrast and can drop tracking.
