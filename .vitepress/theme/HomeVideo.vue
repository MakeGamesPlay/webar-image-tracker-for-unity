<template>
  <div class="wa-video-outer">
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
  </div>
</template>

<style scoped>
/* Padding mirrors VitePress's own container steps so the frame lines up with
   the hero and the feature grid above and below it. */
.wa-video-outer {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 16px;
}

.wa-video {
  position: relative;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
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

@media (min-width: 640px) {
  .wa-video-outer {
    padding: 0 48px 24px;
  }
}

@media (min-width: 960px) {
  .wa-video-outer {
    padding: 0 64px 32px;
  }
}
</style>
