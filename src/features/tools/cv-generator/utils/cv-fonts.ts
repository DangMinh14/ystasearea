/**
 * Font system for the CV Generator.
 *
 * Both the on-screen preview and the print/PDF output render the same DOM,
 * so a single Google-Fonts <link> per family is all we need — the browser
 * uses it for screen and for the print iframe alike.
 */

export type CvFontId = 'inter' | 'roboto' | 'open-sans'

export type CvFontMeta = {
  id: CvFontId
  label: string
  cssFamily: string
  googleFontsUrl: string
}

export const cvFontRegistry: Record<CvFontId, CvFontMeta> = {
  inter: {
    id: 'inter',
    label: 'Inter',
    cssFamily: 'Inter, "Segoe UI", Arial, sans-serif',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
  },
  roboto: {
    id: 'roboto',
    label: 'Roboto',
    cssFamily: 'Roboto, "Segoe UI", Arial, sans-serif',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  },
  'open-sans': {
    id: 'open-sans',
    label: 'Open Sans',
    cssFamily: '"Open Sans", "Segoe UI", Arial, sans-serif',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
  },
}

export const cvFontList: CvFontMeta[] = Object.values(cvFontRegistry)

export const defaultCvFont: CvFontId = 'inter'

export const isCvFontId = (value: unknown): value is CvFontId =>
  typeof value === 'string' && value in cvFontRegistry

// Track which fonts have been loaded to avoid duplicate <link> tags.
const loadedFonts = new Set<CvFontId>()

/**
 * Inject a Google Fonts <link> tag into the document head.
 * Safe to call repeatedly — only inserts once per font.
 */
export const loadCvFont = (fontId: CvFontId): void => {
  if (loadedFonts.has(fontId)) {
    return
  }

  const meta = cvFontRegistry[fontId]
  if (!meta) {
    return
  }

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = meta.googleFontsUrl
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
  loadedFonts.add(fontId)
}

/** Resolve the CSS font-family stack for a font ID, falling back to Inter. */
export const getCssFontFamily = (fontId: CvFontId): string =>
  cvFontRegistry[fontId]?.cssFamily ?? cvFontRegistry.inter.cssFamily
