import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomeVideo from './HomeVideo.vue'
import './custom.css'
import { setupImageZoom } from './imageZoom'

// The trailer needs to sit between the hero and the feature grid. Markdown
// written into index.md renders *after* the features on a `layout: home` page,
// so the only way to place it earlier is the default theme's
// `home-features-before` slot, which needs a Layout wrapper like this.
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-before': () => h(HomeVideo),
    })
  },
  enhanceApp() {
    setupImageZoom()
  },
}
