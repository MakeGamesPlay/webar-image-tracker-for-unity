// Click-to-zoom for images in page content, so things like the demo card's QR
// code can be viewed at full size without leaving the page.
//
// Deliberately dependency-free, and deliberately a single delegated listener on
// document rather than per-image bindings: nothing needs re-attaching when the
// router swaps pages, which is the usual source of "zoom stops working after
// you navigate" bugs.
export function setupImageZoom() {
  if (typeof document === 'undefined') return // no-op during SSR

  let overlay = null

  function onKey(e) {
    if (e.key === 'Escape') close()
  }

  function close() {
    if (!overlay) return
    const el = overlay
    overlay = null
    el.classList.remove('is-open')
    document.removeEventListener('keydown', onKey)
    // Let the fade finish before detaching.
    setTimeout(() => el.remove(), 180)
  }

  function open(src, alt) {
    close()
    overlay = document.createElement('div')
    overlay.className = 'wa-zoom'
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')
    overlay.setAttribute('aria-label', alt ? alt + ' (enlarged)' : 'Enlarged image')

    const img = document.createElement('img')
    img.src = src
    img.alt = alt || ''
    overlay.appendChild(img)

    overlay.addEventListener('click', close)
    document.body.appendChild(overlay)
    requestAnimationFrame(() => overlay && overlay.classList.add('is-open'))
    document.addEventListener('keydown', onKey)
  }

  document.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return
    const img = e.target.closest('.vp-doc img')
    if (!img) return
    if (img.closest('a')) return // an image that is already a link keeps its link
    open(img.currentSrc || img.src, img.alt)
  })
}
