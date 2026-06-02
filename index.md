---
layout: home

hero:
  name: WebAR Image Tracker
  text: Augmented reality in the mobile browser
  tagline: >-
    Point a phone's browser at a printed image and watch your Unity content lock
    onto it — on iOS Safari and Android Chrome. No app, no native SDK, no WebXR.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Get it on the Unity Asset Store
      link: https://assetstore.unity.com/packages/slug/384314

features:
  - icon: 🍎
    title: Reaches iOS where WebXR can't
    details: >-
      iOS Safari has no WebXR image tracking. WebAR uses computer-vision
      tracking (mind-ar-js on TensorFlow.js), so it works on iOS Safari and
      Android Chrome alike.
  - icon: 🎮
    title: Author entirely in Unity
    details: >-
      Model, animate, light, and script in the editor you know. Content sits at
      real-world metric scale — a 30 cm model shows up 30 cm on the marker.
  - icon: 🎯
    title: Simultaneous multi-target
    details: >-
      Track several printed images at once, each anchoring its own content with
      the same proven stabilisation pipeline.
  - icon: 🎚️
    title: One slider to tune it
    details: >-
      A single Tracking Stability slider drives the whole pose pipeline, with an
      on-device panel to tune it live on the phone.
  - icon: 🛠️
    title: In-editor marker compiler
    details: >-
      Drop a source image; the plugin compiles a tracking marker, scores its
      trackability, and drops it back into your project — no command line.
  - icon: 📦
    title: Self-hosted, one-click setup
    details: >-
      mind-ar-js and three.js ship bundled (no CDN). GameObject ▸ WebAR ▸
      Controller builds the scene rig in a click.
---
