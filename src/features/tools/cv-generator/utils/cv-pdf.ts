import { jsPDF } from 'jspdf'
import type { CvFontFamily, CvResume, CvTemplate } from './cv-model'
import { formatRange, nonEmpty, nonEmptyList } from './cv-format'
import { cvTemplateDesign, resolveCvTheme, themeHexToRgb, type CvThemePalette } from './cv-design'

export type CvPdfLabels = {
  summary: string
  work: string
  projects: string
  education: string
  skills: string
  languages: string
  profiles: string
  gpa: string
  courses: string
  untitled: string
}

type Rgb = [number, number, number]

type FontName = 'helvetica' | 'times' | 'courier'

type PdfStyle = {
  fontStyle?: 'normal' | 'bold'
  fontSize?: number
  color?: Rgb
  lineFactor?: number
  gapAfter?: number
}

type PdfCursor = {
  page: number
  x: number
  y: number
  width: number
}

type PdfTheme = {
  primary: Rgb
  text: Rgb
  muted: Rgb
  divider: Rgb
}

type PdfLayout = {
  template: CvTemplate
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
  marginX: number
  topMargin: number
  bottomMargin: number
  withSectionDividers: boolean
}

type PdfContext = {
  doc: jsPDF
  labels: CvPdfLabels
  fontName: FontName
  theme: PdfTheme
  layout: PdfLayout
  onPageAdded?: (page: number) => void
}

type SectionVariant = {
  compact?: boolean
  divider?: boolean
  useBullets?: boolean
}

const fontMap: Record<CvFontFamily, FontName> = {
  inter: 'helvetica',
  roboto: 'helvetica',
  serif: 'times',
}

const toPdfTheme = (palette: CvThemePalette): PdfTheme => ({
  primary: themeHexToRgb(palette.primary),
  text: themeHexToRgb(palette.text),
  muted: themeHexToRgb(palette.muted),
  divider: themeHexToRgb(palette.divider),
})

const toLayout = (template: CvTemplate): PdfLayout => {
  const cfg = cvTemplateDesign[template]
  const unitScale = 0.5
  return {
    template,
    spacing: {
      xs: cfg.spacing.xs * unitScale,
      sm: cfg.spacing.sm * unitScale,
      md: cfg.spacing.md * unitScale,
      lg: cfg.spacing.lg * unitScale,
    },
    fontSizes: cfg.fontSizes,
    lineHeight: cfg.lineHeight,
    marginX: template === 'minimal' ? 17 : 15,
    topMargin: 14,
    bottomMargin: 12,
    withSectionDividers: template !== 'minimal',
  }
}

const pageBottom = (ctx: PdfContext): number => ctx.doc.internal.pageSize.getHeight() - ctx.layout.bottomMargin
const nameColor: Rgb = [17, 24, 39]

const lineHeightMm = (fontSize: number, lineFactor: number): number => fontSize * 0.3528 * lineFactor

const setStyle = (ctx: PdfContext, style: PdfStyle = {}) => {
  const fontSize = style.fontSize ?? ctx.layout.fontSizes.body
  const fontStyle = style.fontStyle ?? 'normal'
  const color = style.color ?? ctx.theme.text

  ctx.doc.setFont(ctx.fontName, fontStyle)
  ctx.doc.setFontSize(fontSize)
  ctx.doc.setTextColor(color[0], color[1], color[2])
  ctx.doc.setLineHeightFactor(style.lineFactor ?? ctx.layout.lineHeight.normal)
}

const ensureSpace = (ctx: PdfContext, cursor: PdfCursor, neededHeight: number) => {
  if (cursor.y + neededHeight <= pageBottom(ctx)) {
    return
  }

  cursor.page += 1
  if (cursor.page > ctx.doc.getNumberOfPages()) {
    ctx.doc.addPage()
  }
  ctx.doc.setPage(cursor.page)
  cursor.y = ctx.layout.topMargin
  ctx.onPageAdded?.(cursor.page)
}

