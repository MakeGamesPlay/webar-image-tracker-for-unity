import { defineConfig } from 'vitepress'

// Docs source = repo root. README.md and SUMMARY.md are kept for GitHub /
// (legacy GitBook) but excluded from the built site; index.md is the home page.
export default defineConfig({
  title: 'WebAR Image Tracker for Unity',
  description:
    'Image-target augmented reality for Unity WebGL — runs in the mobile browser on iOS Safari and Android Chrome. No app, no ARKit, no ARCore, no WebXR.',
  lang: 'en-US',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md'],

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
          'Image-target AR in the mobile browser — iOS Safari + Android Chrome, no app, no WebXR.',
      },
    ],
  ],

  themeConfig: {
    // Brand wordmark in the nav bar. Drop the two files into .vitepress/public/
    // (SVG preferred — a wordmark stays crisp at any size):
    //   makegamesplay-black.svg  → shown in LIGHT theme (dark logo on light bar)
    //   makegamesplay-white.svg  → shown in DARK theme  (white logo on dark bar)
    // If your files are PNG, change the two extensions below to .png.
    logo: {
      light: '/makegamesplay-black.svg',
      dark: '/makegamesplay-white.svg',
      alt: 'MakeGamesPlay',
    },
    siteTitle: 'WebAR Image Tracker',

    nav: [
      {
        text: 'Guide',
        link: '/getting-started',
        activeMatch: '/(getting-started|creating-markers|multi-target|testing-on-device)',
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
