---
description: The common first-build foot-guns and how to clear them.
---

# Troubleshooting

> Run **`Tools ▸ WebAR Image Tracker for Unity ▸ Compatibility Audit`** first. It
> statically checks the WebGL template, render pipeline, Input System, runtime
> files, and build target — catching most of the issues below before you deploy.

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

**Symptom:** the build loads and tracks, but the *first* load takes 20–30
seconds (noticeably worse on iPhone) instead of a few seconds.

**Cause:** Unity WebGL release builds ship their big artifacts *already
compressed* — `*.wasm.br`, `*.framework.js.br`, `*.data.br` (Brotli) or `*.gz`
(Gzip). A generic static server serves those raw, with **no `Content-Encoding`
header**, so the browser sees brotli bytes labelled as opaque binary, can't
decode them natively, and Unity falls back to its **JavaScript** decompressor —
tens of seconds on mobile. Without `Content-Type: application/wasm` the browser
also can't *streaming-compile* the WebAssembly as it downloads.

**The fix:** make your host send, for the pre-compressed files, both the
`Content-Encoding` (so the browser decodes natively) and the real underlying
`Content-Type` (so it streaming-compiles). The bundled
[WebGL Build Host](testing-on-device.md) already does this for local testing —
the configs below are for your **production** server.

### Apache (`.htaccess`)

Drop this in the deployed build folder (alongside `index.html` / the `Build/`
folder). Needs `mod_mime`:

```apache
<IfModule mod_mime.c>
  # .br / .gz are content-encodings, not file types. Clear stray associations
  # first — Apache maps .br to the Breton *language* by default, which silently
  # breaks encoding detection.
  RemoveType     .br .gz
  RemoveLanguage .br

  AddEncoding br   .br
  AddEncoding gzip .gz

  # Map the underlying types so the browser streaming-compiles the wasm.
  AddType application/wasm         .wasm
  AddType application/javascript   .js
  AddType application/octet-stream .data
</IfModule>

# Never let mod_deflate re-compress an already-compressed file.
<IfModule mod_deflate.c>
  SetEnvIfNoCase Request_URI "\.(br|gz)$" no-gzip dont-vary
</IfModule>
```

No `.htaccess` access? The same `AddEncoding` / `AddType` lines go in your vhost
or `apache2.conf`, inside the build's `<Directory>` block.

### nginx

```nginx
# Brotli-precompressed Unity files: set encoding + underlying type, no re-compress.
location ~ \.wasm\.br$ { add_header Content-Encoding br; default_type application/wasm;         gzip off; }
location ~ \.js\.br$   { add_header Content-Encoding br; default_type application/javascript;   gzip off; }
location ~ \.data\.br$ { add_header Content-Encoding br; default_type application/octet-stream; gzip off; }
# For Gzip builds, swap ".br" → ".gz" and "br" → "gzip".
```

### Can't change the server config?

Enable **Player Settings → Publishing Settings → Decompression Fallback**. Unity
embeds the JS decompressor and drops the `.br`/`.gz` suffixes, so any static host
works — but you keep the slow first load. Prefer the server headers when you can.

> Only if you *also* see `SharedArrayBuffer is not defined` (threaded WebGL
> builds): add `Cross-Origin-Opener-Policy: same-origin` and
> `Cross-Origin-Embedder-Policy: credentialless`. Standard image-tracking builds
> don't need these.

For Unity's per-version reference, see
[Unity's WebGL server-configuration samples](https://docs.unity3d.com/Manual/webgl-server-configuration-code-samples.html).

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