const splitLines = (ctx: PdfContext, text: string, maxWidth: number, style: PdfStyle = {}): string[] => {
  setStyle(ctx, style)
  return ctx.doc.splitTextToSize(text, maxWidth) as string[]
}

const textHeight = (ctx: PdfContext, text: string, width: number, style: PdfStyle = {}): number => {
  const trimmed = text.trim()
  if (!trimmed) {
    return 0
  }

  const lines = splitLines(ctx, trimmed, width, style)
  const fontSize = style.fontSize ?? ctx.layout.fontSizes.body
  const lineFactor = style.lineFactor ?? ctx.layout.lineHeight.normal
  const lineHeight = lineHeightMm(fontSize, lineFactor)
  return lines.length * lineHeight + (style.gapAfter ?? 0)
}

const writeWrapped = (ctx: PdfContext, cursor: PdfCursor, text: string, style: PdfStyle = {}) => {
  const trimmed = text.trim()
  if (!trimmed) {
    return
  }

  const lines = splitLines(ctx, trimmed, cursor.width, style)
  const fontSize = style.fontSize ?? ctx.layout.fontSizes.body
  const lineFactor = style.lineFactor ?? ctx.layout.lineHeight.normal
  const lineHeight = lineHeightMm(fontSize, lineFactor)

  setStyle(ctx, style)

  lines.forEach((line) => {
    ensureSpace(ctx, cursor, lineHeight)
    ctx.doc.setPage(cursor.page)
    ctx.doc.text(line, cursor.x, cursor.y)
    cursor.y += lineHeight
  })

  cursor.y += style.gapAfter ?? 0
}

const writeBullet = (ctx: PdfContext, cursor: PdfCursor, text: string, style: PdfStyle = {}) => {
  const trimmed = text.trim()
  if (!trimmed) {
    return
  }

  const bulletIndent = 4.2
  const contentStyle = { ...style }
  const lines = splitLines(ctx, trimmed, cursor.width - bulletIndent, contentStyle)
  if (lines.length === 0) {
    return
  }

  const fontSize = style.fontSize ?? ctx.layout.fontSizes.body
  const lineFactor = style.lineFactor ?? ctx.layout.lineHeight.normal
  const lineHeight = lineHeightMm(fontSize, lineFactor)
  setStyle(ctx, contentStyle)

  ensureSpace(ctx, cursor, lineHeight)
  ctx.doc.setPage(cursor.page)
  ctx.doc.text('•', cursor.x + 0.8, cursor.y)
  ctx.doc.text(lines[0], cursor.x + bulletIndent, cursor.y)
  cursor.y += lineHeight

  lines.slice(1).forEach((line) => {
    ensureSpace(ctx, cursor, lineHeight)
    ctx.doc.setPage(cursor.page)
    ctx.doc.text(line, cursor.x + bulletIndent, cursor.y)
    cursor.y += lineHeight
  })

  cursor.y += style.gapAfter ?? 0
}

const writeDivider = (ctx: PdfContext, cursor: PdfCursor, color: Rgb = ctx.theme.divider) => {
  const topGap = 1
  const bottomGap = 4
  ensureSpace(ctx, cursor, topGap + bottomGap + 0.8)
  cursor.y += topGap
  ctx.doc.setPage(cursor.page)
  ctx.doc.setDrawColor(color[0], color[1], color[2])
  ctx.doc.setLineWidth(0.2)
  ctx.doc.line(cursor.x, cursor.y, cursor.x + cursor.width, cursor.y)
  cursor.y += bottomGap
}

const writeSectionTitle = (ctx: PdfContext, cursor: PdfCursor, title: string, variant: SectionVariant = {}) => {
  const compact = Boolean(variant.compact)
  const divider = variant.divider ?? ctx.layout.withSectionDividers
  const titleGapAfter = divider ? 0 : ctx.layout.spacing.sm

  cursor.y += 1
  writeWrapped(ctx, cursor, title, {
    fontStyle: 'bold',
    fontSize: compact ? ctx.layout.fontSizes.h3 : ctx.layout.fontSizes.h2,
    color: ctx.theme.primary,
    lineFactor: ctx.layout.lineHeight.tight,
    gapAfter: titleGapAfter,
  })

  if (divider) {
    writeDivider(ctx, cursor)
  }
}

