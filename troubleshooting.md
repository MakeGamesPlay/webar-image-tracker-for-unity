---
description: Common first-build issues and how to clear them.
---

# Troubleshooting

> Run **`Tools ▸ WebAR Image Tracker for Unity ▸ Compatibility Audit`** first.
> It checks the WebGL template, render pipeline, Input System, runtime files,
> and build target, and catches most of the issues below before a deploy.

## The camera permission never prompts

The page is loading over HTTP. `getUserMedia` needs a secure context (HTTPS,
or `localhost`). Redeploy over HTTPS; GitHub Pages, Netlify, Cloudflare Pages,
and [WebGL Build Host](testing-on-device.md) all work.

## Black screen / only the skybox, no camera feed

* The WebAR Controller is missing, **Render Camera Feed** is off, or
  **Tracker Camera** doesn't point at the camera in use.
  `GameObject ▸ WebAR ▸ Controller` rebuilds the rig.
* The camera's Clear Flags are set to Skybox. Solid Color is required so the
  feed shows; the Controller configures this on rigs it creates.
* An extreme near/far clip ratio can collapse depth precision and let other
  geometry win over the background quad. The Controller's camera uses
  0.01-1000.

## Pink / magenta content (Built-in or HDRP)

URP materials render magenta on other pipelines. The camera feed and reference
marker auto-resolve a fitting Unlit shader; project content needs materials
authored for the active pipeline. A custom feed material goes in the
controller's **Background Material** slot.

## Content stutters the first time it appears

The GPU is compiling the content's shaders at first render. Enable **Prewarm
Content** on the controller; scene-authored content then compiles during
startup. Content spawned from code should be prewarmed by the spawning code.

## Content is hidden even though tracking works

**Start Content Locked** is on and nothing called
`WebARTrackedRoot.Instance.SetContentLocked(false)`, or the content sits on
the **Feed Layer** used by Content-Only post-processing.

## Shadows look low-res or blocky on AR content

AR content is sub-metre, but URP spreads its shadow map across the full
Shadow Distance (default 50 m, 4 cascades), leaving few texels for a small
model. In the **URP Asset → Shadows**, lower **Max Distance** to ~1 m and set
**Cascade Count** to 1. Keep Soft Shadows on.

## Build loads slowly or doesn't load at all

**Symptom:** a very slow first load (20-30 s), or a `.wasm.br` parse error.
Which one depends on whether **Decompression Fallback** is on (slow) or off
(hard fail).

**Cause:** Unity ships its large files pre-compressed (`*.wasm.br`, `*.js.br`,
`*.data.br`, or `*.gz`). Without a `Content-Encoding` header the browser
can't decode them natively, and without the real `Content-Type` it can't
stream-compile the WebAssembly.

**Fix:** serve the pre-compressed files with both headers.
[WebGL Build Host](testing-on-device.md) does this locally; the blocks below
are for production servers. See [Deploying Your Build](deploying.md) for the
full checklist.

### Apache (`.htaccess`)

Needs `mod_mime`; place alongside `index.html`:

```apache
<IfModule mod_mime.c>
  # .br / .gz are content-encodings, not file types. Apache maps .br to the
  # Breton language by default, so clear the stray associations first.
  RemoveType     .br .gz
  RemoveLanguage .br

  AddEncoding br   .br
  AddEncoding gzip .gz

  AddType application/wasm         .wasm
  AddType application/javascript   .js
  AddType application/octet-stream .data
</IfModule>

# Keep mod_deflate off already-compressed files.
<IfModule mod_deflate.c>
  SetEnvIfNoCase Request_URI "\.(br|gz)$" no-gzip dont-vary
</IfModule>
```

Without `.htaccess` access, the same lines go in the vhost or `apache2.conf`
inside the build's `<Directory>` block.

### nginx

```nginx
location ~ \.wasm\.br$ { add_header Content-Encoding br; default_type application/wasm;         gzip off; }
location ~ \.js\.br$   { add_header Content-Encoding br; default_type application/javascript;   gzip off; }
location ~ \.data\.br$ { add_header Content-Encoding br; default_type application/octet-stream; gzip off; }
# For Gzip builds, swap ".br" for ".gz" and "br" for "gzip".
```

