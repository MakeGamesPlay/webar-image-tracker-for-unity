---
description: What the bundled WebGL template ships, and what to preserve if you fork it.
---

# Custom WebGL Templates

The bundled **WebARTemplate** (`Assets/WebGLTemplates/WebARTemplate/`) ships
everything a working WebAR build needs: the mind-ar-js + three.js bundles, the
JS bridge glue, the import-map declarations, the iOS motion-permission grab, and
the loading / error overlay.

You can fork it for custom branding or a custom launch screen — but a few pieces
are load-bearing, and removing them degrades tracking in non-obvious ways.

## iOS motion-permission grab (required)

iOS Safari requires `DeviceMotionEvent.requestPermission()` to be called from a
**user-gesture handler** before the page can read the gyroscope or
accelerometer. Without it, the motion-adaptive filter relaxation that prevents
close-hold drag won't engage on iOS — tracking still works, but content feels
draggy during motion.

Replicate the bundled template's pattern in your `index.html`:

```javascript
document.addEventListener('click', async () => {
    if (typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function') {
        try { await DeviceMotionEvent.requestPermission(); }
        catch { /* user denied or non-iOS browser */ }
    }
}, { once: true });
```

## Video element CSS

The mind-ar `<video>` element the tracker reads from must render its first frame
to start producing pose matrices. **iOS Safari's autoplay policy freezes any
video that is `visibility: hidden`, `display: none`, or sized to 1×1** — the
camera stream pauses after one frame and the tracker waits forever.

Hide the mind-ar container with **`opacity: 0`** plus `pointer-events: none`
(visible to the browser's autoplay heuristics, invisible to the user), pushed
behind Unity's opaque canvas. Do **not** switch to `visibility: hidden` or
`display: none`.

## Optional: hold content behind a loading screen

If your template has a custom loading, splash, or onboarding flow, keep tracked
content hidden until it finishes. On **WebARTrackedRoot**, enable **Start Content
Locked**; from your template's JavaScript, release it when your overlay
dismisses:

```javascript
unityInstance.SendMessage('WebARBridge', 'OnSetContentLocked', 'false');
```

Content stays hidden until that message arrives, even if tracking is acquired
earlier.

## Optional: the on-device tuning panel

The runtime tuning overlay (Stability slider, distance picker, advanced fields,
live telemetry) is driven by the **Show On-Device Tuning Panel** toggle on
WebARTrackedRoot — no template changes needed. Tuned values copy out as JSON and
paste back into the Inspector. See
[Tracking Quality & Tuning](tracking-quality.md#the-on-device-tuning-panel).

## Bundled dependencies

mind-ar-js and three.js are **self-hosted** in the template's `TemplateData/`
rather than loaded from a CDN. This removes an entire class of
"works-here-not-there" failures: blocked CDNs, tracking-protection false
positives, corporate firewalls, cold-cache timeouts on slow mobile networks, and
Firefox-specific module-import quirks.

The version-pinned bundle files are:

| File | Purpose |
|------|---------|
| `three.module.js` | three.js core (pinned to 0.147.0 — mind-ar 1.2.5 imports `sRGBEncoding`, removed in three r152). |
| `CSS3DRenderer.js` | the only three.js addon mind-ar imports. |
| `mindar-image-three.prod.js` | mind-ar entry point. |
| `controller-*.js` | mind-ar's tracker code (the largest chunk, ~2 MB). |
| `ui-*.js` | mind-ar's internal UI chunk. |

> **Keep all of these together.** A missing Rollup-hashed chunk (the `*-HASH.js`
> files) makes Firefox hang silently on module load. Unity copies everything under
> `TemplateData/` to the build output automatically — don't add `.meta` exclusions
> that drop them.
>
> **Upgrading mind-ar or three.js** means re-downloading every file in the table;
> the `*-HASH.js` chunk names change with each mind-ar release.