const writeSectionTail = (ctx: PdfContext, cursor: PdfCursor, compact = false) => {
  cursor.y += compact ? ctx.layout.spacing.sm : ctx.layout.spacing.md
}

const writeHeaderClassic = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume) => {
  const name = resume.basics.name.trim() || ctx.labels.untitled
  const role = resume.basics.label.trim()
  const contacts = [resume.basics.email, resume.basics.phone, resume.basics.url, resume.basics.location.address]
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)

  writeWrapped(ctx, cursor, name, {
    fontStyle: 'bold',
    fontSize: ctx.layout.fontSizes.h1,
    color: nameColor,
    lineFactor: ctx.layout.lineHeight.tight,
    gapAfter: ctx.layout.spacing.xs,
  })

  if (role) {
    writeWrapped(ctx, cursor, role, {
      fontSize: ctx.layout.fontSizes.h2,
      color: ctx.theme.primary,
      lineFactor: ctx.layout.lineHeight.tight,
      gapAfter: ctx.layout.spacing.xs,
    })
  }

  if (contacts.length > 0) {
    writeWrapped(ctx, cursor, contacts.join(' | '), {
      fontSize: ctx.layout.fontSizes.meta,
      color: ctx.theme.muted,
      lineFactor: ctx.layout.lineHeight.normal,
      gapAfter: ctx.layout.spacing.sm,
    })
  }

  writeDivider(ctx, cursor, ctx.theme.primary)
}

const writeHeaderMinimal = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume) => {
  const name = resume.basics.name.trim() || ctx.labels.untitled
  const role = resume.basics.label.trim()
  const contacts = [resume.basics.email, resume.basics.phone, resume.basics.url, resume.basics.location.address]
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)

  writeWrapped(ctx, cursor, name, {
    fontStyle: 'bold',
    fontSize: ctx.layout.fontSizes.h1,
    color: nameColor,
    lineFactor: ctx.layout.lineHeight.tight,
    gapAfter: ctx.layout.spacing.xs,
  })

  if (role) {
    writeWrapped(ctx, cursor, role, {
      fontSize: ctx.layout.fontSizes.h3,
      color: ctx.theme.primary,
      lineFactor: ctx.layout.lineHeight.tight,
      gapAfter: ctx.layout.spacing.xs,
    })
  }

  if (contacts.length > 0) {
    writeWrapped(ctx, cursor, contacts.join(' | '), {
      fontSize: ctx.layout.fontSizes.meta,
      color: ctx.theme.muted,
      lineFactor: ctx.layout.lineHeight.normal,
      gapAfter: ctx.layout.spacing.md,
    })
  }
}

const writeHeaderModern = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume) => {
  const name = resume.basics.name.trim() || ctx.labels.untitled
  const role = resume.basics.label.trim()
  const contacts = [resume.basics.email, resume.basics.phone, resume.basics.url, resume.basics.location.address]
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)

  writeWrapped(ctx, cursor, name, {
    fontStyle: 'bold',
    fontSize: ctx.layout.fontSizes.h1,
    color: nameColor,
    lineFactor: ctx.layout.lineHeight.tight,
    gapAfter: ctx.layout.spacing.xs,
  })

  if (role) {
    writeWrapped(ctx, cursor, role, {
      fontSize: ctx.layout.fontSizes.h2,
      color: ctx.theme.primary,
      lineFactor: ctx.layout.lineHeight.tight,
      gapAfter: ctx.layout.spacing.xs,
    })
  }

  if (contacts.length > 0) {
    writeWrapped(ctx, cursor, contacts.join(' | '), {
      fontSize: ctx.layout.fontSizes.meta,
      color: ctx.theme.muted,
      lineFactor: ctx.layout.lineHeight.normal,
      gapAfter: ctx.layout.spacing.sm,
    })
  }

  writeDivider(ctx, cursor, ctx.theme.primary)
}

