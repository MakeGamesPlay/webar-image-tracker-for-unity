---
description: The common first-build foot-guns and how to clear them.
---

# Troubleshooting

{% hint style="success" %}
Run **`Tools ▸ WebAR Image Tracker for Unity ▸ Compatibility Audit`** first. It
statically checks the WebGL template, render pipeline, Input System, runtime
files, and build target — catching most of the issues below before you deploy.
{% endhint %}

## The camera permission never prompts

You're loading over **HTTP**. `getUserMedia` only fires on a secure context
(HTTPS, or `localhost`). Redeploy over HTTPS — GitHub Pages, Netlify, Cloudflare
Pages, or [WebGL Build Host](testing-on-device.md) all work.

## Black screen / only the skybox, no camera feed

* **Missing `WebARCameraBackground`.** It's the component that renders the live
  video as Unity's background. The standard layout has it on the WebAR
  Controller; `GameObject ▸ WebAR ▸ Controller` sets it up. Check its **Target
  Camera** points at your Main Camera and its **Material Template** is assigned.
* **Camera Clear Flags set to Skybox.** The camera must clear to a solid colour,
  not the skybox — otherwise the skybox draws over the feed. The Controller sets
  Solid Color / black for you; if you built the rig by hand, set it yourself.
* **An extreme near-clip plane.** A very small near plane (e.g. `0.01`) paired
  with a large far plane collapses depth-buffer precision, which can let the
  skybox or far geometry win the depth test against the background quad. Keep a
  sane near/far ratio (the Controller's camera uses 0.01–1000 tuned for this; if
  you change it, don't push the near plane to extremes).

## Pink / magenta content (Built-in or HDRP)

A URP material renders magenta on Built-in or HDRP. The camera feed and
reference marker auto-resolve a pipeline-appropriate Unlit shader, but **your own
content** uses whatever materials you authored. Use materials built for your
project's render pipeline. For the camera feed specifically, assign a
pipeline-appropriate material to **WebARCameraBackground → Material Template**.
URP is the most thoroughly tested pipeline.

## Build loads slowly (30+ seconds)

Your host isn't serving the pre-compressed Unity files with `Content-Encoding:
br` / `gzip` headers. Configure your host, enable **Decompression Fallback** in
Player Settings, or use [WebGL Build Host](testing-on-device.md) (which sets
them correctly).

## Can't select WebARTemplate in Player Settings

Switch the build target to **WebGL** first (**File → Build Settings → Switch
Platform**). Templates only appear for the active platform.

## Red banner: "unsupported because X"

A capability check failed — the browser or device doesn't meet a hard
requirement. The `capability` tag (`webgl2`, `float-textures`, `getusermedia`,
`tracker-init`) names which. There's no workaround beyond using a supported
browser / device — see [Browser & Device Support](browser-support.md).

## "Tracker failed to start after N attempts"

The cold-start retry exhausted. Usually a permission flow abandoned mid-way (the
camera prompt dismissed before granting) or the camera busy in another tab.
Reload and try again. If it's consistent on one device, capture a banner
snapshot (the **Copy** button) — budget Android hardware was the motivating case
for the retry logic.

## Red banner: "WebAR bundle failed to load (timed out)"

With the self-hosted bundles this shouldn't happen on a normal network. If it
does, confirm **all** the self-hosted bundle files are present in the deployed
build's `TemplateData/` folder. A missing Rollup-hashed chunk makes Firefox hang
silently (Chrome shows a clearer error); the timeout is how the plugin surfaces
it. See [Custom WebGL Templates](custom-templates.md#bundled-dependencies).

## Camera freezes on the first frame (iOS Safari)

Almost always a **custom WebGL template** that hid the mind-ar `<video>` element
via `visibility: hidden`, `display: none`, or a 1×1 size. iOS Safari's autoplay
policy freezes such a video, so no pose matrices arrive. Use `opacity: 0` (what
the bundled template does). See
[Custom WebGL Templates](custom-templates.md#video-element-css).

## Content jitters at rest, or drags during motion

This is tuning, not a bug. Raise **Tracking Stability** for less rest jitter,
lower it for snappier motion; pick the right **Viewing Distance** preset; and
verify iOS motion permission was granted (it powers the motion-adaptive
relaxation). See [Tracking Quality & Tuning](tracking-quality.md). If a pose gets
*stuck*, use the recovery calls in [Runtime API](runtime-api.md).

## "This scene references N different .mind files"

Only one marker file loads per scene (a single tracker instance). Compile all
your images into **one multi-target marker**, assign it to one tracker, and give
the others their own **Target Index** with a blank Target File. See
[Multi-Target Tracking](multi-target.md).
