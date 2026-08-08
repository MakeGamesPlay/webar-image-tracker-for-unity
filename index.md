---
layout: home

hero:
  name: WebAR Image Tracker
  text: Augmented reality in the browser
  tagline: >-
    Point a device's camera at a printed image and your Unity content appears
    on it. Runs in the browser on iOS, Android, and desktop. No app install
    required.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Get it on the Unity Asset Store
      link: https://assetstore.unity.com/packages/slug/384314

features:
  - icon: 🌐
    title: Runs in the browser
    details: >-
      Computer-vision tracking (mind-ar-js on TensorFlow.js) on a plain HTTPS
      page. Share a URL and it works on iOS, Android, and desktop browsers with
      a camera.
  - icon: 🎮
    title: Author entirely in Unity
    details: >-
      Model, animate, light, and script in the editor you know. Content sits at
      real-world metric scale. A 30 cm model shows up 30 cm on the marker.
  - icon: 🧭
    title: Gyro-fused tracking
    details: >-
      Rotation runs at display rate on the gyroscope, corrected by the tracker.
      Brief dropouts carry content on the marker and re-sync without a pop.
  - icon: 🎯
    title: Simultaneous multi-target
    details: >-
      Track several printed images at once, each anchoring its own content with
      the same stabilisation pipeline.
  - icon: 🎚️
    title: One slider to tune it
    details: >-
      A single Tracking Stability slider drives the whole pose pipeline, with an
      on-device panel to tune it live.
  - icon: 📦
    title: Self-hosted, one-click setup
    details: >-
      mind-ar-js and three.js ship bundled (no CDN). GameObject ▸ WebAR ▸
      Controller builds the scene rig in a click.
---

## See it in action

<div class="wa-video">
  <iframe
    src="https://www.youtube-nocookie.com/embed/IdrHXZpX-Do"
    title="WebAR Image Tracker for Unity | Augmented reality on the web, no app or WebXR"
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
    allowfullscreen
  ></iframe>
</div>

<style>
/* Unscoped on purpose: one specific class, so it can't leak into other pages. */
.wa-video {
  position: relative;
  width: 100%;
  max-width: 960px;
  margin: 0 auto 3rem;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.wa-video iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