const writeSummary = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  if (!nonEmpty(resume.basics.summary)) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.summary, variant)
  writeWrapped(ctx, cursor, resume.basics.summary, {
    fontSize: variant.compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
    color: ctx.theme.text,
    lineFactor: ctx.layout.lineHeight.loose,
  })
  writeSectionTail(ctx, cursor, Boolean(variant.compact))
}

const writeItemHeading = (ctx: PdfContext, cursor: PdfCursor, title: string, meta: string, compact = false) => {
  const headingSize = compact ? ctx.layout.fontSizes.h3 : ctx.layout.fontSizes.h3 + 0.2
  const metaSize = ctx.layout.fontSizes.meta

  const titleStyle: PdfStyle = {
    fontStyle: 'bold',
    fontSize: headingSize,
    lineFactor: ctx.layout.lineHeight.tight,
    color: ctx.theme.text,
  }

  const metaStyle: PdfStyle = {
    fontSize: metaSize,
    lineFactor: ctx.layout.lineHeight.tight,
    color: ctx.theme.muted,
  }

  const titleHeight = textHeight(ctx, title, cursor.width - 28, titleStyle)
  const metaHeight = meta ? textHeight(ctx, meta, 28, metaStyle) : 0
  ensureSpace(ctx, cursor, Math.max(titleHeight, metaHeight, ctx.layout.spacing.md))

  writeWrapped(ctx, cursor, title, { ...titleStyle, gapAfter: 0 })

  if (meta) {
    const baselineY = cursor.y - lineHeightMm(titleStyle.fontSize ?? ctx.layout.fontSizes.h3, titleStyle.lineFactor ?? ctx.layout.lineHeight.tight)
    setStyle(ctx, metaStyle)
    ctx.doc.setPage(cursor.page)
    ctx.doc.text(meta, cursor.x + cursor.width, baselineY, { align: 'right' })
  }
}

const writeWork = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.work.filter(
    (item) => nonEmpty(item.position) || nonEmpty(item.name) || nonEmpty(item.summary) || nonEmptyList(item.highlights).length > 0
  )

  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.work, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const title = [item.position.trim() || ctx.labels.untitled, item.name.trim()].filter((entry) => entry.length > 0).join(' - ')
    const dateRange = formatRange(item.startDate, item.endDate)

    writeItemHeading(ctx, cursor, title, dateRange, compact)

    if (nonEmpty(item.url)) {
      writeWrapped(ctx, cursor, item.url, {
        fontSize: ctx.layout.fontSizes.meta,
        color: ctx.theme.muted,
        lineFactor: ctx.layout.lineHeight.normal,
      })
    }

    if (nonEmpty(item.summary)) {
      writeWrapped(ctx, cursor, item.summary, {
        fontSize: compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
        lineFactor: ctx.layout.lineHeight.loose,
      })
    }

    const highlights = nonEmptyList(item.highlights)
    if (variant.useBullets === false) {
      if (highlights.length > 0) {
        writeWrapped(ctx, cursor, highlights.join(' | '), {
          fontSize: ctx.layout.fontSizes.meta,
          color: ctx.theme.muted,
          lineFactor: ctx.layout.lineHeight.normal,
        })
      }
    } else {
      highlights.forEach((highlight) => {
        writeBullet(ctx, cursor, highlight, {
          fontSize: compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
          lineFactor: ctx.layout.lineHeight.normal,
        })
      })
    }

    if (index < items.length - 1) {
      cursor.y += compact ? ctx.layout.spacing.sm : ctx.layout.spacing.md
    }
  })
  writeSectionTail(ctx, cursor, compact)
}

