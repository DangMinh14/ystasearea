import type { Locale } from '../../../../content/translations'

/**
 * Font system for the CV Generator.
 *
 * - Preview uses Google Fonts loaded via <link> tags.
 * - PDF uses jsPDF built-in fonts for "safe" families and dynamically-fetched
 *   TTF fonts for Vietnamese support.
 */

export type CvFontId =
  | 'inter'
  | 'roboto'
  | 'open-sans'
  | 'noto-sans'
  | 'be-vietnam-pro'

export type CvFontMeta = {
  id: CvFontId
  label: string
  cssFamily: string
  googleFontsUrl: string
  /** If true, the font properly supports Vietnamese diacritics */
  vietnameseSupport: boolean
  /** jsPDF built-in font name, or null if we need to load a custom TTF */
  pdfBuiltIn: string | null
  /** Google Fonts CSS2 URL for fetching the actual TTF */
  ttfApiUrl: string
}

export const cvFontRegistry: Record<CvFontId, CvFontMeta> = {
  inter: {
    id: 'inter',
    label: 'Inter',
    cssFamily: 'Inter, "Segoe UI", Arial, sans-serif',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    vietnameseSupport: false,
    pdfBuiltIn: 'helvetica',
    ttfApiUrl: '',
  },
  roboto: {
    id: 'roboto',
    label: 'Roboto',
    cssFamily: 'Roboto, "Segoe UI", Arial, sans-serif',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
    vietnameseSupport: true,
    pdfBuiltIn: 'helvetica',
    ttfApiUrl:
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
  },
  'open-sans': {
    id: 'open-sans',
    label: 'Open Sans',
    cssFamily: '"Open Sans", "Segoe UI", Arial, sans-serif',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
    vietnameseSupport: false,
    pdfBuiltIn: 'helvetica',
    ttfApiUrl: '',
  },
  'noto-sans': {
    id: 'noto-sans',
    label: 'Noto Sans',
    cssFamily: '"Noto Sans", "Segoe UI", Arial, sans-serif',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700&display=swap',
    vietnameseSupport: true,
    pdfBuiltIn: null,
    ttfApiUrl:
      'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap',
  },
  'be-vietnam-pro': {
    id: 'be-vietnam-pro',
    label: 'Be Vietnam Pro',
    cssFamily: '"Be Vietnam Pro", "Segoe UI", Arial, sans-serif',
    googleFontsUrl:
      'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap',
    vietnameseSupport: true,
    pdfBuiltIn: null,
    ttfApiUrl:
      'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;700&display=swap',
  },
}

/** Fonts available per locale */
export const fontsByLocale: Record<Locale, CvFontId[]> = {
  en: ['inter', 'roboto', 'open-sans'],
  vi: ['be-vietnam-pro', 'noto-sans', 'roboto'],
}

/** Default font per locale */
export const defaultFontForLocale: Record<Locale, CvFontId> = {
  en: 'inter',
  vi: 'be-vietnam-pro',
}

// Track which fonts have been loaded to avoid duplicate <link> tags
const loadedFonts = new Set<CvFontId>()

/**
 * Dynamically inject a Google Fonts <link> tag into the document head.
 * Safe to call multiple times — only inserts once per font.
 */
export const loadCvFont = (fontId: CvFontId): void => {
  if (loadedFonts.has(fontId)) {
    return
  }

  const meta = cvFontRegistry[fontId]
  if (!meta?.googleFontsUrl) {
    return
  }

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = meta.googleFontsUrl
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
  loadedFonts.add(fontId)
}

/**
 * Get the CSS font-family string for a given font ID.
 */
export const getCssFontFamily = (fontId: CvFontId): string =>
  cvFontRegistry[fontId]?.cssFamily ?? cvFontRegistry.inter.cssFamily

/**
 * Determine the best jsPDF font name for a given font ID.
 * Returns the built-in name if available, otherwise falls back to helvetica.
 * Custom TTF registration is handled by registerPdfFont().
 */
export const getPdfFontName = (fontId: CvFontId): string =>
  cvFontRegistry[fontId]?.pdfBuiltIn ?? 'helvetica'

// Cache for fetched TTF data
const ttfCache = new Map<string, ArrayBuffer>()

/**
 * Fetch a TTF font from Google Fonts CSS2 API.
 * The CSS2 API returns a CSS file with @font-face rules containing URLs to
 * the actual font files. We parse the CSS to extract the TTF URL.
 */
const fetchTtfFromGoogleFonts = async (cssUrl: string): Promise<ArrayBuffer | null> => {
  if (ttfCache.has(cssUrl)) {
    return ttfCache.get(cssUrl)!
  }

  try {
    // Fetch the CSS with a user-agent that returns TTF format
    const cssResponse = await fetch(cssUrl, {
      headers: {
        // Google Fonts serves different formats based on user-agent.
        // Using a simple UA to get TTF format.
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    })

    const cssText = await cssResponse.text()

    // Extract the font URL from the CSS @font-face src
    const urlMatch = cssText.match(/url\(([^)]+)\)\s*format\(['"]?(?:truetype|woff2?)['"]?\)/)
      ?? cssText.match(/url\(([^)]+)\)/)

    if (!urlMatch?.[1]) {
      return null
    }

    const fontUrl = urlMatch[1].replace(/['"]/g, '')
    const fontResponse = await fetch(fontUrl)
    const buffer = await fontResponse.arrayBuffer()
    ttfCache.set(cssUrl, buffer)
    return buffer
  } catch (error) {
    console.error('Failed to fetch TTF font:', error)
    return null
  }
}

/**
 * Convert an ArrayBuffer to a base64 string.
 */
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Track which fonts have been registered in jsPDF
const registeredPdfFonts = new Set<string>()

/**
 * Register a custom font in jsPDF for Vietnamese support.
 * This fetches the TTF from Google Fonts and registers it via addFileToVFS/addFont.
 *
 * @returns The font name to use with doc.setFont(), or the built-in fallback.
 */
export const registerPdfFont = async (
  doc: import('jspdf').jsPDF,
  fontId: CvFontId,
): Promise<{ normal: string; bold: string }> => {
  const meta = cvFontRegistry[fontId]

  // If the font has a built-in equivalent, just use that
  if (meta.pdfBuiltIn) {
    return { normal: meta.pdfBuiltIn, bold: meta.pdfBuiltIn }
  }

  const vfsKey = `${fontId}.ttf`

  // Already registered in this doc instance
  if (registeredPdfFonts.has(vfsKey)) {
    return { normal: fontId, bold: fontId }
  }

  if (!meta.ttfApiUrl) {
    return { normal: 'helvetica', bold: 'helvetica' }
  }

  try {
    const buffer = await fetchTtfFromGoogleFonts(meta.ttfApiUrl)
    if (!buffer) {
      return { normal: 'helvetica', bold: 'helvetica' }
    }

    const base64 = arrayBufferToBase64(buffer)
    doc.addFileToVFS(vfsKey, base64)
    doc.addFont(vfsKey, fontId, 'normal')
    // For bold, we use the same font file and rely on faux-bold
    // (Google Fonts CSS API with wght@700 would give us a separate file,
    // but for simplicity we use a single weight and set fontStyle)
    registeredPdfFonts.add(vfsKey)

    return { normal: fontId, bold: fontId }
  } catch (error) {
    console.error(`Failed to register PDF font ${fontId}:`, error)
    return { normal: 'helvetica', bold: 'helvetica' }
  }
}
