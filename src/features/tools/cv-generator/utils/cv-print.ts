import cvCss from '../cv-generator.css?inline'
import { buildPrintCss } from './cv-print-styles'

/**
 * Export the CV by printing the live preview DOM.
 *
 * Rather than re-implementing layout in a PDF library, we clone the rendered
 * `.cv-preview-page` element into an isolated, same-origin iframe alongside the
 * exact same stylesheet the preview uses, then call the browser's native print.
 * The result is pixel-faithful to the preview, keeps selectable (ATS-friendly)
 * text, and gets real fonts + page breaks for free.
 */

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const readMargin = (style: CSSStyleDeclaration, name: string, fallback: string): string => {
  const value = style.getPropertyValue(name).trim()
  return value || fallback
}

const nextFrame = (): Promise<void> =>
  new Promise((resolve) => window.requestAnimationFrame(() => resolve()))

export const printCv = async (contentId: string, fileName: string): Promise<void> => {
  const source = document.getElementById(contentId)
  if (!source) {
    return
  }

  // Page margins live on the preview element as CSS custom properties; reuse
  // them for `@page` so the printed margins repeat on every page.
  const computed = getComputedStyle(source)
  const margins = {
    top: readMargin(computed, '--cv-page-margin-top', '15mm'),
    right: readMargin(computed, '--cv-page-margin-x', '15mm'),
    bottom: readMargin(computed, '--cv-page-margin-bottom', '12mm'),
    left: readMargin(computed, '--cv-page-margin-x', '15mm'),
  }

  // Carry the Google-Fonts <link> tags over so the chosen family is available
  // inside the iframe document too.
  const fontLinks = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>(
      'link[href*="fonts.googleapis"], link[href*="fonts.gstatic"]'
    )
  )
    .map((link) => link.outerHTML)
    .join('\n')

  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  // A real A4-ish width so width-based layout (e.g. modern columns) resolves,
  // but visually hidden and out of flow.
  iframe.style.cssText =
    'position:fixed;left:-9999px;top:0;width:794px;height:1123px;border:0;visibility:hidden;'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow?.document
  if (!doc) {
    iframe.remove()
    return
  }

  const title = escapeHtml((fileName || 'resume').trim() || 'resume')

  doc.open()
  doc.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>` +
      `${fontLinks}` +
      `<style>${cvCss}</style>` +
      `<style>${buildPrintCss(margins)}</style>` +
      `</head><body>${source.outerHTML}</body></html>`
  )
  doc.close()

  const win = iframe.contentWindow
  if (!win) {
    iframe.remove()
    return
  }

  // Wait for fonts to settle so text metrics (and thus page breaks) are stable.
  try {
    await doc.fonts.ready
  } catch {
    // Older engines without the Font Loading API — proceed anyway.
  }
  await nextFrame()

  let cleaned = false
  const cleanup = () => {
    if (cleaned) {
      return
    }
    cleaned = true
    iframe.remove()
  }

  win.addEventListener('afterprint', cleanup)
  // Safety net in case `afterprint` never fires (some browsers / cancel paths).
  window.setTimeout(cleanup, 60_000)

  win.focus()
  win.print()
}