const writeProjects = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.projects.filter(
    (item) => nonEmpty(item.name) || nonEmpty(item.description) || nonEmpty(item.url) || nonEmptyList(item.highlights).length > 0
  )

  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.projects, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const dateRange = formatRange(item.startDate, item.endDate)
    writeItemHeading(ctx, cursor, item.name.trim() || ctx.labels.untitled, dateRange, compact)

    if (nonEmpty(item.url)) {
      writeWrapped(ctx, cursor, item.url, {
        fontSize: ctx.layout.fontSizes.meta,
        color: ctx.theme.muted,
        lineFactor: ctx.layout.lineHeight.normal,
      })
    }

    if (nonEmpty(item.description)) {
      writeWrapped(ctx, cursor, item.description, {
        fontSize: compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
        lineFactor: ctx.layout.lineHeight.loose,
      })
    }

    const highlights = nonEmptyList(item.highlights)
    if (variant.useBullets === false) {
      if (highlights.length > 0) {
        writeWrapped(ctx, cursor, highlights.join(' | '), {
          fontSize: ctx.layout.fontSizes.meta,
          color: ctx.theme.muted,
          lineFactor: ctx.layout.lineHeight.normal,
        })
      }
    } else {
      highlights.forEach((highlight) => {
        writeBullet(ctx, cursor, highlight, {
          fontSize: compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
          lineFactor: ctx.layout.lineHeight.normal,
        })
      })
    }

    if (index < items.length - 1) {
      cursor.y += compact ? ctx.layout.spacing.sm : ctx.layout.spacing.md
    }
  })
  writeSectionTail(ctx, cursor, compact)
}

const writeEducation = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.education.filter(
    (item) => nonEmpty(item.institution) || nonEmpty(item.studyType) || nonEmpty(item.area) || nonEmptyList(item.courses).length > 0
  )

  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.education, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const dateRange = formatRange(item.startDate, item.endDate)
    writeItemHeading(ctx, cursor, item.institution.trim() || ctx.labels.untitled, dateRange, compact)

    const degreeParts = [item.studyType.trim(), item.area.trim()].filter((entry) => entry.length > 0)
    const degreeLine = [degreeParts.join(' - '), nonEmpty(item.score) ? `${ctx.labels.gpa}: ${item.score.trim()}` : '']
      .filter((entry) => entry.length > 0)
      .join(' | ')

    if (degreeLine) {
      writeWrapped(ctx, cursor, degreeLine, {
        fontSize: compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body,
        lineFactor: ctx.layout.lineHeight.normal,
      })
    }

    if (nonEmpty(item.url)) {
      writeWrapped(ctx, cursor, item.url, {
        fontSize: ctx.layout.fontSizes.meta,
        color: ctx.theme.muted,
        lineFactor: ctx.layout.lineHeight.normal,
      })
    }

    const courses = nonEmptyList(item.courses)
    if (courses.length > 0) {
      writeWrapped(ctx, cursor, `${ctx.labels.courses}: ${courses.join(' • ')}`, {
        fontSize: ctx.layout.fontSizes.meta,
        color: ctx.theme.muted,
        lineFactor: ctx.layout.lineHeight.normal,
      })
    }

    if (index < items.length - 1) {
      cursor.y += compact ? ctx.layout.spacing.sm : ctx.layout.spacing.md
    }
  })
  writeSectionTail(ctx, cursor, compact)
}

const writeStackedEntry = (
  ctx: PdfContext,
  cursor: PdfCursor,
  label: string,
  details: string[],
  compact = false
) => {
  const titleSize = compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body
  const detailSize = compact ? ctx.layout.fontSizes.meta : ctx.layout.fontSizes.body

  writeWrapped(ctx, cursor, label, {
    fontStyle: 'bold',
    fontSize: titleSize,
    color: ctx.theme.text,
    lineFactor: ctx.layout.lineHeight.tight,
    gapAfter: ctx.layout.spacing.xs * 0.6,
  })

  details
    .map((detail) => detail.trim())
    .filter((detail) => detail.length > 0)
    .forEach((detail, index, arr) => {
      writeWrapped(ctx, cursor, detail, {
        fontSize: detailSize,
        color: ctx.theme.muted,
        lineFactor: ctx.layout.lineHeight.normal,
        gapAfter: index === arr.length - 1 ? ctx.layout.spacing.sm : ctx.layout.spacing.xs * 0.7,
      })
    })
}

