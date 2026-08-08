import { defineConfig } from 'vitepress'

// Docs source = repo root. README.md and SUMMARY.md are kept for GitHub /
// (legacy GitBook) but excluded from the built site; index.md is the home page.
export default defineConfig({
  title: 'WebAR Image Tracker for Unity',
  description:
    'Image-target augmented reality for Unity WebGL. Runs in the browser on iOS Safari, Android Chrome, and desktop. No app install required.',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md'],

  // GitHub Pages project site - assets resolve under the repo path.
  // Remove (or set to '/') if the site moves to a custom domain.
  base: '/webar-image-tracker-for-unity/',

  // Keep the first deploy green even if an anchor link is imperfect. Once the
  // site builds cleanly, flip this to false to catch genuinely broken links.
  ignoreDeadLinks: true,

  head: [
    ['meta', { name: 'theme-color', content: '#3a7bd5' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'WebAR Image Tracker for Unity' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Image-target AR in the browser. iOS Safari, Android Chrome, and desktop. No app install required.',
      },
    ],
  ],

  themeConfig: {
    // Brand wordmark in the nav bar, from the MakeGamesPlay brand assets.
    // PNG rather than SVG because no vector wordmark exists; the source is
    // 1074x134, downscaled to 769x96 for 4x headroom over the 24px nav height.
    //   makegamesplay-black.png → LIGHT theme (dark wordmark on a light bar)
    //   makegamesplay-white.png → DARK theme  (white wordmark on a dark bar)
    logo: {
      light: '/makegamesplay-black.png',
      dark: '/makegamesplay-white.png',
      alt: 'MakeGamesPlay',
    },
    siteTitle: 'WebAR Image Tracker',

    nav: [
      {
        text: 'Guide',
        link: '/getting-started',
        activeMatch: '/(getting-started|creating-markers|multi-target|testing-on-device|deploying)',
      },
      {
        text: 'Reference',
        link: '/components',
        activeMatch: '/(components|tracking-quality|runtime-api|browser-support)',
      },
      { text: 'Asset Store', link: 'https://assetstore.unity.com/packages/slug/384314' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Creating Markers', link: '/creating-markers' },
          { text: 'Multi-Target Tracking', link: '/multi-target' },
          { text: 'Testing on a Device', link: '/testing-on-device' },
          { text: 'Deploying Your Build', link: '/deploying' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Components Reference', link: '/components' },
          { text: 'Tracking Quality & Tuning', link: '/tracking-quality' },
          { text: 'Runtime API', link: '/runtime-api' },
          { text: 'Browser & Device Support', link: '/browser-support' },
        ],
      },
      {
        text: 'Help',
        items: [
          { text: 'Troubleshooting', link: '/troubleshooting' },
          { text: 'Custom WebGL Templates', link: '/custom-templates' },
        ],
      },
    ],

    search: { provider: 'local' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MakeGamesPlay/webar-image-tracker-for-unity' },
    ],

    editLink: {
      pattern:
        'https://github.com/MakeGamesPlay/webar-image-tracker-for-unity/edit/main/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Built on mind-ar-js, three.js, and TensorFlow.js.',
      copyright: '© <a href="https://makegamesplay.games">MakeGamesPlay</a>',
    },
  },
})
