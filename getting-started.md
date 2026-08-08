---
description: Install the plugin, build the scene rig, and get content on a marker.
---

# Getting Started

From a fresh import to tracked content on a printed image.

## Requirements

* Unity 2022.3 LTS or newer (tested on 2022.3.62f3, 6000.0.77f1, 6000.3.17f1, 6000.4.11f1, and 6000.5.0f1).
* Input System package, with **Active Input Handling** set to "Input System
  Package" or "Both" (Project Settings ▸ Player ▸ Other Settings). Unity 2022.3
  defaults to the old Input Manager, so set it there; Unity 6 projects usually
  have it already. The plugin uses it for the gyroscope and accelerometer.
* URP recommended; Built-in and HDRP work via an auto-picked Unlit shader.
* WebGL build target.
* An HTTPS host (camera access needs a secure context).
* A device with a camera: iOS/iPadOS 16.4+ (any browser - all iOS browsers use
  WebKit), Android Chrome 89+, or a desktop browser with a webcam.

## Installation

Import the package from the
[Unity Asset Store](https://assetstore.unity.com/packages/slug/384314). The
plugin lands at `Assets/MakeGamesPlay/WebARImageTracker/` and the WebGL
template at `Assets/WebGLTemplates/WebARTemplate/` (the exact path Unity scans
for templates).

## Quick start

### 1. Set the WebGL template

**Project Settings → Player → WebGL → Resolution and Presentation → WebGL
Template → `WebARTemplate`.** If the template isn't listed, switch the build
target to WebGL first.

### 2. Create your marker

**`Tools ▸ WebAR Image Tracker for Unity ▸ Create Marker`**: drop a source
image, and the compiler writes an editable **WebAR Marker** asset into your
project with trackability checks. Select the asset and set the printed
**Width** and **Height** in **centimetres**; that is what lands your content
at real-world scale.

Existing `.mind` files can be dropped under `Assets/` too; click **Convert to
WebAR Marker** on the imported asset to edit names and sizes. See
[Creating Markers](creating-markers.md) for what makes a good target image.

### 3. Add the WebAR Controller

**`GameObject ▸ WebAR ▸ Controller`** creates the scene rig: a single
component that receives poses, runs stabilisation, renders the camera feed,
and keeps the camera projection in sync. It reuses your existing Main Camera
or creates one. The camera can live anywhere in the scene; it's assigned to
the controller's **Tracker Camera** slot (empty = Main Camera).

### 4. Add an Image Tracker

Click **Add Image Tracker** on the controller and drag your marker asset into
its **Target File** slot. Multi-target markers also show a named **Target
Index** dropdown. A teal Scene-view gizmo shows the marker footprint.

### 5. Place your content

Parent content under the **WebAR Image Tracker** GameObject. Local
`(0, 0, 0)` is the marker centre; `(0, 0.05, 0)` floats 5 cm above it. Model
at **1 unit = 1 metre**. Children stay hidden until tracking is acquired.

For heavyweight materials, enable **Prewarm Content** on the controller so
shaders compile at startup instead of at first reveal.

### 6. Build and test

Build for WebGL, then open **`Tools ▸ WebAR Image Tracker for Unity ▸ Test on
Device`**, pick the build folder, press Start, and scan the QR code. Allow
camera access (and the motion prompt on first tap), then point at the printed
image. Content appears anchored at physical scale and stays locked across
rotation.

For production hosting, see [Deploying Your Build](deploying.md).

## If something doesn't look right

Run **`Tools ▸ WebAR Image Tracker for Unity ▸ Compatibility Audit`**. It
checks the template, render pipeline, Input System, runtime files, and build
target, and gives a fix for anything that fails. Then see
[Troubleshooting](troubleshooting.md).