const writeSkills = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.skills.filter((item) => nonEmpty(item.name) || nonEmpty(item.level) || nonEmptyList(item.keywords).length > 0)
  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.skills, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const label = item.name.trim() || ctx.labels.untitled
    const details = [item.level.trim(), nonEmptyList(item.keywords).join(' • ')].filter((entry) => entry.length > 0)
    writeStackedEntry(ctx, cursor, label, details, compact)

    if (index < items.length - 1) {
      cursor.y += ctx.layout.spacing.xs
    }
  })
  writeSectionTail(ctx, cursor, compact)
}

const writeLanguages = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.languages.filter((item) => nonEmpty(item.language) || nonEmpty(item.fluency) || nonEmpty(item.certificate ?? ''))
  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.languages, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const label = item.language.trim() || ctx.labels.untitled
    const details = [item.fluency.trim(), item.certificate?.trim() ?? ''].filter((entry) => entry.length > 0)
    writeStackedEntry(ctx, cursor, label, details, compact)

    if (index < items.length - 1) {
      cursor.y += ctx.layout.spacing.xs
    }
  })
  writeSectionTail(ctx, cursor, compact)
}

const writeLabeledValue = (ctx: PdfContext, cursor: PdfCursor, label: string, value: string, compact = false) => {
  const details = nonEmpty(value) ? [value] : []
  writeStackedEntry(ctx, cursor, label, details, compact)
}

const writeProfiles = (ctx: PdfContext, cursor: PdfCursor, resume: CvResume, variant: SectionVariant = {}) => {
  const items = resume.basics.profiles.filter((item) => nonEmpty(item.network) || nonEmpty(item.url))
  if (items.length === 0) {
    return
  }

  writeSectionTitle(ctx, cursor, ctx.labels.profiles, variant)
  const compact = Boolean(variant.compact)

  items.forEach((item, index) => {
    const label = item.network.trim() || ctx.labels.untitled
    const url = item.url.trim()
    writeLabeledValue(ctx, cursor, label, url, compact)

    if (index < items.length - 1) {
      cursor.y += ctx.layout.spacing.xs
    }
  })
  writeSectionTail(ctx, cursor, compact)
}

const mixRgb = (base: Rgb, target: Rgb, ratio: number): Rgb => {
  const clamp = Math.max(0, Math.min(1, ratio))
  return [
    Math.round(base[0] * (1 - clamp) + target[0] * clamp),
    Math.round(base[1] * (1 - clamp) + target[1] * clamp),
    Math.round(base[2] * (1 - clamp) + target[2] * clamp),
  ]
}

const drawModernSideBackground = (ctx: PdfContext, page: number, x: number, y: number, width: number) => {
  const pageHeight = ctx.doc.internal.pageSize.getHeight()
  const height = pageHeight - ctx.layout.bottomMargin - y
  if (height <= 0) {
    return
  }

  const fill = mixRgb(ctx.theme.primary, [255, 255, 255], 0.94)
  ctx.doc.setPage(page)
  ctx.doc.setFillColor(fill[0], fill[1], fill[2])
  ctx.doc.setDrawColor(ctx.theme.divider[0], ctx.theme.divider[1], ctx.theme.divider[2])
  ctx.doc.setLineWidth(0.2)
  ctx.doc.roundedRect(x, y, width, height, 2.4, 2.4, 'FD')
}

const renderClassicPdf = (ctx: PdfContext, resume: CvResume) => {
  const pageWidth = ctx.doc.internal.pageSize.getWidth()
  const cursor: PdfCursor = {
    page: 1,
    x: ctx.layout.marginX,
    y: ctx.layout.topMargin,
    width: pageWidth - ctx.layout.marginX * 2,
  }

  writeHeaderClassic(ctx, cursor, resume)
  writeSummary(ctx, cursor, resume, { divider: true })
  writeWork(ctx, cursor, resume, { divider: true, useBullets: true })
  writeProjects(ctx, cursor, resume, { divider: true, useBullets: true })
  writeEducation(ctx, cursor, resume, { divider: true })
  writeSkills(ctx, cursor, resume, { divider: true, useBullets: false })
  writeLanguages(ctx, cursor, resume, { divider: true, useBullets: false })
  writeProfiles(ctx, cursor, resume, { divider: true, useBullets: false })
}

