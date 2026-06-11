---
description: What the bundled WebGL template ships, and what to preserve if you fork it.
---

# Custom WebGL Templates

The bundled **WebARTemplate** (`Assets/WebGLTemplates/WebARTemplate/`) ships
everything a working WebAR build needs: the mind-ar-js + three.js bundles, the
JS bridge glue, the import-map declarations, the motion-permission grab, and
the loading / error overlay.

You can fork it for custom branding or a custom launch screen - but a few pieces
are load-bearing, and removing them degrades tracking in non-obvious ways.

## Motion-permission grab (required)

Mobile browsers gate motion-sensor access behind a permission that must be
requested from a **user-gesture handler** - the prompt appears on iOS and
Android. iOS Safari additionally requires the explicit
`DeviceMotionEvent.requestPermission()` call shown below (a no-op on browsers
that don't implement it). Without the grant, the motion-adaptive filter
relaxation won't engage, gyro-fused rotation falls back to tracker-rate
updates, and content freezes to the screen during brief dropouts instead of
staying marker-anchored - tracking still works, but it loses most of its
polish.

Replicate the bundled template's pattern in your `index.html`:

```javascript
document.addEventListener('click', async () => {
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function') {
        try { await DeviceMotionEvent.requestPermission(); }
        catch { /* user denied or browser without the API */ }
    }
}, { once: true });
```

## Video element CSS

The mind-ar `<video>` element the tracker reads from must render its first frame
to start producing pose matrices. **iOS Safari's autoplay policy freezes any
video that is `visibility: hidden`, `display: none`, or sized to 1×1** - the
camera stream pauses after one frame and the tracker waits forever.

Hide the mind-ar container with **`opacity: 0`** plus `pointer-events: none`
(visible to the browser's autoplay heuristics, invisible to the user), pushed
behind Unity's opaque canvas. Do **not** switch to `visibility: hidden` or
`display: none`.

## Optional: hold content behind a loading screen

If your template has a custom loading, splash, or onboarding flow, keep tracked
content hidden until it finishes. On the **WebAR Controller**, enable **Start
Content Locked**; from your template's JavaScript, release it when your overlay
dismisses:

```javascript
unityInstance.SendMessage('WebARBridge', 'OnSetContentLocked', 'false');
```

Content stays hidden until that message arrives, even if tracking is acquired
earlier.

## Optional: the on-device overlay

The runtime overlay (Stability slider, distance picker, advanced fields, live
telemetry, Copy Logs) is driven by the **Show Diagnostics Overlay** toggle in
the WebAR Controller's Debug foldout - no template changes needed. See
[Tracking Quality & Tuning](tracking-quality.md#the-on-device-overlay).

## Bundled dependencies

mind-ar-js and three.js are **self-hosted** in the template's `TemplateData/`
rather than loaded from a CDN. This removes an entire class of
"works-here-not-there" failures: blocked CDNs, tracking-protection false
positives, corporate firewalls, cold-cache timeouts on slow mobile networks, and
Firefox-specific module-import quirks.

The version-pinned bundle files, with their upstream sources for re-download:

| File | Purpose | Source |
|------|---------|--------|
| `three.module.js` | three.js core (pinned to 0.147.0 - mind-ar 1.2.5 imports `sRGBEncoding`, removed in three r152). | `cdn.jsdelivr.net/npm/three@0.147.0/build/three.module.js` |
| `CSS3DRenderer.js` | the only three.js addon mind-ar imports. | `cdn.jsdelivr.net/npm/three@0.147.0/examples/jsm/renderers/CSS3DRenderer.js` |
| `mindar-image-three.prod.js` | mind-ar entry point. | `cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js` |
| `controller-mGt1s8dJ.js` | mind-ar's tracker code (the largest chunk, ~2 MB). | `cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/controller-mGt1s8dJ.js` |
| `ui-fBadYuor.js` | mind-ar's internal UI chunk. | `cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/ui-fBadYuor.js` |

> **Keep all of these together.** A missing Rollup-hashed chunk (the `*-HASH.js`
> files) makes Firefox hang silently on module load. Unity copies everything under
> `TemplateData/` to the build output automatically - don't add `.meta` exclusions
> that drop them.
>
> **Upgrading mind-ar or three.js** means re-downloading every file in the table;
> the `*-HASH.js` chunk names change with each mind-ar release.
