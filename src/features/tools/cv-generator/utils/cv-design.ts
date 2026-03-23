export type Rgb = [number, number, number]

export type CvThemePalette = {
  primary: string
  text: string
  muted: string
  divider: string
}

export type CvTemplateDesign = {
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
  }
  fontSizes: {
    h1: number
    h2: number
    h3: number
    body: number
    meta: number
  }
  lineHeight: {
    tight: number
    normal: number
    loose: number
  }
  columns?: {
    leftRatio: number
    rightRatio: number
    gap: number
  }
}

export const cvThemePresets = {
  blue: '#2563eb',
  green: '#0f766e',
  red: '#be123c',
  black: '#111827',
  gray: '#4b5563',
} as const

const baseTheme: Omit<CvThemePalette, 'primary'> = {
  text: '#1f2937',
  muted: '#4b5563',
  divider: '#dbe3ee',
}

export const resolveCvTheme = (primaryColor: string): CvThemePalette => ({
  primary: primaryColor || cvThemePresets.blue,
  ...baseTheme,
})

export const cvTemplateDesign: Record<'classic' | 'modern' | 'minimal', CvTemplateDesign> = {
  classic: {
    spacing: { xs: 2, sm: 4, md: 8, lg: 8 },
    fontSizes: { h1: 21.5, h2: 13.4, h3: 11.2, body: 10.6, meta: 9.4 },
    lineHeight: { tight: 1.18, normal: 1.35, loose: 1.45 },
  },
  modern: {
    spacing: { xs: 2, sm: 4, md: 8, lg: 8 },
    fontSizes: { h1: 22, h2: 13.2, h3: 11, body: 10.4, meta: 9.2 },
    lineHeight: { tight: 1.2, normal: 1.36, loose: 1.46 },
    columns: {
      leftRatio: 0.33,
      rightRatio: 0.67,
      gap: 8,
    },
  },
  minimal: {
    spacing: { xs: 2, sm: 4, md: 8, lg: 8 },
    fontSizes: { h1: 20.2, h2: 12.8, h3: 10.8, body: 10.2, meta: 9.1 },
    lineHeight: { tight: 1.16, normal: 1.33, loose: 1.42 },
  },
}

const toHexParts = (value: string): Rgb => {
  const cleaned = value.replace('#', '').trim()
  const normalized = cleaned.length === 3 ? cleaned.split('').map((part) => `${part}${part}`).join('') : cleaned

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return [37, 99, 235]
  }

  const parsed = Number.parseInt(normalized, 16)
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255]
}

export const themeHexToRgb = (hex: string): Rgb => toHexParts(hex)