const renderMinimalPdf = (ctx: PdfContext, resume: CvResume) => {
  const pageWidth = ctx.doc.internal.pageSize.getWidth()
  const cursor: PdfCursor = {
    page: 1,
    x: ctx.layout.marginX,
    y: ctx.layout.topMargin,
    width: pageWidth - ctx.layout.marginX * 2,
  }

  writeHeaderMinimal(ctx, cursor, resume)
  writeSummary(ctx, cursor, resume, { compact: true, divider: false })
  writeWork(ctx, cursor, resume, { compact: true, divider: false, useBullets: false })
  writeProjects(ctx, cursor, resume, { compact: true, divider: false, useBullets: false })
  writeEducation(ctx, cursor, resume, { compact: true, divider: false })
  writeSkills(ctx, cursor, resume, { compact: true, divider: false, useBullets: false })
  writeLanguages(ctx, cursor, resume, { compact: true, divider: false, useBullets: false })
  writeProfiles(ctx, cursor, resume, { compact: true, divider: false, useBullets: false })
}

const renderModernPdf = (ctx: PdfContext, resume: CvResume) => {
  const pageWidth = ctx.doc.internal.pageSize.getWidth()
  const margin = ctx.layout.marginX
  const columns = cvTemplateDesign.modern.columns ?? { leftRatio: 0.33, rightRatio: 0.67, gap: 8 }
  const totalWidth = pageWidth - margin * 2
  const gap = columns.gap
  const leftWidth = (totalWidth - gap) * columns.leftRatio
  const rightWidth = (totalWidth - gap) * columns.rightRatio

  const header: PdfCursor = {
    page: 1,
    x: margin,
    y: ctx.layout.topMargin,
    width: totalWidth,
  }

  writeHeaderModern(ctx, header, resume)

  const startY = header.y + ctx.layout.spacing.xs
  drawModernSideBackground(ctx, 1, margin, startY, leftWidth)
  ctx.onPageAdded = (page) => {
    drawModernSideBackground(ctx, page, margin, ctx.layout.topMargin, leftWidth)
  }

  const sidePadding = 5
  const leftCursor: PdfCursor = {
    page: 1,
    x: margin + sidePadding,
    y: startY + sidePadding,
    width: leftWidth - sidePadding * 2,
  }
  const rightCursor: PdfCursor = {
    page: 1,
    x: margin + leftWidth + gap,
    y: startY,
    width: rightWidth,
  }

  writeProfiles(ctx, leftCursor, resume, { compact: true, divider: true, useBullets: false })
  writeSkills(ctx, leftCursor, resume, { compact: true, divider: true, useBullets: false })
  writeLanguages(ctx, leftCursor, resume, { compact: true, divider: true, useBullets: false })

  writeSummary(ctx, rightCursor, resume, { compact: false, divider: true })
  writeWork(ctx, rightCursor, resume, { compact: false, divider: true, useBullets: true })
  writeProjects(ctx, rightCursor, resume, { compact: false, divider: true, useBullets: true })
  writeEducation(ctx, rightCursor, resume, { compact: false, divider: true })
  ctx.onPageAdded = undefined
}

const templateRenderers: Record<CvTemplate, (ctx: PdfContext, resume: CvResume) => void> = {
  classic: renderClassicPdf,
  modern: renderModernPdf,
  minimal: renderMinimalPdf,
}

export const downloadCvPdf = (resume: CvResume, labels: CvPdfLabels) => {
  const template = resume.meta.template
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true,
  })

  const themePalette = resolveCvTheme(resume.meta.themeColor)
  const ctx: PdfContext = {
    doc,
    labels,
    fontName: fontMap[resume.meta.fontFamily] ?? 'helvetica',
    theme: toPdfTheme(themePalette),
    layout: toLayout(template),
  }

  const render = templateRenderers[template] ?? renderClassicPdf
  render(ctx, resume)
  doc.save('resume.pdf')
}