### No control over the server?

Enable **Player Settings → Publishing Settings → Decompression Fallback** and
rebuild. Any static host then works, at the cost of the slower first load.

> `SharedArrayBuffer is not defined` only appears on threaded WebGL builds and
> needs COOP/COEP headers. Standard image-tracking builds don't use threads.

Unity's own reference:
[WebGL server-configuration samples](https://docs.unity3d.com/Manual/webgl-server-configuration-code-samples.html).

## Can't select WebARTemplate in Player Settings

Switch the build target to WebGL first; templates only appear for the active
platform.

## Red banner: "unsupported because X"

A capability check failed. The tag (`webgl2`, `float-textures`, `getusermedia`,
`tracker-init`) names which requirement the browser or device is missing. See
[Browser & Device Support](browser-support.md).

## "Tracker failed to start after N attempts"

The cold-start retry ran out, usually after a camera prompt was dismissed
mid-flow or the camera is held by another tab. Reload and try again. If it
repeats on one device, send a diagnostics-overlay **Copy** snapshot.

## Red banner: "WebAR bundle failed to load (timed out)"

Confirm all the self-hosted bundle files are present in the deployed build's
`TemplateData/` folder. A missing Rollup-hashed chunk makes Firefox hang
silently; the timeout surfaces it. The file list and re-download URLs are in
[Custom WebGL Templates](custom-templates.md#bundled-dependencies).

## Camera freezes on the first frame (iOS Safari)

A custom WebGL template hid the tracker's `<video>` element with
`visibility: hidden`, `display: none`, or a 1×1 size; iOS Safari's autoplay
policy freezes such videos. Use `opacity: 0`, as the bundled template does.
See [Custom WebGL Templates](custom-templates.md#video-element-css).

## Camera feed is black but content tracks (Content-Only post)

The feed renders black behind your content when a WebAR Controller uses
**Content-Only** post-processing and URP **Alpha Processing** is off on the
quality tier the build ships. Content-Only composites the content over the
feed using the content render texture's alpha; without Alpha Processing, post
clears that alpha and the composite paints over the feed.

The trap: a project with several URP quality tiers (e.g. Mobile + PC) builds
with the URP asset of its platform's **default Quality level** (Project
Settings → Quality), which is often a *different* tier than the one active in
the Editor. So the Editor looks correct while the deployed build is black.

Run **Tools ▸ WebAR Image Tracker for Unity ▸ Compatibility Audit** - it checks
Alpha Processing on every URP tier and the one-click fix enables it on all of
them. Or switch the affected backend's Graphics Profile to **Full View**, which
doesn't use the alpha composite and works regardless.

On **Unity 2022.3 (URP 14)** there is no Alpha Processing toggle at all - the
post-process alpha output Content-Only relies on arrived in URP 17 (Unity 6).
The plugin detects this and renders **Full View** automatically, so the feed
shows instead of going black; the audit and the Controller Inspector note the
fallback. For content-only post, use Unity 6 (URP 17 or newer).

## Content jitters at rest, or drags during motion

Tuning, not a defect: raise **Tracking Stability** for less rest jitter, lower
it for snappier motion, pick the right **Viewing Distance**, and confirm the
motion permission was granted on first tap. See
[Tracking Quality & Tuning](tracking-quality.md).

## Rotation feels stepped though position is smooth

**Gyro Rotation Anchor** is off (it's on by default, in the Debug foldout) or
motion permission was declined. Reload and accept the motion prompt.

## Content swings the wrong way during a brief dropout

Expected behaviour is marker-anchored carry through the dropout. If it
consistently swings the wrong way on one specific device, send a
diagnostics-overlay **Copy** snapshot so the device can be investigated.

## A "previous session ended unexpectedly" banner appears

The page crashed last session and the template kept the crash log. The banner
only shows when **Show Crash Recovery Banner** (Debug foldout) is enabled or
with `?debug=1` on the URL. Its **Copy Crash Log** button captures the log
for a report.

## "This scene references N different .mind files"

One marker file loads per scene. Compile all images into one multi-target
marker, assign it to one tracker, and give the others a **Target Index** with
a blank Target File. See [Multi-Target Tracking](multi-target.md).
