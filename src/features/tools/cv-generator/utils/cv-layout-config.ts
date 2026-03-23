import type { CvTemplate } from './cv-model'
import { cvTemplateDesign, resolveCvTheme, type CvThemePalette, type CvTemplateDesign } from './cv-design'

/**
 * Shared layout config consumed by both the HTML preview (via CSS variables)
 * and the jsPDF renderer. All spatial values are in mm so they translate
 * directly to both CSS `mm` units and jsPDF coordinates.
 */
export type CvPageConfig = {
  width: number   // mm
  height: number  // mm
  marginTop: number
  marginBottom: number
  marginX: number
}

export type CvTypographyConfig = {
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
}

export type CvSpacingConfig = {
  xs: number  // mm
  sm: number  // mm
  md: number  // mm
  lg: number  // mm
}

export type CvLayoutConfig = {
  template: CvTemplate
  page: CvPageConfig
  typography: CvTypographyConfig
  spacing: CvSpacingConfig
  theme: CvThemePalette
  columns?: {
    leftRatio: number
    rightRatio: number
    gap: number // mm
  }
  withSectionDividers: boolean
}

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

const pageDefaults: Record<CvTemplate, Omit<CvPageConfig, 'width' | 'height'>> = {
  modern: { marginTop: 15, marginBottom: 12, marginX: 15 },
  classic: { marginTop: 15, marginBottom: 12, marginX: 15 },
  minimal: { marginTop: 15, marginBottom: 12, marginX: 17 },
}

/**
 * Convert the design-token spacing (px at 96dpi) into mm.
 * 1px ≈ 0.2646mm at 96dpi.  We round to 2 decimals.
 */
const pxToMm = (px: number): number => Math.round(px * 0.2646 * 100) / 100

const buildSpacing = (design: CvTemplateDesign): CvSpacingConfig => ({
  xs: pxToMm(design.spacing.xs),
  sm: pxToMm(design.spacing.sm),
  md: pxToMm(design.spacing.md),
  lg: pxToMm(design.spacing.lg),
})

/**
 * Font sizes stay in pt — they are used identically by both CSS (`font-size: Xpt`)
 * and jsPDF (`setFontSize(X)`).  The design tokens are already in pt-like values.
 */
const buildTypography = (design: CvTemplateDesign): CvTypographyConfig => ({
  fontSizes: { ...design.fontSizes },
  lineHeight: { ...design.lineHeight },
})

export const createLayoutConfig = (
  template: CvTemplate,
  themeColor: string,
): CvLayoutConfig => {
  const design = cvTemplateDesign[template]
  const theme = resolveCvTheme(themeColor)

  return {
    template,
    page: {
      width: A4_WIDTH_MM,
      height: A4_HEIGHT_MM,
      ...pageDefaults[template],
    },
    typography: buildTypography(design),
    spacing: buildSpacing(design),
    theme,
    columns: design.columns
      ? {
          leftRatio: design.columns.leftRatio,
          rightRatio: design.columns.rightRatio,
          gap: pxToMm(design.columns.gap),
        }
      : undefined,
    withSectionDividers: template !== 'minimal',
  }
}

/**
 * Helper: convert a CvLayoutConfig into a CSS custom-property map
 * that can be applied via `:style` binding on the preview container.
 */
export const layoutConfigToCssVars = (
  cfg: CvLayoutConfig,
  fontFamilyCss: string,
): Record<string, string> => ({
  '--cv-primary': cfg.theme.primary,
  '--cv-text': cfg.theme.text,
  '--cv-muted': cfg.theme.muted,
  '--cv-divider': cfg.theme.divider,
  '--cv-font-family': fontFamilyCss,
  '--cv-page-width': `${cfg.page.width}mm`,
  '--cv-page-height': `${cfg.page.height}mm`,
  '--cv-page-margin-x': `${cfg.page.marginX}mm`,
  '--cv-page-margin-top': `${cfg.page.marginTop}mm`,
  '--cv-page-margin-bottom': `${cfg.page.marginBottom}mm`,
  '--cv-space-xs': `${cfg.spacing.xs}mm`,
  '--cv-space-sm': `${cfg.spacing.sm}mm`,
  '--cv-space-md': `${cfg.spacing.md}mm`,
  '--cv-space-lg': `${cfg.spacing.lg}mm`,
  '--cv-size-h1': `${cfg.typography.fontSizes.h1}pt`,
  '--cv-size-h2': `${cfg.typography.fontSizes.h2}pt`,
  '--cv-size-h3': `${cfg.typography.fontSizes.h3}pt`,
  '--cv-size-body': `${cfg.typography.fontSizes.body}pt`,
  '--cv-size-meta': `${cfg.typography.fontSizes.meta}pt`,
  '--cv-line-tight': `${cfg.typography.lineHeight.tight}`,
  '--cv-line-normal': `${cfg.typography.lineHeight.normal}`,
  '--cv-line-loose': `${cfg.typography.lineHeight.loose}`,
})
